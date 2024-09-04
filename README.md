## News API Search Form - Next.js, Typescript, Tailwind CSS

This is an app that queries the News API's '/everything' endpoint. The form takes the query parameters for the endpoint and submits them to a server action which appends the parameters to the URL and sends the request to the API. The results are then paginated to 10 results per page.

## Next.js 14 App Router Boilerplate

```bash
npx create-next-app@latest
```

## shadcn/ui

The UI was created with components from shadcn/ui. All of the UI components are in the '/components/ui' directory.

```bash
npx shadcn@latest init
```

## Dark mode

Shadcn/ui also offers dark mode out of the box. The steps in this guide is how I added it: https://ui.shadcn.com/docs/dark-mode/next

## News API Response Object

The types for the API response were defined based of the docs from the News API website: https://newsapi.org/docs/endpoints/everything

```bash
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
```

## Server Actions and useFormState

The form is handled by the useFormState hook. This hook is used in client-components only. The first parameter is the server action that handles the form data and sends the api request, the second argument is the inital state of the form.

```bash
'use client'
```
```bash
const [state, formAction] = useFormState(SearchNews, undefined);
```

## Form Action and Form Data

The formAction function is defined to take an argument of type FormData which is a built-in class in Javascript.

```bash
const formAction = (payload: FormData) => void
```

The set method is used to set the data in the formData object when the form is submitted:

```bash
formData.set('query', searchCriteria.query ?? '');
formData.set('from', searchCriteria.fromDate?.toISOString() || '');
formData.set('to', searchCriteria.toDate?.toISOString() || '');
formData.set('searchIn', searchCriteria.searchIn ?? '');
formData.set('language', searchCriteria.language ?? '');
formData.set('sortBy', searchCriteria.sortBy ?? '');
formData.set('page', page.toString());
```

## Pending State and useFormStatus

In order for the pending value that comes from the useFormStatus hook to work, the submit button must be a child of a form element.

```bash
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

https://react.dev/reference/react-dom/hooks/useFormStatus

## Pagination

The News API endpoint that's being queried takes the parameters 'page' and 'pageSize':

```
pageSize
int
The number of results to return per page.
Default: 100. Maximum: 100.

page
int
Use this to page through the results.
Default: 1.
```
https://newsapi.org/docs/endpoints/everything

The pageChange handler uses the setPage state action to update the page and instantiates a FormData object and then sets the searchCriteria state and the new page number in the object and calls formAction:

```bash
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
```

A ref is used to check if the searchCriteria changed:

```bash
const prevSearchCriteria = useRef(searchCriteria);
```

When the form is submitted, the if statement checks to see if the searchCriteria changed. If it did change, the results will be set back to page 1. Otherwise the pageChangeHandler seperately handles which page of the current state of the results are displaying.

```bash
if (
  JSON.stringify(prevSearchCriteria.current) !==
  JSON.stringify(searchCriteria)
) {
  setPage(1);
  prevSearchCriteria.current = searchCriteria;
}
```

## Server Action Setup

Server actions take 2 parameters, prevState and formData. The prevState parameter is an object that contains data pertaining to different states of the form. The formData is the data that was submitted by the user.

```bash
'use server'

export async function SearchNews(
  prevState: SearchSchemaState,
  data: FormData
): Promise<SearchSchemaState> {
  /* ... */
}
```

### Form State

```bash
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
```

## Zod and Server-side Validation

The form submission is validated on the server using zod. This the form validation schema:
```bash
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
```

The data is then parsed using the zod schema:

```bash
  const parsed = searchSchema.safeParse(formData);
```

If the formData is parsed and can't be validated, the server action will return the errors and fields objects. The errors are displayed and the form fields are re-populated with the data that was submitted.

```bash
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, fields: parsed.data };
  }
```

If the formData can be validated, I use the URLSearchParams class to format the News API URL.

```bash
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
```

After the sending the api request, the response object and the number of total pages are returned. (totalPages is based on 10 articles per page)

```bash
  const results = await fetch(searchUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const response: NewsApiResponse = await results.json();
  const totalResults = response.totalResults || 0;
  const totalPages = Math.ceil(totalResults / 10);

  return { response, totalPages };
```
