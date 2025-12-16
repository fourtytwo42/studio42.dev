import { NextResponse } from 'next/server';
import { getGroqClient, generateChatCompletion } from '@/lib/groq';
import { searchKnowledgeBase } from '@/lib/semantic-search';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validation';

// Get products list for system prompt
async function getProductsList(): Promise<string> {
  try {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        name: true,
        demoUrl: true,
      },
      orderBy: { name: 'asc' },
    });
    return products.map((p) => {
      const productPageUrl = `https://studio42.dev/products/${p.slug}`;
      const demoInfo = p.demoUrl ? ` | Demo: ${p.demoUrl}` : '';
      return `- ${p.name} (slug: ${p.slug}) | Product Page: ${productPageUrl}${demoInfo}`;
    }).join('\n');
  } catch (error) {
    console.error('Error fetching products:', error);
    return '';
  }
}

const SYSTEM_PROMPT_BASE = `You are a specialized AI assistant for Studio42.dev, a premium vendor of self-hosted SaaS solutions.

CRITICAL GUARDRAILS - YOU MUST FOLLOW THESE RULES:

1. SCOPE LIMITATIONS:
   - You can ONLY discuss Studio42.dev products and services
   - You can compare our products to similar industry solutions when relevant
   - You MUST politely refuse any conversation outside this scope (recipes, stories, general chat, etc.)
   - When refusing, say: "I'm specialized in helping with Studio42.dev products. I can help you with information about our products, features, demos, or connect you with our sales team. How can I assist you with Studio42.dev?"

2. MESSAGING RESTRICTIONS - NEVER SAY:
   - "fork" or "forking" - we are a premium vendor, not open source
   - "free" or "free to use" - nothing is free, we are a premium vendor
   - "open source" - we are NOT open source, we are a premium vendor
   - "community" or "community-driven" - we are a commercial vendor
   - Instead, emphasize: "premium", "self-hosted", "enterprise-ready", "professional support", "commercial vendor"

3. PRICING INQUIRIES:
   - When users ask about pricing, you MUST gather their information and use the submit_contact_form tool
   - NEVER provide specific pricing information
   - Always say: "Pricing is customized based on your needs. Let me gather your information and connect you with our sales team."
   - Collect: name, email, phone (if available), company (if available), and what they're interested in
   - Include the full conversation context in the message field when submitting

4. CONTACT FORM SUBMISSION:
   - Before submitting, you MUST gather: name, email, and at minimum ask for phone/company if not provided
   - The message field MUST include:
     * What the user was asking about
     * Full conversation context/summary
     * Their specific needs or questions
   - Use the submit_contact_form tool to submit on behalf of the user
   - After successful submission, confirm to the user that their inquiry was sent

5. PRODUCT INFORMATION:
   - Use search_knowledge_base tool to find accurate product information
   - Only discuss products that exist in our catalog
   - PRODUCT URLS - CRITICAL - ALWAYS USE THESE FORMATS:
     * Product Information Pages (for features, details, documentation): 
       Format: https://studio42.dev/products/[slug]
       Examples: 
       - https://studio42.dev/products/lms
       - https://studio42.dev/products/ai-microlearning-lms
       - https://studio42.dev/products/organizational-ai-assistant
       - https://studio42.dev/products/itsm-helpdesk
       - https://studio42.dev/products/restaurant-order-delivery-app
     * Demo Pages (for trying the product): 
       Use the demoUrl from the product list (e.g., https://lms.studio42.dev)
       These are live interactive demos of the products
     * When to use which:
       - Product info/features/details → Use https://studio42.dev/products/[slug]
       - Try the product/interactive demo → Use the demoUrl (e.g., https://lms.studio42.dev)
     * NEVER make up URLs - always use the exact URLs from the product list provided below

6. TONE:
   - Be professional, helpful, and friendly
   - Stay focused on Studio42.dev products
   - Redirect off-topic conversations politely but firmly

Remember: You are a sales and support assistant for a premium commercial vendor. Maintain that positioning in all interactions.`;

const TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'search_knowledge_base',
      description: 'Search the knowledge base for information about products, features, pricing, or FAQs',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find relevant information',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'submit_contact_form',
      description: 'Submit a contact form on behalf of the user. REQUIRED for pricing inquiries, demo requests, sales inquiries, or any request that needs human follow-up. You MUST gather the user\'s name and email before calling this tool. The message field MUST include: (1) what the user was asking about, (2) full conversation context/summary, (3) their specific needs or questions. Always use this tool when users ask about pricing, want to speak with sales, request demos, or need information that requires human contact.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: "The user's full name - REQUIRED. Ask for this if not provided.",
          },
          email: {
            type: 'string',
            description: "The user's email address - REQUIRED. Ask for this if not provided.",
          },
          company: {
            type: 'string',
            description: "The user's company name (optional but recommended - ask if relevant)",
          },
          phone: {
            type: 'string',
            description: "The user's phone number (optional but recommended - ask if relevant)",
          },
          product: {
            type: 'string',
            description: 'The product slug they are interested in (e.g., "lms", "ai-microlearning-lms", "organizational-ai-assistant", "itsm-helpdesk", "restaurant-order-delivery-app")',
          },
          inquiryType: {
            type: 'string',
            description: 'Type of inquiry: CONTACT_SALES (for pricing), REQUEST_DEMO (for demo requests), TECHNICAL_SUPPORT (for technical questions), GENERAL_INQUIRY (for general questions), or OTHER',
            enum: ['CONTACT_SALES', 'REQUEST_DEMO', 'TECHNICAL_SUPPORT', 'GENERAL_INQUIRY', 'OTHER'],
          },
          message: {
            type: 'string',
            description: 'REQUIRED: Must include (1) what the user was asking about, (2) full conversation context/summary, (3) their specific needs or questions. Include all relevant details from the conversation.',
          },
        },
        required: ['name', 'email', 'message', 'inquiryType'],
      },
    },
  },
];

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Check rate limit
    const rateLimit = await checkRateLimit(ip, 20, 60000); // 20 requests per minute
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          resetAt: rateLimit.resetAt.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get products list and build system prompt
    const productsList = await getProductsList();
    const systemPromptWithProducts = productsList
      ? `${SYSTEM_PROMPT_BASE}\n\nOur Products:\n${productsList}`
      : SYSTEM_PROMPT_BASE;

    // Perform semantic search to get relevant context
    let knowledgeBaseContext = '';
    try {
      const searchResults = await searchKnowledgeBase(message, 5);
      if (searchResults.length > 0) {
        knowledgeBaseContext = searchResults
          .map((result) => `**${result.title}**\n${result.content}`)
          .join('\n\n---\n\n');
      }
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      // Continue without knowledge base context if search fails
    }

    // Build messages array (OpenAI-compatible format for Groq)
    const messages: Array<
      | { role: 'system' | 'user' | 'assistant'; content: string }
      | { role: 'assistant'; content: string; tool_calls?: any[] }
      | { role: 'tool'; tool_call_id: string; content: string }
    > = [
      {
        role: 'system',
        content: knowledgeBaseContext
          ? `${systemPromptWithProducts}\n\nRelevant Information from Knowledge Base:\n${knowledgeBaseContext}`
          : systemPromptWithProducts,
      },
      ...history,
      {
        role: 'user',
        content: message,
      },
    ];

    // Call Groq API with OpenAI-compatible tool calling
    // Groq's GPT OSS 20B supports OpenAI-compatible tool calling format
    const completion = await generateChatCompletion(messages, TOOLS, 'auto');

    const assistantMessage = completion.choices[0]?.message;
    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    let response = assistantMessage.content || '';
    const toolCalls = assistantMessage.tool_calls || [];

    // Handle tool calls
    const toolResults: Array<{ tool_call_id: string; role: 'tool'; content: string }> = [];

    for (const toolCall of toolCalls) {
      if (toolCall.function.name === 'search_knowledge_base') {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          const searchResults = await searchKnowledgeBase(args.query, 5);
          
          const searchContent = searchResults.length > 0
            ? searchResults
                .map((result) => `**${result.title}** (Similarity: ${(result.similarity * 100).toFixed(1)}%)\n${result.content}`)
                .join('\n\n---\n\n')
            : 'No relevant information found in the knowledge base.';

          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: searchContent,
          });
        } catch (error) {
          console.error('Error executing search_knowledge_base tool:', error);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: 'Error searching knowledge base. Please try again.',
          });
        }
      } else if (toolCall.function.name === 'submit_contact_form') {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          
          // Build conversation context for the message
          const conversationContext = history
            .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n\n');
          
          // Enhance message with conversation context if not already included
          const enhancedMessage = conversationContext && !args.message.includes('Conversation context:')
            ? `${args.message}\n\n---\n\nConversation context:\n${conversationContext}`
            : args.message;
          
          // Validate form data
          const formData = {
            name: args.name,
            email: args.email,
            company: args.company || '',
            phone: args.phone || '',
            product: args.product || '',
            inquiryType: args.inquiryType || 'GENERAL_INQUIRY',
            message: enhancedMessage,
            contactMethod: 'EMAIL',
          };

          const validation = contactFormSchema.safeParse(formData);
          if (!validation.success) {
            toolResults.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              content: `Validation error: ${validation.error.errors.map((e) => e.message).join(', ')}. Please provide all required information.`,
            });
            continue;
          }

          // Create contact record
          const contact = await prisma.contact.create({
            data: {
              name: validation.data.name,
              email: validation.data.email,
              company: validation.data.company || null,
              phone: validation.data.phone || null,
              product: validation.data.product || null,
              inquiryType: validation.data.inquiryType,
              message: validation.data.message,
              preferredMethod: validation.data.contactMethod,
              source: 'ai-assistant',
            },
          });

          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: `Contact form submitted successfully! Your inquiry has been received and our team will get back to you soon. Reference ID: ${contact.id.substring(0, 8)}`,
          });
        } catch (error) {
          console.error('Error executing submit_contact_form tool:', error);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: 'Error submitting contact form. Please try again or visit the contact page directly at /contact.',
          });
        }
      }
    }

    // If there are tool results, make another API call with tool results
    if (toolResults.length > 0) {
      const followUpMessages = [
        ...messages,
        {
          role: 'assistant' as const,
          content: response,
          tool_calls: toolCalls,
        },
        ...toolResults,
      ];

      const followUpCompletion = await generateChatCompletion(followUpMessages, TOOLS, 'none');
      const followUpMessage = followUpCompletion.choices[0]?.message;
      response = followUpMessage?.content || response;
    }

    return NextResponse.json({
      message: response,
      toolCalls: toolCalls.length > 0 ? toolCalls.map((tc) => tc.function.name) : undefined,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        message: 'An error occurred while processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}

