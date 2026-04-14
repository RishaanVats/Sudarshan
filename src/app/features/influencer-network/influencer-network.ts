import { Component, computed, signal } from '@angular/core';

import { SudarshanService } from '../../core/services/sudarshan.service';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { chartsVerify, Influencer, kpiCards } from '../../core/types';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';
import { Charts } from '../../shared/components/charts/charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-influencer-network',
  imports: [CommonModule, KpiCards, TablesComponent, Charts],
  templateUrl: './influencer-network.html',
  styleUrl: './influencer-network.css',
})
export class InfluencerNetwork {
  constructor(private sudarshanService: SudarshanService) {}

  influencerData = signal<Influencer[]>([]);
  influenceLevel = signal({
    High: 0,
    Medium: 0,
    Low: 0,
  });
  influenceStatus = signal({
          "Confirmed": 0,
      "Pending": 0,
      "Contacted": 0,
      "New Lead": 0,
      "VIP": 0
  });

  ngOnInit() {
    this.fetchData();
  }

  kpiCards = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Total Influencers',
        count: this.influencerData().length,
        trendText: '+18 this week',
        isPositive: true,
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Confirmed',
        count: this.influencerData().filter((item) => item.status.toLowerCase() === 'confirmed')
          .length,
        trendText: '+13.45% conversion',
        isPositive: true,
        themeVar: 'var(--ac-emerald)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Voters Reach',
        count: this.influencerData().reduce((acc: number, item: Influencer) => {
          acc += item['estimatedInfluence'];
          return acc;
        }, 0),
        trendText: 'Est. direct reach',
        isPositive: true,
        themeVar: 'var(--ac-cyan)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'High - Influencers',
        count: this.influencerData().filter(
          (item) => item['influenceLevel'].toLowerCase() === 'high',
        ).length,
        trendText: 'High Influence Level',
        isPositive: true,
        themeVar: 'var(--ac-amber)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Pending Reviews',
        count: this.influencerData().filter((item) => item.status.toLowerCase() === 'new lead')
          .length,
        trendText: 'Action Required',
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
    ];
  });

  kpiCharts = computed<chartsVerify[]>(() => {
    return [
      {
        title: 'Influence Tier Distribution',
        id: 'influenceDistribution',
        type: 'bar',
        legendNeeded: false,
        data: Object.values(this.influenceLevel()),
        labels: Object.keys(this.influenceLevel()),
        width: '64%', // Optional: specify width for better layout control,
        indexAxis: 'y',
      },
      {
        title: 'Outreach Pipeline Status (%)',
        id: 'outreachStatus',
        type: 'doughnut',
        legendNeeded: true,
        data: Object.values(this.influenceStatus()),
        labels: Object.keys(this.influenceStatus()),
        width: '25%', // Optional
      },
    ];
  });

  fetchData() {
    this.sudarshanService.getInfluencerRecommendations().subscribe({
      next: (data: Influencer[]) => {
        data.sort(
          (a: Influencer, b: Influencer) => b['estimatedInfluence'] - a['estimatedInfluence'],
        );
        this.influencerData.set(data);

        const influenceLevel = this.influencerData().reduce(
          (acc: any, record: Influencer) => {
            const c = record['influenceLevel'].toLowerCase();
            if (c === 'high') acc['High']++;
            else if (c === 'medium') acc['Medium']++;
            else if (c === 'low') acc['Low']++;
            return acc;
          },
          { High: 0, Medium: 0, Low: 0 },
        );
        this.influenceLevel.set(influenceLevel);

        const outreachStatus = this.influencerData().reduce(
          (acc: any, record: Influencer) => {
            const status = record.status.toLowerCase();
            if(status === "confirmed"){acc["Confirmed"]++}
            else if (status === "pending"){acc["Pending"]++}
            else if (status === "contacted"){acc["Contacted"]++}
            else if (status === "new lead"){acc["New Lead"]++}
            else if (status === "vip"){acc["VIP"]++}
            return acc;
          },
          { 'Confirmed': 0, 'Pending': 0, 'Contacted': 0, 'New Lead': 0, 'VIP': 0 },
        );

        this.influenceStatus.set(outreachStatus);
      },
      error: (err) => {
        console.error('Failed to fetch Influencer data', err);
      },
    });
  }
}
