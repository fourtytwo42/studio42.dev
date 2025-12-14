import { ProductStatus } from '@prisma/client';

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  status: ProductStatus;
  thumbnail: string | null;
  githubUrl: string | null;
  youtubeUrl: string | null;
  demoUrl: string | null;
  pricing: string | null;
  features?: ProductFeature[] | null;
  createdAt: Date;
  updatedAt: Date;
}
