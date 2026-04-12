import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';

import { chartsVerify, kpiCards, voterFeedback, voterFeedbackByZone } from '../../core/types';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';

interface sentimentTrend {
  supporters: 0;
  opposition: 0;
  neutral: 0;
  undecided: 0;
}

@Component({
  selector: 'app-voter-analysis',
  imports: [CommonModule, KpiCards, Charts, TablesComponent],
  templateUrl: './voter-analysis.html',
  styleUrl: './voter-analysis.css',
})
export class VoterAnalysis {
  constructor(private sudarshanService: SudarshanService) {}
  supporters = signal(0);
  opposition = signal(0);
  undecided = signal(0);
  neutral = signal(0);
  sentimentDistribution = signal({
    supporters: 0,
    opposition: 0,
    neutral: 0,
    undecided: 0,
  });
  sentimentTrend = signal<sentimentTrend[]>([]);
  voterFeedbackByZones = signal<voterFeedbackByZone[]>([]);

  testingData = signal({});
  // Data for KPI Cards
  kpiCards = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Supporters',
        count: this.supporters(),
        trendText: '16.1% of total',
        isPositive: true,
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Opposition',
        count: this.opposition(),
        trendText: '-3,340 this month',
        isPositive: true,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Undecided',
        count: this.undecided(),
        trendText: '3.2pp vs last wk',
        isPositive: true,
        themeVar: 'var(--ac-emerald)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Neutral',
        count: this.neutral(),
        trendText: `Neutral`,
        isPositive: false,
        themeVar: 'var(--ac-violet)',
        trendVar: 'var(--ac-rose)',
      },
      {
        title: 'Swing Potential',
        count: 232,
        trendText: `Persuadable`,
        isPositive: true,
        themeVar: 'var(--ac-amber)',
        trendVar: 'var(--ac-emerald)',
      },
    ];
  });

  kpiCharts = computed<chartsVerify[]>(() => {
    return [
      {
        title: 'Volunteer Activity - 30 days',
        id: 'volunteerActivityChart',
        type: 'line',
        legendNeeded: true,
        datasets: [
          {
            label: 'Supporters',
            data: [...this.sentimentTrend().map((item) => item.supporters)],
            borderColor: '#007bff',
            backgroundColor: '#007bff',
          },
          {
            label: 'Opposition',
            data: [...this.sentimentTrend().map((item) => item.opposition)],
            borderColor: '#28a745',
            backgroundColor: '#28a745',
          },
          {
            label: 'Undecided',
            data: [...this.sentimentTrend().map((item) => item.undecided)],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545',
          },
          {
            label: 'Neutral',
            data: [...this.sentimentTrend().map((item) => item.neutral)],
            borderColor: '#dc3545',
            backgroundColor: '#dc3545',
          },
        ],
        labels: Object.keys(this.sentimentTrend()),
        width: '65%',
      },
      {
        title: 'Current Distribution (%age)',
        id: 'currrentDistribution',
        type: 'doughnut',
        legendNeeded: true,
        data: Object.values(this.sentimentDistribution()),
        labels: Object.keys(this.sentimentDistribution()),
        width: '32%',
      },
    ];
  });

  tableData = computed(() => {
    return this.voterFeedbackByZones().map((entry, index) => ({
      id: index,
      zone: `Zone ${index + 1}`,
      reached: entry.total,
      supporters: entry.support,
      opposition: entry.opposition,
      undecided: entry.undecided,
      neutral: entry.neutral,
      'supp. rate (%)': entry.supportPercent,
    }));
  });

  fetchData() {
    this.sudarshanService.getVoterFeedback().subscribe({
      next: (data) => {
        const voterFeedback: voterFeedback = data;

        const sentimentSegregated = data.reduce(
          (acc: any, item: voterFeedback) => {
            item.sentiment = item.sentiment.toLowerCase();
            if (item.sentiment === 'support') acc['support']++;
            else if (item.sentiment === 'opposition') acc['opposition']++;
            else if (item.sentiment === 'undecided') acc['undecided']++;
            else if (item.sentiment === 'neutral') acc['neutral']++;

            return acc;
          },
          { support: 0, opposition: 0, undecided: 0, neutral: 0 },
        );

        let totalSentiment = Object.values(sentimentSegregated).reduce((acc: number, item: any) => {
          acc += item;
          return acc;
        }, 0);

        this.testingData.set(sentimentSegregated); // For rough testing
        this.supporters.set(sentimentSegregated['support']);
        this.opposition.set(sentimentSegregated['opposition']);
        this.undecided.set(sentimentSegregated['undecided']);
        this.neutral.set(sentimentSegregated['neutral']);

        const sentimentDist = {
          supporters: this.percentageCalc(this.supporters(), totalSentiment),
          opposition: this.percentageCalc(this.opposition(), totalSentiment),
          undecided: this.percentageCalc(this.undecided(), totalSentiment),
          neutral: this.percentageCalc(this.neutral(), totalSentiment),
        };

        this.sentimentDistribution.set(sentimentDist);

        // console.log(sentimentDist);
        // console.log([...this.sentimentTrend().map((item) => item.supporters)]);
      },
      error: (err) => {
        console.error('Error fetching Booth Progress:', err);
      },
    });

    this.sudarshanService.getSentimentTrend().subscribe({
      next: (data) => {
        this.sentimentTrend.set(data);
        // console.log(data);
      },
      error: (err) => {
        console.error('Error fetching Voter Sentiment:', err);
      },
    });

    this.sudarshanService.getVoterFeedbackByZone().subscribe({
      next: (data: Record<string, voterFeedbackByZone>) => {
        // console.log('testing API CALL at line 191: ', data);

        const arr = Object.values(data);
        // const arr: voterFeedbackByZone[] = Object.values(data);
        arr.forEach((elem) => {
          elem.total = elem.support + elem.neutral + elem.opposition + elem.undecided;
          elem.supportPercent = this.percentageCalc(elem.support, elem.total);
        });

        this.voterFeedbackByZones.set(arr);
        // console.log(this.voterFeedbackByZones());
      },
      error: (err) => {
        console.error('Error in fetching Voter Feedback by zone', err);
      },
    });
  }

  percentageCalc(data: number, total: number) {
    return Number(((data / total) * 100).toFixed(2));
  }

  ngOnInit() {
    this.fetchData();
  }
}
