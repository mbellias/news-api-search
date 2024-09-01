'use client';

import { useContext } from 'react';
import { SearchFormContext } from '../context/SearchFormContext';

function useArticle() {
  const context = useContext(SearchFormContext);

  if (!context)
    throw new Error('useArticle must be used with SearchFormContext');

  return context;
}

export default useArticle;
