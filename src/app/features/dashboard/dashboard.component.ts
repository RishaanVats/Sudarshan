import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  signal,
  computed,
  effect,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

import {
  Volunteer,
  boothProgress,
  chartsVerify,
  kpiCards,
  DailyActivity,
  doorToDoorData,
  Alert,
  VoterFeedbackItem,
  Influencer,
} from '../../core/types';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { InfluencersCard } from '../../shared/components/influencers-card/influencers-card';
import { StrategicAlerts } from '../../shared/components/strategic-alerts/strategic-alerts';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';

Chart.register(chartDataLabels);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCards, Charts, InfluencersCard, StrategicAlerts, TablesComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  volunteers: Volunteer[] = []; // Using the interface here
  boothProgress = signal<boothProgress[]>([]); // Using the interface here

  warRoomAlerts = signal<Alert[]>([]); // Define an interface if ever want a specific structure for alerts
  influencerRecommendations = signal<Influencer[]>([]); // Define an interface if you have a specific structure for influencers
  dailyActivity = signal<DailyActivity[]>([]);
  totalInfluencersRecommended: any;

  analytics: any = []; // Define an interface if you have a specific structure for analytics data
  doortoDoorData = signal<doorToDoorData[]>([]);
  voterFeedback: any[] = []; // Define an interface if you have a specific structure for voter feedback
  voterSentiment = signal<Record<string, number>>({});

  totalVolunteerCount = signal(0);
  activeVolunteerCount = signal(0);
  boothsCovered = signal(0);
  votersContacted = signal(0);
  houseVisits = signal(0);
  influencersIdentified = signal(0);
  oppositionEvents = signal(0);

  constructor(
    private sudarshanService: SudarshanService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      // console.log(`The current mapData is:`, this.mapData());
    });
  }

  ngOnInit() {
    this.loadData();
    // console.log(this.mapData());
  }

  mapData = computed<chartsVerify[]>(() => {
    const daily = this.dailyActivity() ?? [];
    const door = this.doortoDoorData() ?? [];
    const sentiment = this.voterSentiment() ?? {};
    // for (let [key, value] of Object.entries(sentiment)) {
    //   console.log(`${key}: ${value}`);
    // }

    return [
      {
        title: 'Volunteer Activity - 30 days',
        id: 'volunteerActivityChart',
        type: 'line',
        legendNeeded: false,
        data: daily.map((e) => e.votersReached),
        labels: daily.map((e) => e.date),
        width: '32%',
      },
      {
        title: 'Door-to-Door Outreach - This Week',
        id: 'doorOutreachChart',
        type: 'bar',
        legendNeeded: false,
        data: door.map((e) => e.housesVisited),
        labels: door.map((e) => e.date),
        width: '32%',
      },
      {
        title: 'Voter Sentiment Dispersal (%age)',
        id: 'voterSentimentChart',
        type: 'doughnut',
        legendNeeded: true,
        data: Object.values(sentiment),
        labels: Object.keys(sentiment),
        width: '30%',
      },
    ];
  });

  kpiCardsData = computed<kpiCards[]>(() => {
    return [
      {
        title: 'Total Volunteers',
        count: this.totalVolunteerCount(),
        trendText: '+148 this week', // This can be dynamic based on analytics data - will have to update the API to provide this info
        isPositive: true,
        // Provided the string name of global variable
        themeVar: 'var(--ac-blue)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Active Today',
        count: this.activeVolunteerCount(),
        trendText: '+22% vs daily avg',
        isPositive: true,
        themeVar: 'var(--ac-cyan)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Booths Covered',
        count: this.boothsCovered(),
        trendText: '79% Coverage',
        isPositive: true,
        themeVar: 'var(--ac-emerald)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'Voters Reached',
        count: this.votersContacted(),
        trendText: '+1,120 new today',
        isPositive: true,
        themeVar: 'var(--ac-amber)',
        trendVar: 'var(--ac-emerald)',
      },
      {
        title: 'House Visits',
        count: this.houseVisits(),
        trendText: '-576 this week',
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
      {
        title: "Influencers ID'D",
        count: this.influencersIdentified(),
        trendText: '6 pending review',
        isPositive: false,
        themeVar: 'var(--ac-violet)',
        trendVar: 'var(--ac-rose)',
      },
      {
        title: 'Opp. Events',
        count: this.oppositionEvents(),
        trendText: '3 new alerts today',
        isPositive: false,
        themeVar: 'var(--ac-rose)',
        trendVar: 'var(--ac-rose)',
      },
    ];
  }); // Create a computed signal for the KPI cards data

  loadData() {
    this.sudarshanService.getVolunteers().subscribe({
      next: (data: Volunteer[]) => {
        this.volunteers = data.map((val: Volunteer) => ({
          ...val,
          isCoordinator: val.role === 'Coordinator',
          isVolunteer: val.role === 'Volunteer',
        }));

        // this.totalVolunteerCount.set(this.volunteers.length);

        // console.log('getVolunteers called... ', this.volunteers);
      },
      error: (err) => {
        console.error('Error fetching volunteers', err);
      },
    });

    // Load Booth Progress from API
    this.sudarshanService.getBoothProgress().subscribe({
      next: (data: boothProgress[]) => {
        this.boothProgress.set(data);
        // Transform booth progress data for table display if needed
      },
      error: (err) => {
        console.error('Error fetching Booth Progress', err);
      },
    });

    // Load War Room Alerts from API
    this.sudarshanService.getWarRoomAlertsSorted().subscribe({
      next: (data: Alert[]) => {
        data.forEach((alert: any) => {
          alert.severity = alert.severity.toLowerCase(); // Ensure severity is lowercase for consistent CSS class mapping
          alert.reportedAt = new Date(alert.reportedAt).toLocaleString(); // Format the date for display
        });

        this.warRoomAlerts.set(data);
        // console.log('War Room Alerts: ', this.warRoomAlerts());
        // FORCE THE UI TO REFRESH
        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Booth Progress', err);
      },
    });

    this.sudarshanService.getTopInfluencerRecommendations().subscribe({
      next: (data: Influencer[]) => {
        // console.log('Influencer Recommendations: ', data);
        data.forEach((influencer: any) => {
          influencer.status = influencer.status.toLowerCase(); // Ensure status is lowercase for consistent CSS class mapping
          influencer.reach = influencer.estimatedInfluence.toLocaleString(); // Format reach with commas
        });

        this.influencerRecommendations.set(data);
        // FORCE THE UI TO REFRESH
        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Influencer Recommendations', err);
      },
    });

    this.sudarshanService.getInfluencerRecommendations().subscribe({
      next: (data) => {
        this.totalInfluencersRecommended = data;
        this.influencersIdentified.set(data.length);
      },
      error: (err) => {
        console.error('Error fetching InfluencerRecommendations data', err);
      },
    });

    this.sudarshanService.getDailyActive().subscribe({
      next: (data) => {
        data.map((entry: any) => {
          entry.date = new Date(entry.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC',
          }); // Format date for display
          return entry;
        });
        const totalVotersReached = data.reduce(
          (sum: number, entry: any) => sum + entry.votersReached,
          0,
        );
        this.dailyActivity.set(data);
        this.dailyActivity().sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ); // Sort by date ascending

        // this.mapDataReady(); // Prepare chart data after daily activity is loaded
      },
      error: (err) => {
        console.error('Error fetching dailyActivity data', err);
      },
    });

    this.sudarshanService.getDoorToDoorVisits().subscribe({
      next: (data) => {
        // Process door-to-door data if needed
        interface VolunteerData {
          date: string; // "2026-03-24T21:46:55.208Z"
          housesVisited: number;
          [key: string]: any;
        }

        const getRecentAccumulatedData = (data: VolunteerData[]) => {
          // 1. Accumulate housesVisited by the full YYYY-MM-DD string
          const grouped = data.reduce(
            (acc, curr) => {
              const isoDate = curr.date.split('T')[0]; // "2026-03-24"
              acc[isoDate] = (acc[isoDate] || 0) + curr.housesVisited;
              return acc;
            },
            {} as Record<string, number>,
          );

          // 2. Sort by date string (Descending) and take the top 7
          return (
            Object.entries(grouped)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 7)
              // 3. Final reduction to the "DD/MM" format for the UI
              .map(([fullDate, totalHouses]) => {
                const [year, month, day] = fullDate.split('-');
                return {
                  date: `${day}/${month}`,
                  housesVisited: totalHouses,
                };
              })
          );
        };

        const d2dData = getRecentAccumulatedData(data);
        this.doortoDoorData.set(d2dData);

        // console.log('Door-to-Door Visits: ', data);
        // console.log('Door-to-Door Visits: ', this.doortoDoorData());

        // this.mapDataReady(); // Prepare chart data after data is loaded
        // FORCE THE UI TO REFRESH
        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching door-to-door visits data', err);
      },
    });

    this.sudarshanService.getVoterFeedback().subscribe({
      next: (data: VoterFeedbackItem[]) => {
        this.analytics = data;
        this.voterFeedback = data;

        // Build counts
        const counts = data.reduce<Record<string, number>>((acc, { sentiment }) => {
          acc[sentiment] = (acc[sentiment] ?? 0) + 1;
          return acc;
        }, {});

        // Calculate total
        const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

        // Convert to %
        const percentages = Object.fromEntries(
          Object.entries(counts).map(([key, value]) => [key, Math.round((value / total) * 100)]),
        );

        this.voterSentiment.set(percentages);
        // this.mapDataReady();
        // console.log(this.voterSentiment());

        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching voter feedback data', err);
      },
    });

    this.sudarshanService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data; // Store analytics data for potential use in other charts or KPIs
        this.totalVolunteerCount.set(data.summary.totalVolunteers);
        this.activeVolunteerCount.set(data.summary.activeVolunteers);
        this.boothsCovered.set(data.summary.boothsCovered);
        this.votersContacted.set(data.outreachStats.votersReached);
        this.houseVisits.set(data.outreachStats.housesVisited);
        // Update other KPIs as needed based on the structure of analytics data
      },
      error: (err) => {
        console.error('Error fetching analytics data', err);
      },
    });

    this.sudarshanService.getOppositionActivity().subscribe({
      next: (data) => {
        const num = data.length;
        this.oppositionEvents.set(num);
      },
      error: (err) => {
        console.error('Error fetching Opposition Data', err);
      },
    });
  }

  ngAfterViewInit() {
    // Initializing charts here because the <canvas> elements are now in the DOM
  }
}
