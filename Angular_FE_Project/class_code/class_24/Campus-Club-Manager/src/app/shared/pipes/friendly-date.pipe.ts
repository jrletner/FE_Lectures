import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendlyDate',
  standalone: true,
})
export class FriendlyDatePipe implements PipeTransform {
  private fmt = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    // Normalize to midnight for day-diff calculations
    const startOf = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d0 = startOf(today).getTime();
    const d1 = startOf(date).getTime();
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((d1 - d0) / msPerDay);

    let rel = '';
    if (diffDays === 0) rel = 'today';
    else if (diffDays === 1) rel = 'tomorrow';
    else if (diffDays > 1) rel = `in ${diffDays} days`;
    else if (diffDays === -1) rel = 'yesterday';
    else rel = `${Math.abs(diffDays)} days ago`;

    return `${this.fmt.format(date)} (${rel})`;
  }
}
