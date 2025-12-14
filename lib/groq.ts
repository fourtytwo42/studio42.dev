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
  const model = getEnvVar('GROQ_MODEL', 'llama-3.1-70b-versatile');

  const response = await client.chat.completions.create({
    model,
    messages: messages as any,
    tools: tools as any,
    tool_choice: toolChoice as any,
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getGroqClient();
  
  // Note: Groq doesn't have a direct embedding API, so we'll use OpenAI-compatible embedding
  // For now, we'll use a workaround or external embedding service
  // This is a placeholder - you may need to use OpenAI's embedding API or another service
  const embeddingModel = getEnvVar('EMBEDDING_MODEL', 'text-embedding-3-small');
  
  // If using OpenAI for embeddings (common approach)
  if (embeddingModel.includes('text-embedding')) {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: getEnvVar('OPENAI_API_KEY', process.env.OPENAI_API_KEY || ''),
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

