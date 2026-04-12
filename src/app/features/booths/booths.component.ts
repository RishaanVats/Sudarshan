import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { TablesComponent } from "../../shared/components/tables-component/tables-component";

import { SudarshanService } from '../../core/services/sudarshan.service';
import { kpiCards, boothProgress, chartsVerify } from '../../core/types';

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
  constructor(private sudarshanService: SudarshanService) {}

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
    const labelsArray = [];
    for(let i = 1; i <= 10; i++){
      labelsArray.push(i);
    }
    return [
      {
        title: 'Booth Outreach Trend - Voters Contacted',
        id: 'volunteerActivityChart',
        type: 'line',
        legendNeeded: true,
        datasets: [
          {
            label: 'Zone 1',
            data: [...(this.contactedVotersByZones()['zone 1'] ?? [])],
            borderColor: '#007bff',
            backgroundColor: '#007bff',
          },
          {
            label: 'Zone 2',
            data: [...(this.contactedVotersByZones()['zone 2'] ?? [])],
            borderColor: '#28a745',
            backgroundColor: '#28a745',
          },
          {
            label: 'Zone 3',
            data: [...(this.contactedVotersByZones()['zone 3'] ?? [])],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545',
          },
          {
            label: 'Zone 4',
            data: [...(this.contactedVotersByZones()['zone 4'] ?? [])],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545',
          },
          {
            label: 'Zone 5',
            data: [...(this.contactedVotersByZones()['zone 5'] ?? [])],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545',
          },
        ],
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
        console.log(this.contactedVotersByZones());
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
