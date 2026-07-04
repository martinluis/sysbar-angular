import { computed, signal } from '@angular/core';

export function createPagination<T>(source: () => T[]) {
  const page = signal(1);
  const pageSize = signal(10);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(source().length / pageSize()))
  );

  const pagedData = computed(() => {
    const start = (page() - 1) * pageSize();
    return source().slice(start, start + pageSize());
  });

  /**
   *
   * @param value
   */
  function setPageSize(value: number){
    pageSize.set(value);
  }

  return {
    page,
    pageSize,
    totalPages,
    pagedData,
    setPageSize
  };
}
