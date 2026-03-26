import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(chartDataLabels);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  kpiCards = [
    {
      title: 'Total Volunteers',
      count: '4,812',
      trendText: '+148 this week',
      isPositive: true,
      // Provide the string name of your global variable
      themeVar: 'var(--ac-blue)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'Active Today',
      count: '1,247',
      trendText: '+92% vs daily avg',
      isPositive: true,
      themeVar: 'var(--ac-cyan)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'Booths Covered',
      count: '318/402',
      trendText: '79% Coverage',
      isPositive: true,
      themeVar: 'var(--ac-emerald)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'Voters Reached',
      count: '62,491',
      trendText: '+3,120 new today',
      isPositive: true,
      themeVar: 'var(--ac-amber)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: "Influencers ID'D",
      count: '284',
      trendText: '6 pending review',
      isPositive: false,
      themeVar: 'var(--ac-violet)',
      trendVar: 'var(--ac-rose)',
    },
    {
      title: 'Opp. Events',
      count: '17',
      trendText: '3 new alerts today',
      isPositive: false,
      themeVar: 'var(--ac-rose)',
      trendVar: 'var(--ac-rose)',
    },
  ];

  kpiCharts: Array<{
    title: string;
    id: string;
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    legendNeeded: boolean;
    data: number[] | string[];
    labels: string[];
  }> = [
    {
      title: 'Volunteer Activity - 30 days',
      id: 'volunteerActivityChart',
      type: 'line',
      legendNeeded: false,
      data: [120, 150, 180, 220, 300, 450, 600],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    },
    {
      title: 'Door-to-Door Outreach - This Week',
      id: 'doorOutreachChart',
      type: 'bar',
      legendNeeded: false,
      data: [50, 75, 100, 150, 200, 250, 318],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    {
      title: 'Voter Sentiment Distribution',
      id: 'voterSentimentChart',
      type: 'doughnut',
      legendNeeded: true,
      data: [38, 29, 18, 15],
      labels: ['Positive', 'Neutral', 'Negative', 'Unknown'],
    },
  ];

  ngAfterViewInit() {
    this.kpiCharts.forEach((chart) => {
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
                bottom: 20, // Add specific extra space at the bottom for bars
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
        const ctx = document.getElementById(chart.id) as HTMLCanvasElement;
        if (ctx) {
          new Chart(ctx, {
            type: chart.type,
            plugins: [chartDataLabels],
            data: {
              labels: chart.labels,
              datasets: [
                {
                  label: chart.title,
                  data: chart.data,
                  pointStyle: 'circle',
                  ...typeOverrides[chart.type], // Spreads the specific styles here
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              ...(typeOverrides[chart.type]?.layout
                ? { layout: typeOverrides[chart.type].layout }
                : {}),
              // Crucial: Only add scales if NOT a pie/doughnut chart
              scales: ['pie', 'doughnut'].includes(chart.type)
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
                        display: chart.type === 'line', // Show vertical grid lines only for line chart
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
                  display: chart.legendNeeded,
                  position: 'right', // Legend position at the top
                },
                datalabels: {
                  color: '#fff',
                  formatter: (value, ctx) => {
                    // This shows the label name + the value
                    // const label = ctx.chart.data.labels?.[ctx.dataIndex] || '';
                    return '\n' + value + '%';
                  },
                  font: { weight: 'bold', size: 12 },
                  display: chart.type === 'doughnut', // Only show for doughnut
                },
              },
            },
          });
        }
      }, 0);
    });
  }
}
