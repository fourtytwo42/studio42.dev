import Groq from 'groq-sdk';
import { getEnvVar } from './env';

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = getEnvVar('GROQ_API_KEY');
    groqClient = new Groq({
      apiKey,
    });
  }
  return groqClient;
}

export async function generateChatCompletion(
  messages: Array<
    | { role: 'system' | 'user' | 'assistant'; content: string }
    | { role: 'tool'; tool_call_id: string; content: string }
    | { role: 'assistant'; content: string; tool_calls?: any[] }
  >,
  tools?: Array<{
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }>,
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
) {
  const client = getGroqClient();
  // Use GPT OSS 20B model - OpenAI-compatible tool calling
  const model = getEnvVar('GROQ_MODEL', 'openai/gpt-oss-20b');

  // Groq uses OpenAI-compatible API format
  const response = await client.chat.completions.create({
    model,
    messages: messages as any,
    tools: tools as any, // OpenAI-compatible tool format
    tool_choice: toolChoice as any, // 'auto', 'none', or specific function
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Note: Groq doesn't have a direct embedding API, so we use OpenAI-compatible embedding
  const embeddingModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
  
  // Use OpenAI for embeddings (common approach)
  if (embeddingModel.includes('text-embedding')) {
    const { default: OpenAI } = await import('openai');
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required for embedding generation. Please set it in your .env file.');
    }
    
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });
    
    const response = await openai.embeddings.create({
      model: embeddingModel,
      input: text,
    });
    
    return response.data[0].embedding;
  }
  
  // Fallback: return empty embedding (should be replaced with actual implementation)
  throw new Error('Embedding generation not properly configured');
}

