import { prisma } from './prisma';
import { createEmbedding } from './embeddings';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  similarity: number;
}

/**
 * Perform semantic search on knowledge base
 */
export async function searchKnowledgeBase(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await createEmbedding(query);

    // Search using pgvector
    // Note: This uses Prisma's raw query for vector similarity search
    const results = await prisma.$queryRaw<Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      similarity: number;
    }>>`
      SELECT 
        id,
        title,
        content,
        category,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
      FROM "KnowledgeBase"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
      LIMIT ${limit}
    `;

    return results.map((result) => ({
      id: result.id,
      title: result.title,
      content: result.content,
      category: result.category,
      similarity: Number(result.similarity),
    }));
  } catch (error) {
    console.error('Error performing semantic search:', error);
    throw new Error('Failed to perform semantic search');
  }
}

/**
 * Add or update knowledge base entry with embedding
 */
export async function upsertKnowledgeBaseEntry(
  id: string,
  title: string,
  content: string,
  category: string,
  productSlug?: string
): Promise<void> {
  try {
    // Generate embedding for the content
    const embedding = await createEmbedding(`${title} ${content}`);

    // Use raw SQL for vector operations since Prisma doesn't support vector type directly
    await prisma.$executeRaw`
      INSERT INTO "KnowledgeBase" (id, title, content, category, "productSlug", embedding, "createdAt", "updatedAt")
      VALUES (${id}, ${title}, ${content}, ${category}, ${productSlug || null}, ${JSON.stringify(embedding)}::vector, NOW(), NOW())
      ON CONFLICT (id) 
      DO UPDATE SET
        title = ${title},
        content = ${content},
        category = ${category},
        "productSlug" = ${productSlug || null},
        embedding = ${JSON.stringify(embedding)}::vector,
        "updatedAt" = NOW()
    `;
  } catch (error) {
    console.error('Error upserting knowledge base entry:', error);
    throw new Error('Failed to upsert knowledge base entry');
  }
}

