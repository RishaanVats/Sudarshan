import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tables-component',
  imports: [],
  templateUrl: './tables-component.html',
  styleUrl: './tables-component.css',
})
export class TablesComponent {
  tableData: any[][] = [];

  @Input() title: string = 'Table Title';
  @Input() set dataForTable(value: any[]) {
    this.tableData = this.transformToTableRobust(value);
    console.log('Transformed Table Data: ', this.tableData);
  }
  @Input() excludedKeys: string[] = []; // Keys to exclude from the table

  private transformToTableRobust<T extends object>(data: T[]): any[][] {
    if (data.length === 0) return [];

    // 1. Get all unique keys from all objects (in case some are missing in the first one)
    const allKeys = Array.from(new Set(data.flatMap((obj) => Object.keys(obj)))).filter(
      (key) => !this.excludedKeys.includes(key),
    );

    // 2. Create the Display Headers (e.g., 'Booth Name')
    const displayHeaders = allKeys.map((key) =>
      key
        // Insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // Uppercase the first character
        .replace(/^./, (str) => str.toUpperCase())
        // Trim any accidental leading space
        .trim(),
    );

    // 3. Map each object, filling in undefined/null for missing keys
    const rows = data.map((obj) =>
      allKeys.map((key) => (key in obj ? (obj as Record<string, any>)[key] : null)),
    );

    // 4. Return the clean headers + data rows
    return [displayHeaders, ...rows];
  }
}
