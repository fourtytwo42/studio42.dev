import { NextResponse } from 'next/server';
import { getGroqClient, generateChatCompletion } from '@/lib/groq';
import { searchKnowledgeBase } from '@/lib/semantic-search';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/validation';

const SYSTEM_PROMPT = `You are a helpful AI assistant for Studio42.dev, a company that offers multiple SaaS products.

Your role is to:
- Answer questions about our products, features, pricing, and services
- Help users find information using the searchable knowledge base
- Assist users in submitting contact forms for demos or sales inquiries
- Provide links to product demos, GitHub repositories, and YouTube channels

When you need specific information, use the search_knowledge_base tool to find relevant content.

Be friendly, professional, and helpful. If a user wants to request a demo or contact sales, guide them through the contact form submission process.`;

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
      description: 'Submit a contact form on behalf of the user for demo requests, sales inquiries, or support',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: "The user's full name",
          },
          email: {
            type: 'string',
            description: "The user's email address",
          },
          company: {
            type: 'string',
            description: "The user's company name (optional)",
          },
          phone: {
            type: 'string',
            description: "The user's phone number (optional)",
          },
          product: {
            type: 'string',
            description: 'The product slug they are interested in (optional)',
          },
          inquiryType: {
            type: 'string',
            description: 'Type of inquiry: GENERAL_INQUIRY, REQUEST_DEMO, CONTACT_SALES, TECHNICAL_SUPPORT, or OTHER',
          },
          message: {
            type: 'string',
            description: 'The message or inquiry details',
          },
        },
        required: ['name', 'email', 'message'],
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

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: knowledgeBaseContext
          ? `${SYSTEM_PROMPT}\n\nRelevant Information from Knowledge Base:\n${knowledgeBaseContext}`
          : SYSTEM_PROMPT,
      },
      ...history,
      {
        role: 'user',
        content: message,
      },
    ];

    // Call Groq API
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
          
          // Validate form data
          const formData = {
            name: args.name,
            email: args.email,
            company: args.company || '',
            phone: args.phone || '',
            product: args.product || '',
            inquiryType: args.inquiryType || 'GENERAL_INQUIRY',
            message: args.message,
            contactMethod: 'EMAIL',
          };

          const validation = contactFormSchema.safeParse(formData);
          if (!validation.success) {
            toolResults.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              content: `Validation error: ${validation.error.errors.map((e) => e.message).join(', ')}`,
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
            content: `Contact form submitted successfully! Your inquiry has been received and we'll get back to you soon. Reference ID: ${contact.id.substring(0, 8)}`,
          });
        } catch (error) {
          console.error('Error executing submit_contact_form tool:', error);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: 'Error submitting contact form. Please try again or visit the contact page directly.',
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

