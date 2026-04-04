import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDate',
  standalone: true
})
export class SortByDatePipe implements PipeTransform {

  transform(value: any[], dateField: string = 'date', reverse: boolean = true): any[] {
    if (!Array.isArray(value)) {
      return value;
    }

    const sorted = [...value].sort((a, b) => {
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }

}
