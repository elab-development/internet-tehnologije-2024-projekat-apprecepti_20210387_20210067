import { useState } from 'react';

//custom hook za bilo koju komponentu koja treba da implementira paginaciju
//– omogućava lako upravljanje trenutnom i poslednjom stranicom uz osnovne kontrole za kretanje
const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(1);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, lastPage));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const reset = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    lastPage,
    setLastPage,
    nextPage,
    prevPage,
    reset
  };
};

export default usePagination;
