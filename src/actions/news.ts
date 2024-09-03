'use server';

import { searchSchema, SearchSchemaState } from '@/lib/schemas/search-news';
import { NewsApiResponse } from '@/lib/types';

export async function SearchNews(
  prevState: SearchSchemaState,
  data: FormData
): Promise<SearchSchemaState> {
  const formData = {
    query: data.get('query'),
    from: data.get('from') ? new Date(data.get('from') as string) : null,
    to: data.get('to') ? new Date(data.get('to') as string) : null,
    searchIn: data.get('searchIn') as
      | 'title'
      | 'description'
      | 'content'
      | null,
    language: data.get('language') as
      | 'ar'
      | 'de'
      | 'en'
      | 'es'
      | 'fr'
      | 'he'
      | 'it'
      | 'nl'
      | 'no'
      | 'pt'
      | 'ru'
      | 'sv'
      | 'ud'
      | 'zh'
      | null,
    sortBy: data.get('sortBy') as
      | 'relevancy'
      | 'popularity'
      | 'publishedAt'
      | null,
    page: data.get('page') ? parseInt(data.get('page') as string, 10) : 1,
  };

  console.log(formData);
  const parsed = searchSchema.safeParse(formData);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, fields: parsed.data };
  }

  const baseUrl = 'https://newsapi.org/v2/everything';
  const params = new URLSearchParams();

  params.append('q', parsed.data.query);
  params.append('pageSize', '10');
  params.append('page', String(parsed.data.page));

  if (parsed.data.from)
    params.append('from', parsed.data.from.toISOString().split('T')[0]);
  if (parsed.data.to)
    params.append('to', parsed.data.to.toISOString().split('T')[0]);
  if (parsed.data.searchIn) params.append('searchIn', parsed.data.searchIn);
  if (parsed.data.language) params.append('language', parsed.data.language);
  if (parsed.data.sortBy) params.append('sortBy', parsed.data.sortBy);

  params.append('apiKey', `${process.env.NEWS_API_KEY}`);

  const searchUrl = `${baseUrl}?${params.toString()}`;

  const results = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const response: NewsApiResponse = await results.json();
  const totalResults = response.totalResults || 0;
  const totalPages = Math.ceil(totalResults / 10);

  console.log(response);
  return { response, totalPages };
}
