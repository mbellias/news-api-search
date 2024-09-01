'use client';

import { SearchNews } from '@/actions/news';
import useArticle from '@/components/hooks/use-article';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ArticleCardSkeleton } from './ArticleCards';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';

function Submit() {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        type='submit'
        className='col-span-3 uppercase'
        disabled={pending}
      >
        Search
      </Button>
      {pending && (
        <div className='w-full mt-20'>
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              className='p-2'
              key={skeleton}
            >
              <ArticleCardSkeleton />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SearchForm() {
  const [state, formAction] = useFormState(SearchNews, undefined);

  const [fromDate, setFromDate] = useState<Date | undefined>(
    state?.fields ? new Date(state.fields.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    state?.fields ? new Date(state.fields.toDate) : undefined
  );
  const [searchIn, setSearchIn] = useState<string | undefined>(
    state?.fields ? state.fields.searchIn : undefined
  );
  const [language, setLanguage] = useState<string>(
    state?.fields ? state.fields.languge : 'en'
  );
  const [sortBy, setSortBy] = useState<string | undefined>(
    state?.fields ? state.fields.sortBy : undefined
  );
  const [page, setPage] = useState<number>(1); // Add state for page
  const [totalPages, setTotalPages] = useState(1);

  const { setArticles, setIsMounted } = useArticle();

  useEffect(() => {
    if (state?.response?.articles && state.response.status === 'ok') {
      setIsMounted(true);
      setArticles(state.response.articles);
      setTotalPages(state.totalPages!);
    }
    if (state?.errors) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong, please try again.',
      });
      console.log(state?.errors);
    }
  }, [state, setIsMounted]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const formData = new FormData();
    formData.set('page', String(newPage));
    formAction(formData); // Re-submit the form with the new page number
  };

  return (
    <form
      action={(formData) => {
        formData.set('from', fromDate?.toISOString() || '');
        formData.set('to', toDate?.toISOString() || '');
        formData.set('searchIn', searchIn ?? '');
        formData.set('language', language ?? '');
        formData.set('sortBy', sortBy ?? '');
        formData.set('page', page.toString()); // Include page in the form data
        formAction(formData);
      }}
      className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 lg:w-1/2 md:w-3/4 sm:w-4/5'
    >
      {state?.errors?.query && (
        <p className='col-span-3 justify-start text-red-500'>
          {state.errors.query}
        </p>
      )}
      <div className='col-span-3'>
        <Label>Keyword or phrase:</Label>
        <Input
          id='query'
          name='query'
          type='text'
          required
        />
      </div>
      <Select
        value={searchIn}
        onValueChange={setSearchIn}
      >
        <SelectTrigger>
          <SelectValue placeholder='Select where to search' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='title'>Title</SelectItem>
          <SelectItem value='description'>Description</SelectItem>
          <SelectItem value='content'>Content</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={'lg'}
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal col-span-1',
              !fromDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {fromDate ? format(fromDate, 'PPP') : <span>From date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={fromDate}
            onSelect={(date) => {
              setFromDate(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={'lg'}
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !toDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {toDate ? format(toDate, 'PPP') : <span>From date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={toDate}
            onSelect={setToDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Select
        value={language}
        onValueChange={setLanguage}
      >
        <SelectTrigger>
          <SelectValue placeholder='Language' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ar'>Arabic</SelectItem>
          <SelectItem value='de'>German</SelectItem>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='es'>Spanish</SelectItem>
          <SelectItem value='fr'>French</SelectItem>
          <SelectItem value='he'>Hebrew</SelectItem>
          <SelectItem value='it'>Italian</SelectItem>
          <SelectItem value='nl'>Dutch</SelectItem>
          <SelectItem value='no'>Norwegian</SelectItem>
          <SelectItem value='pt'>Portuguese</SelectItem>
          <SelectItem value='ru'>Russian</SelectItem>
          <SelectItem value='sv'>Swedish</SelectItem>
          <SelectItem value='zh'>Chinese</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sortBy}
        onValueChange={setSortBy}
      >
        <SelectTrigger>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='relevancy'>Relevancy</SelectItem>
          <SelectItem value='popularity'>Popularity</SelectItem>
          <SelectItem value='publishedAt'>Publication date</SelectItem>
        </SelectContent>
      </Select>
      <Submit />
      <div className='flex col-span-3 w-full items-center justify-center mt-4 gap-4'>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          &larr;
        </Button>
        <span className='mx-4'>{`Page ${page} of ${totalPages}`}</span>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          &rarr;
        </Button>
      </div>
    </form>
  );
}

export default SearchForm;
