import { Component, Input, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';

import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

interface chartsVerify {
  title: string;
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  legendNeeded: boolean;
  data: number[] | string[];

  labels: string[];
}

@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.css',
})
export class Charts implements OnInit, AfterViewInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  @Input() chart = {} as chartsVerify;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.initCharts();
    this.cdr.detectChanges();
  }

  private initCharts() {
    // Moved chart creation logic here so it only runs once data is ready
    setTimeout(() => {
      const typeOverrides: any = {
        line: {
          fill: false,
          tension: 0.5,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true,
          backgroundColor: ['#3B82F6'],
          borderColor: ['#3B82F6'],
        },
        bar: {
          borderWidth: 0,
          borderRadius: 4,
          layout: {
            padding: {
              bottom: 0, // Add specific extra space at the bottom for bars
            },
          },
          backgroundColor: ['#3B82F6'],
          borderColor: ['#3B82F6'],
        },
        doughnut: {
          borderWidth: 2,
          hoverOffset: 10,
          cutout: '50%',
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E'],
          borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E'],
        },
      };

      const ctx = document.getElementById(this.chart.id) as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: this.chart.type,
          plugins: [chartDataLabels],
          data: {
            labels: this.chart.labels,
            datasets: [
              {
                label: this.chart.title,
                data: this.chart.data,
                pointStyle: 'circle',
                ...typeOverrides[this.chart.type], // Spreads the specific styles here
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            ...(typeOverrides[this.chart.type]?.layout
              ? { layout: typeOverrides[this.chart.type].layout }
              : {}),
            // Crucial: Only add scales if NOT a pie/doughnut chart
            scales: ['pie', 'doughnut'].includes(this.chart.type)
              ? {}
              : {
                  y: {
                    beginAtZero: true,
                    grace: '5%', // Adds a little breathing room at the top of the bars
                    grid: {
                      color: '#243344', // light grey for horizontal lines
                    },
                    border: {
                      display: true,
                      color: '#243344', // Color of the y-axis line
                    },
                  },
                  x: {
                    grid: {
                      display: this.chart.type === 'line', // Show vertical grid lines only for line chart
                      color: '#243344', // Light grey vertical lines
                      drawOnChartArea: true, // Ensure they span the entire chart area
                      drawTicks: false, // Optional: hides the tiny nub lines outside the chart
                    },
                    border: {
                      display: true,
                      color: '#243344', // Color of the x-axis line
                    },
                  },
                },
            plugins: {
              legend: {
                display: this.chart.legendNeeded,
                position: 'right', // Legend position at the top
              },
              datalabels: {
                color: '#fff',
                formatter: (value: number, ctx: any) => {
                  // This shows the label name + the value
                  // const label = ctx.chart.data.labels?.[ctx.dataIndex] || '';
                  return '\n' + value + '%';
                },
                font: { weight: 'bold', size: 12 },
                display: this.chart.type === 'doughnut', // Only show for doughnut
              },
            },
          },
        });
      }
    }, 0);
  }
}
