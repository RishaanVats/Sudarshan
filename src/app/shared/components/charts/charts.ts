import {
  Component,
  Input,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

import { chartsVerify } from '../../../core/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts',
  imports: [CommonModule],
  templateUrl: './charts.html',
  styleUrl: './charts.css',
})
export class Charts implements OnInit, AfterViewInit, OnChanges {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  @Input() chart = {} as chartsVerify;

  chartInstance!: Chart;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['chart'] && Array.isArray(this.chart?.data) && this.chart?.data?.length) {
    //   this.initCharts();
    // }

    if (
      changes['chart'] &&
      ((Array.isArray(this.chart?.data) && this.chart.data.length) ||
        (this.chart?.datasets && this.chart.datasets.length))
    ) {
      this.initCharts();
    }
  }

  ngAfterViewInit(): void {
    // this.initCharts();
    this.cdr.detectChanges();
  }

  private initCharts() {
    // Moved chart creation logic here so it only runs once data is ready
    setTimeout(() => {
      const typeOverrides: any = {
        line: {
          fill: false,
          tension: 0.4, // higher- curviewer, lesser - sharper
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true,
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'], // Extended palette for more segments
          borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'],
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
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'], // Extended palette for more segments
          borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'],
        },
        radar: {
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
        },
      };

      const ctx = document.getElementById(this.chart.id) as HTMLCanvasElement;
      if (!ctx) return;

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      if (ctx) {
      }

      this.chartInstance = new Chart(ctx, {
        type: this.chart.type,
        plugins: [chartDataLabels],
        data: {
          labels: this.chart.labels,
          datasets: this.chart.datasets?.length
            ? this.chart.datasets.map((ds) => ({
                ...ds,
                pointStyle: 'circle',
                ...typeOverrides[this.chart.type],
              }))
            : [
                {
                  label: this.chart.title,
                  data: this.chart.data,
                  pointStyle: 'circle',
                  ...typeOverrides[this.chart.type],
                },
              ],
        },
        options: {
          indexAxis: this.chart.indexAxis,
          responsive: true,
          maintainAspectRatio: false,
          ...(typeOverrides[this.chart.type]?.layout
            ? { layout: typeOverrides[this.chart.type].layout }
            : {}),
          // Crucial: Only add scales if NOT a pie/doughnut chart
          scales:
            this.chart.type === 'radar'
              ? {
                  r: {
                    grid: {
                      color: 'rgba(36, 51, 68, 0.6)',
                    },
                    angleLines: {
                      color: 'rgba(36, 51, 68, 0.6)',
                    },
                    pointLabels: {
                      color: '#94A3B8',
                      font: { size: 12 },
                    },
                    ticks: {
                      color: '#64748B',
                      backdropColor: 'transparent',
                      stepSize: 20,
                    },
                  },
                }
              : ['pie', 'doughnut'].includes(this.chart.type)
                ? {}
                : {
                    y: {
                      beginAtZero: true,
                      grace: '5%',
                      grid: { color: '#243344' },
                      border: { display: true, color: '#243344' },
                    },
                    x: {
                      grid: {
                        display: this.chart.type === 'line',
                        color: '#243344',
                        drawOnChartArea: true,
                        drawTicks: false,
                      },
                      border: { display: true, color: '#243344' },
                    },
                  },
          plugins: {
            legend: {
              display: this.chart.legendNeeded,
              position: 'right', // Legend position at the top
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const dataset = context.dataset;

                  // normalized value (0–100)
                  const normalized = context.raw;

                  // actual value
                  const actual = dataset.rawData?.[context.dataIndex];

                  return `${dataset.label}: ${actual} (${normalized}%)`;
                },
              },
            },
            datalabels: {
              color: '#fff',
              formatter: (value: number, ctx: any) => {
                // This shows the label name + the value
                // const label = ctx.chart.data.labels?.[ctx.dataIndex] || '';
                return '\n' + value;
              },
              font: { weight: 'bold', size: 12 },
              display: this.chart.type === 'doughnut', // Only show for doughnut
            },
          },
        },
      });
    }, 0);
  }
}
