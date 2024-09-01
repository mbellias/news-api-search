'use client';

import { Articles } from '@/lib/types';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

type SearchFormContextType = {
  articles: Articles[];
  setArticles: Dispatch<SetStateAction<Articles[]>>;
  isMounted: boolean;
  setIsMounted: Dispatch<SetStateAction<boolean>>;
};

export const SearchFormContext = createContext<SearchFormContextType | null>(
  null
);

export default function SearchFormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  return (
    <SearchFormContext.Provider
      value={{ articles, setArticles, isMounted, setIsMounted }}
    >
      {children}
    </SearchFormContext.Provider>
  );
}
