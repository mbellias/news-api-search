'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useArticle from '@/components/hooks/use-article';
import { Articles } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

function ArticleCards() {
  const { articles, isMounted } = useArticle();

  return (
    <div className='flex flex-col items-center justify-center gap-4 m-8'>
      {articles.length > 0 &&
        articles.map((article, i) => (
          <ArticleCard
            key={i}
            article={article}
          />
        ))}
      {articles.length < 1 && isMounted && (
        <p className='text-lg'>No articles were found.</p>
      )}
    </div>
  );
}

export default ArticleCards;

export function ArticleCardSkeleton() {
  return (
    <div className='flex flex-col gap-2 border border-solid border-primary-foreground rounded-lg w-3/4 h-1/4 p-4'>
      <Skeleton className='w-full h-4 rounded-xl' />
      <Skeleton className='w-20 h-4 rounded-xl' />
      <Skeleton className='w-1/6 h-4 rounded-xl' />
      <Skeleton className='w-1/4 aspect-square rounded-xl place-self-center my-2' />
      <Skeleton className='w-3/4 h-4 rounded-xl place-self-center' />
      <Skeleton className='w-3/4 h-4 rounded-xl place-self-center' />
      <Skeleton className='w-1/2 h-4 rounded-xl mt-8' />
    </div>
  );
}

function ArticleCard({ article }: { article: Articles }) {
  return (
    <Card className='w-4/5 m-2 md:w-3/4'>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <p>{article.source.name}</p>
        {article.author && (
          <div className='text-sm'>
            <span className='text-muted-foreground'>Article written by</span>{' '}
            {article.author}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            width={300}
            height={300}
          />
        )}
        <CardDescription className='text-md'>
          {article.description}
        </CardDescription>
        <p className='text-sm text-foreground mt-2'>
          {format(article.publishedAt, 'PPPpp')}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={article.url}
          className='underline italic text-wrap text-sm overflow-auto'
        >
          {article.url}
        </Link>
      </CardFooter>
    </Card>
  );
}
