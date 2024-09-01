import { z } from 'zod';
import { NewsApiResponse } from '../types';

export const searchSchema = z.object({
  query: z.string().min(1).max(500),
  searchIn: z
    .enum(['title', 'description', 'content'])
    .nullable()
    .or(z.literal('')),
  from: z.date().nullable(),
  to: z.date().nullable(),
  language: z
    .enum([
      'ar',
      'de',
      'en',
      'es',
      'fr',
      'he',
      'it',
      'nl',
      'no',
      'pt',
      'ru',
      'sv',
      'ud',
      'zh',
    ])
    .nullable()
    .or(z.literal('')),
  sortBy: z
    .enum(['relevancy', 'popularity', 'publishedAt'])
    .nullable()
    .or(z.literal('')),
  page: z.number(),
});

export type SearchSchemaType = z.output<typeof searchSchema>;

export type SearchSchemaState =
  | {
      response?: NewsApiResponse;
      totalPages?: number;
      fields?: Record<string, string>;
      errors?: {
        query?: string[];
        searchIn?: string[];
        from?: string[];
        to?: string[];
        sortBy?: string[];
        language?: string[];
        pageSize?: string[];
        page?: string[];
      };
    }
  | undefined;
