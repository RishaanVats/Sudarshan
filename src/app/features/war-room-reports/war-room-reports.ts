import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { SudarshanService } from '../../core/services/sudarshan.service';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';
import { Charts } from '../../shared/components/charts/charts';
import { StrategicAlerts } from '../../shared/components/strategic-alerts/strategic-alerts';

import { chartsVerify, kpiCards, WarRoomReport, RadarMetric, Alert } from '../../core/types';

@Component({
  selector: 'app-war-room-reports',
  imports: [CommonModule, KpiCards, Charts, TablesComponent, StrategicAlerts],
  templateUrl: './war-room-reports.html',
  styleUrl: './war-room-reports.css',
})
export class WarRoomReports {
  constructor(private sudarshanService: SudarshanService) {}

  reportsData = signal<WarRoomReport | null>(null);
  radarMetrics = signal<RadarMetric[]>([]);
  tableData = signal([]);

  actionItems = signal<Alert[]>([]);

  kpiCards = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Campaign Health',
        count: Number(this.reportsData()?.campaignHealth.score),
        trendText: String(this.reportsData()?.campaignHealth.status),
        isPositive: true,
        themeVar: 'var(--ac-cyan)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Field Momentum',
        count: String(this.reportsData()?.fieldMomentum),
        trendText: 'All Zones',
        isPositive: true,
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Critical Alerts',
        count: Number(this.reportsData()?.criticalAlerts),
        trendText: 'Require Action today',
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
      {
        title: 'Days to Election',
        count: Number(this.reportsData()?.daysToElection),
        trendText: 'Final Sprint Phase',
        isPositive: true,
        themeVar: 'var(--ac-amber)',
        trendVar: 'var(--ac-emerald)',
      },
    ];
  });

  kpiCharts = computed<chartsVerify[]>(() => {
    const reportArr = this.radarMetrics();
    if (!reportArr.length) return [];

    const metrics = reportArr;
    console.log('Metrics:', metrics);

    // ---------- NORMALIZATION HELPER ----------
    const normalize = (value: number, max: number) => {
      if (!max) return 0;
      return Math.round((value / max) * 100);
    };

    // Fixed scale per metric (important for meaningful comparison)
    const maxMap: Record<string, number> = {
      Volunteers: 100,
      'Doors Knocked': 2000,
      Sentiment: 100,
      'Booth Coverage': 100,
      Influencers: 100,
      Pledges: 10000,
    };

    // ---------- TRANSFORM ----------
    const labels = metrics.map((m) => m.metric);

    const thisWeekRaw = metrics.map((m) => m.thisWeek);
    const lastWeekRaw = metrics.map((m) => m.lastWeek);

    const thisWeekData = metrics.map((m) => normalize(m.thisWeek, maxMap[m.metric]));
    const lastWeekData = metrics.map((m) => normalize(m.lastWeek, maxMap[m.metric]));

    return [
      {
        title: 'Weekly Momentum Radar - Normalized',
        id: 'weeklyRadarChart',
        type: 'radar',
        legendNeeded: true,

        labels: labels,

        datasets: [
          {
            label: 'This Week',
            data: thisWeekData,
            rawData: thisWeekRaw,
            borderColor: '#06B6D4',
            backgroundColor: '#06B6D4',
          },
          {
            label: 'Last Week',
            data: lastWeekData,
            rawData: lastWeekRaw,
            borderColor: '#FBBF24',
            backgroundColor: '#FBBF24',
          },
        ],

        width: '65%',
      },
    ];
  });

  fetchData() {
    this.sudarshanService.getWarRoomReports().subscribe({
      next: (data) => {
        console.log(data);
        this.reportsData.set(data[0]);
        this.radarMetrics.set(data[0].radarMetrics);

        data[0].actionItems.forEach((alert: any) => {
          alert.severity = alert.severity.toLowerCase(); // Ensure severity is lowercase for consistent CSS class mapping
          alert.reportedAt = new Date(alert.reportedAt).toLocaleString(); // Format the date for display
        });
        this.actionItems.set(data[0].actionItems);

        this.tableData.set(data[0].tableSummary);
      },
      error: (err) => {
        console.error('Faile to fetch war room reports data', err);
      },
    });
  }

  ngOnInit() {
    this.fetchData();
  }
}
