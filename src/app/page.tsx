import ArticleCards from '@/components/ArticleCards';
import SearchForm from '@/components/SearchForm';

export default function Home() {
  return (
    <div className='w-full'>
      <div className='flex flex-col justify-center items-center gap-4 m-4'>
        <h1 className='text-2xl'>
          Search 150,000 news sources worldwide using the <i>News API</i>
        </h1>
        <SearchForm />
        <ArticleCards />
      </div>
    </div>
  );
}
