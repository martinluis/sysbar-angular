import {signal} from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export function createTableSorter<T extends Record<string, any>>() {

  const column = signal<string>('');
  const direction = signal<SortDirection>('asc');

  /**
   *
   * @param a
   * @param b
   * @param column
   * @param direction
   */
  function compare(a: T, b: T, column: keyof T, direction: SortDirection): number {
    const valueA = a[column];
    const valueB = b[column];

    let result = 0;

    if (valueA < valueB) result = -1;
    else if (valueA > valueB) result = 1;

    return direction === 'asc' ? result : -result;
  }

  /**
   *
   * @param data
   */
  function sortArray(data: T[]): T[] {
    return [...data].sort((a, b) =>
      compare(a, b, column(), direction())
    );
  }

  /**
   *
   * @param col
   */
  function sort(col: string) {
    if (column() === col) {
      direction.update(dir =>
        dir === 'asc' ? 'desc' : 'asc'
      );
    } else {
      column.set(col);
      direction.set('asc');
    }
  }

  return {
    column,
    direction,
    sort,
    sortArray
  };
}
