type NewsApiStatus = 'ok' | 'error';

export type NewsApiResponse = {
  status: NewsApiStatus;
  code?: string;
  message?: string;
  totalResults?: number;
  articles?: Articles[];
};

export type Articles = {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: Date;
  content: string;
};

type Sources = {
  id: string;
  name: string;
  description: string;
  publishedAt: string;
  url: string;
  category: string;
  language: string;
  country: string;
};

type Category =
  | 'business'
  | 'entertainment'
  | 'general'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';
