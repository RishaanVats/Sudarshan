import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SudarshanService } from '../../core/services/sudarshan.service';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';

import {
  kpiCards,
  chartsVerify,
  voterFeedback,
  doorToDoorOutreach,
} from '../../core/types';
import { map } from 'rxjs';

interface sentimentTrend {
  supporters: 0;
  opposition: 0;
  neutral: 0;
  undecided: 0;
}

@Component({
  selector: 'app-door-outreach',
  imports: [CommonModule, KpiCards, Charts, TablesComponent],
  templateUrl: './door-outreach.html',
  styleUrl: './door-outreach.css',
})
export class DoorOutreach {
  constructor(private sudarshanService: SudarshanService) {
    // This effect runs every time any signal changes
    effect(() => {
      console.log('Signal value updated:', this.kpiCharts());
    });
  }

  doorToDoorData = signal([]);
  kpiCardData = signal({
    doorsKnocked: 0,
    contactRate: 0,
    pledgesSecured: 0,
    teamsDeployed: 0,
    noContactDoors: 0,
  });

  pledgeSecured = signal(0);
  pledgeRefused = signal(0);
  willConsider = signal(0);
  noAnswer = signal(0);
  sentimentDistribution = signal({
    supporters: 0,
    opposition: 0,
    neutral: 0,
    undecided: 0,
  });
  sentimentTrend = signal<sentimentTrend[]>([]);
  dailyVolunteerChecks = signal<{}>([]);
  zonePerformance = signal<[]>([]);

  ngOnInit() {
    this.fetchData();
  }

  kpiCards = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Doors Knocked',
        count: this.kpiCardData().doorsKnocked,
        trendText: '+2,354',
        isPositive: true,
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Contact Rate (%)',
        count: this.kpiCardData().contactRate,
        trendText: '+2.1pp vs yesterday',
        isPositive: true,
        themeVar: 'var(--ac-emerald)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Pledges Secured',
        count: this.kpiCardData().pledgesSecured,
        trendText: '24.5% of contacted',
        isPositive: true,
        themeVar: 'var(--ac-cyan)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Teams Deployed',
        count: this.kpiCardData().teamsDeployed,
        trendText: '+2 vs last week',
        isPositive: true,
        themeVar: 'var(--ac-amber)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'No Contact Doors',
        count: this.kpiCardData().noContactDoors,
        trendText: 'Revisit scheduled',
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
    ];
  });

  kpiCharts = computed<chartsVerify[]>(() => {
    return [
      {
        title: 'Daily Doors Knocked - Last 15 Days',
        id: 'dailyDoorsKnocked',
        type: 'bar',
        legendNeeded: false,
        data: (Object.values(this.dailyVolunteerChecks())  as number[]).slice(0, 15),
        rawData: (Object.values(this.dailyVolunteerChecks())  as number[]).slice(0, 15),
        labels: Object.keys(this.dailyVolunteerChecks()).slice(0, 15),
        isPercentage: false,
        width: '100%', // Optional: specify width for better layout control
      },
      {
        title: 'Contact Outcomes (%age)',
        id: 'currentOutcomes',
        type: 'doughnut',
        legendNeeded: true,
        data: Object.values(this.sentimentDistribution()),
        labels: Object.keys(this.sentimentDistribution()),
        isPercentage: true,
        width: '100%',
      },
    ];
  });

  fetchData() {
    this.sudarshanService.getDoorToDoorVisits().subscribe({
      next: (data) => {
        this.doorToDoorData.set(data);
        // console.log(this.doorToDoorData());

        let doorsKnocked = 0;
        let pledgesSecured = 0;
        let teamsDeployed = new Set();
        let noContactDoors = 0;

        for (const item of data) {
          doorsKnocked += item.housesVisited;
          pledgesSecured += item.pledgesSecured;
          noContactDoors += item.noContactDoors;
          teamsDeployed.add(item.team);
        }

        let contactRate = (doorsKnocked / (doorsKnocked + noContactDoors)) * 100;

        // Using .set() with a NEW object literal to trigger the Signal
        this.kpiCardData.set({
          doorsKnocked,
          pledgesSecured,
          teamsDeployed: teamsDeployed.size,
          noContactDoors,
          contactRate: Number(contactRate.toFixed(2)),
        });

        // console.log(this.kpiCardData());

        data.map((entry: any) => {
          entry.date = new Date(entry.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC',
          }); // Format date for display
          return entry;
        });

        const housesVisitedByDate = this.aggregateHousesByDate(data);
        this.dailyVolunteerChecks.set(housesVisitedByDate);
        console.log(housesVisitedByDate);
      },
      error: (err) => {
        console.error('Failed to fetch door to door data', err);
      },
    });

    this.sudarshanService.getVoterFeedback().subscribe({
      next: (data) => {
        const voterFeedback: voterFeedback = data;

        const sentimentSegregated = data.reduce(
          (acc: any, item: voterFeedback) => {
            item.sentiment = item.sentiment.toLowerCase();
            if (item.sentiment === 'support') acc['pledgeSecured']++;
            else if (item.sentiment === 'opposition') acc['pledgeRefused']++;
            else if (item.sentiment === 'undecided') acc['willConsider']++;
            else if (item.sentiment === 'neutral') acc['noAnswer']++;

            return acc;
          },
          { pledgeSecured: 0, pledgeRefused: 0, willConsider: 0, noAnswer: 0 },
        );

        let totalSentiment = Object.values(sentimentSegregated).reduce((acc: number, item: any) => {
          acc += item;
          return acc;
        }, 0);

        this.pledgeSecured.set(sentimentSegregated['pledgeSecured']);
        this.pledgeRefused.set(sentimentSegregated['pledgeRefused']);
        this.willConsider.set(sentimentSegregated['willConsider']);
        this.noAnswer.set(sentimentSegregated['noAnswer']);

        const sentimentDist = {
          supporters: this.percentageCalc(this.pledgeSecured(), totalSentiment),
          opposition: this.percentageCalc(this.pledgeRefused(), totalSentiment),
          undecided: this.percentageCalc(this.willConsider(), totalSentiment),
          neutral: this.percentageCalc(this.noAnswer(), totalSentiment),
        };

        this.sentimentDistribution.set(sentimentDist);

        // console.log(sentimentDist);
        // console.log([...this.sentimentTrend().map((item) => item.supporters)]);
      },
      error: (err) => {
        console.error('Error fetching Booth Progress:', err);
      },
    });

    this.sudarshanService.getZoneOutreachPerformance().subscribe({
      next: (data) => {
        data.map((entry: any) => {
          entry.coverage = entry.coverage.percent + '%';
        });
        this.zonePerformance.set(data);
        console.log('Zone Outreach Performance:', data);
      },
      error: (err) => {
        console.error('Error fetching Zone Outreach Performance:', err);
      },
    });
  }

  percentageCalc(data: number, total: number) {
    return Number(((data / total) * 100).toFixed(2));
  }

  aggregateHousesByDate = (data: doorToDoorOutreach[]): Record<string, number> => {
    // 1. Sort the array first to ensure the object keys are inserted in order
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // 2. Reduce and sum values for duplicate dates
    return sortedData.reduce(
      (acc, current) => {
        const dateKey = current.date;

        if (acc[dateKey]) {
          // If the date exists, add to the total
          acc[dateKey] += current.housesVisited;
        } else {
          // Otherwise, initialize the key
          acc[dateKey] = current.housesVisited;
        }

        return acc;
      },
      {} as Record<string, number>,
    );
  };
}
