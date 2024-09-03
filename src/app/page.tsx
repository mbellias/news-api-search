import ArticleCards from '@/components/ArticleCards';
import SearchForm from '@/components/SearchForm';
import { ModeToggle } from '@/components/theme/ModeToggle';

export default function Home() {
  return (
    <div className='w-full'>
      <div className='p-2'>
        <ModeToggle />
      </div>
      <div className='flex flex-col justify-center items-center gap-4 m-4'>
        <h1 className='text-2xl '>
          Search for news articles using the <i>News API</i>
        </h1>
        <SearchForm />
        <ArticleCards />
      </div>
    </div>
  );
}
