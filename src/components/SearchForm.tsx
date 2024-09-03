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
import { useEffect, useRef, useState } from 'react';
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

  const [searchCriteria, setSearchCriteria] = useState({
    query: state?.fields ? state.fields.query : undefined,
    fromDate: state?.fields ? new Date(state.fields.fromDate) : undefined,
    toDate: state?.fields ? new Date(state.fields.toDate) : undefined,
    searchIn: state?.fields ? state.fields.searchIn : undefined,
    language: state?.fields ? state.fields.language : 'en',
    sortBy: state?.fields ? state.fields.sortBy : undefined,
  });

  const prevSearchCriteria = useRef(searchCriteria);

  const [page, setPage] = useState<number>(1);
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
    formData.set('query', searchCriteria.query ?? '');
    formData.set('from', searchCriteria.fromDate?.toISOString() || '');
    formData.set('to', searchCriteria.toDate?.toISOString() || '');
    formData.set('searchIn', searchCriteria.searchIn ?? '');
    formData.set('language', searchCriteria.language ?? '');
    formData.set('sortBy', searchCriteria.sortBy ?? '');
    formData.set('page', String(newPage));
    formAction(formData);
  };

  return (
    <form
      action={(formData) => {
        if (
          JSON.stringify(prevSearchCriteria.current) !==
          JSON.stringify(searchCriteria)
        ) {
          setPage(1);
          prevSearchCriteria.current = searchCriteria;
        }
        formData.set('query', searchCriteria.query ?? '');
        formData.set('from', searchCriteria.fromDate?.toISOString() || '');
        formData.set('to', searchCriteria.toDate?.toISOString() || '');
        formData.set('searchIn', searchCriteria.searchIn ?? '');
        formData.set('language', searchCriteria.language ?? '');
        formData.set('sortBy', searchCriteria.sortBy ?? '');
        formData.set('page', page.toString());
        formAction(formData);
      }}
      className='grid grid-cols-1 md:grid-cols-3 gap-4 w-3/4'
    >
      {state?.errors?.query && <p>{state.errors.query}</p>}
      <Label>Keyword or phrase:</Label>
      <Input
        className='col-span-3'
        id='query'
        name='query'
        type='text'
        value={searchCriteria.query ?? ''}
        onChange={(e) =>
          setSearchCriteria((prev) => ({ ...prev, query: e.target.value }))
        }
        required
      />
      <div className='col-span-3 md:col-span-1'>
        <Select
          value={searchCriteria.searchIn}
          onValueChange={(value) =>
            setSearchCriteria((prev) => ({ ...prev, searchIn: value }))
          }
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
      </div>
      <div className='col-span-3 md:col-span-1'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size={'lg'}
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal col-span-1',
                !searchCriteria.fromDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {searchCriteria.fromDate ? (
                format(searchCriteria.fromDate, 'PPP')
              ) : (
                <span>From date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={searchCriteria.fromDate}
              onSelect={(date) => {
                setSearchCriteria((prev) => ({ ...prev, fromDate: date }));
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='col-span-3 md:col-span-1'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size={'lg'}
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !searchCriteria.toDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {searchCriteria.toDate ? (
                format(searchCriteria.toDate, 'PPP')
              ) : (
                <span>To date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={searchCriteria.toDate}
              onSelect={(date) =>
                setSearchCriteria((prev) => ({ ...prev, toDate: date }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='col-span-3 md:col-span-1'>
        <Select
          value={searchCriteria.language}
          onValueChange={(value) =>
            setSearchCriteria((prev) => ({ ...prev, language: value }))
          }
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
      </div>
      <div className='col-span-3 md:col-span-1'>
        <Select
          value={searchCriteria.sortBy}
          onValueChange={(value) =>
            setSearchCriteria((prev) => ({ ...prev, sortBy: value }))
          }
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
      </div>
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
        {totalPages !== 0 ? (
          <span className='mx-4'>{`Page ${page} of ${totalPages}`}</span>
        ) : (
          ''
        )}
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
