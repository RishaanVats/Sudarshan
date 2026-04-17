import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { kpiCards, boothProgress, chartsVerify } from '../../core/types';
import { interval } from 'rxjs/internal/observable/interval';

interface RangeCounts {
  '0': number; // Inactive
  '1-60': number; // Low
  '61-80': number; // Mid
  '81-100': number; // High
}

interface VoterData {
  zone: string;
  votersContacted: number;
}

@Component({
  selector: 'app-booths',
  standalone: true,
  imports: [CommonModule, KpiCards, Charts],
  templateUrl: './booths.component.html',
  styleUrls: ['./booths.component.css'],
})
export class BoothsComponent {
  constructor(private sudarshanService: SudarshanService) {
    interval(10000).subscribe(() => this.fetchData());
    // Repeat call every ten seconds to keep the data fresh
  }

  boothProgress = signal<boothProgress[]>([]);
  votersReached = signal(0);
  avgCoverage = signal(0);
  topTenBooths = signal<boothProgress[]>([]);
  contactedVotersByZones = signal<Record<string, number[]>>({});
  topBooth = signal<boothProgress>({
    id: 0,
    booth: 0,
    boothName: '',
    targetVoters: 0,
    votersReached: 0,
    supportersIdentified: 0,
    undecided: 0,
    coverage: 0,
  });
  lowestCoverage = signal<boothProgress>({
    id: 0,
    booth: 0,
    boothName: '',
    targetVoters: 0,
    votersReached: 0,
    supportersIdentified: 0,
    undecided: 0,
    coverage: 0,
  });
  segregatedCoverage = signal<RangeCounts>({
    '0': 0,
    '1-60': 0,
    '61-80': 0,
    '81-100': 0,
  });

  // Data for KPI Cards
  kpiCards = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Booths Active',
        count: this.boothProgress().length,
        trendText: '96.1% of total',
        isPositive: true,
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Voters Reached',
        count: this.votersReached(),
        trendText: '+3,340 this week',
        isPositive: true,
        themeVar: 'var(--ac-cyan)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Avg% Coverage',
        count: this.avgCoverage(),
        trendText: '3.2pp vs last wk',
        isPositive: true,
        themeVar: 'var(--ac-emerald)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Top Booth',
        count: `Booth ${this.topBooth().booth}`,
        trendText: `coverage: ${this.topBooth().coverage}%`,
        isPositive: true,
        themeVar: 'var(--ac-violet)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Lowest Coverage-%',
        count: this.lowestCoverage().coverage,
        trendText: `Booth ${this.lowestCoverage().booth}`,
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
    ];
  });

  // Data for KPI Charts
  kpiCharts = computed<chartsVerify[]>(() => {
    return [
      {
        title: 'Coverage Leaderboard - Top 10 Booths',
        id: 'coverageLeaderboard',
        type: 'bar',
        legendNeeded: false,
        data: this.topTenBooths().map((record) => record.coverage),
        labels: this.topTenBooths().map((record) => record.booth),
        width: '64%', // Optional: specify width for better layout control,
        indexAxis: 'y',
      },
      {
        title: 'Coverage Status Breakdown',
        id: 'coverageStatus',
        type: 'doughnut',
        legendNeeded: true,
        data: [...Object.values(this.segregatedCoverage())],
        labels: ['Inactive', 'Low (<60%)', 'Mid (60-80%)', 'High (81-100%)'],
        width: '25%', // Optional
      },
    ];
  });

  kpiCharts2 = computed<chartsVerify[]>(() => {
    // Quick optimization for labels array
    const labelsArray = Array.from({ length: 10 }, (_, i) => i + 1);

    // Define zone configurations
    const zoneConfigs = [
      { key: 'zone 1', label: 'Zone 1', color: '#007bff' },
      { key: 'zone 2', label: 'Zone 2', color: '#28a745' },
      { key: 'zone 3', label: 'Zone 3', color: '#dc3545' },
      { key: 'zone 4', label: 'Zone 4', color: '#ffc107' },
      { key: 'zone 5', label: 'Zone 5', color: '#6c757d' },
    ];

    const sourceData = this.contactedVotersByZones();

    return [
      {
        title: 'Booth Outreach Trend - Voters Contacted',
        id: 'volunteerActivityChart',
        type: 'line',
        legendNeeded: true,
        datasets: zoneConfigs.map((config) => ({
          label: config.label,
          data: [...(sourceData[config.key] ?? [])],
          borderColor: config.color,
          backgroundColor: config.color,
        })),
        labels: labelsArray,
        width: '95%',
      },
    ];
  });

  fetchData() {
    this.sudarshanService.getBoothProgress().subscribe({
      next: (data) => {
        this.boothProgress.set(data);

        const totalVoters = data.reduce(
          (sum: number, entry: boothProgress) => sum + entry.votersReached,
          0,
        );
        this.votersReached.set(totalVoters);

        let totalCoverage = data.reduce(
          (sum: number, entry: boothProgress) => (sum = sum + entry.coverage),
          0,
        );
        this.avgCoverage.set(totalCoverage / data.length);

        data.sort((a: boothProgress, b: boothProgress) => b.coverage - a.coverage);
        this.topBooth.set(data[0]);
        this.lowestCoverage.set(data[data.length - 1]);
        this.topTenBooths.set(data.splice(0, 10));
        const result = data.reduce(
          (acc: any, item: boothProgress) => {
            const c = item.coverage;
            if (c === 0) acc['0']++;
            else if (c <= 60) acc['1-60']++;
            else if (c <= 80) acc['60-80']++;
            else if (c <= 100) acc['81-100']++;
            return acc;
          },
          { '0': 0, '1-60': 0, '60-80': 0, '81-100': 0 },
        );

        this.segregatedCoverage.set(result);
        // console.log(this.segregatedCoverage());
      },
      error: (err) => {
        console.error('Error fetching Booth Progress:', err);
      },
    });

    this.sudarshanService.getBooths().subscribe({
      next: (data) => {
        //  Groups voter contact numbers by their respective zones.
        //  This function is O(n) and scales automatically as new zones are added to the data.

        const groupVotersByZone = (data: VoterData[]): Record<string, number[]> => {
          return data.reduce(
            (acc, { zone, votersContacted }) => {
              // Initialize the array for a new zone if it doesn't exist yet
              if (!acc[zone]) {
                acc[zone] = [];
              }

              acc[zone].push(votersContacted);
              return acc;
            },
            {} as Record<string, number[]>,
          );
        };

        // Usage:
        const contactedZones = groupVotersByZone(data);
        this.contactedVotersByZones.set(contactedZones);
        // console.log(this.contactedVotersByZones());
      },
      error: (err) => {
        console.error('Failed to fetch Booths data', err);
      },
    });
  }

  ngOnInit() {
    this.fetchData(); // fetch Data from APIs
  }
}
