import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

import { Volunteer, VolunteerAttendance, boothProgress, chartsVerify } from '../../core/types';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { InfluencersCard } from '../../shared/components/influencers-card/influencers-card';
import { StrategicAlerts } from '../../shared/components/strategic-alerts/strategic-alerts';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

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
  boothProgress: boothProgress[] = [];
  // boothProgressTable: any[][] = []; // Stores transformed table data
  warRoomAlerts: any[] = []; // Define an interface if ever want a specific structure for alerts
  influencerRecommendations: any[] = []; // Define an interface if you have a specific structure for influencers
  dailyActivity: any[] = []; // Define an interface if you have a specific structure for daily activity data

  mapData: chartsVerify[] = [];
  doortoDoorData: any[] = [];
  voterFeedback: any[] = []; // Define an interface if you have a specific structure for voter feedback
  voterSentiment: Record<string, number> = {}; // To store sentiment counts

  onlyVolunteers: Volunteer[] = []; // Only those with role "Volunteers"
  onlyCoordinators: Volunteer[] = []; // Only those with role "Coordinator"
  onlyBoothWorkers: Volunteer[] = []; // Only thise with role "Booth Worker"
  onlySocialMedia: Volunteer[] = []; // Only those with role "Social Media"
  onlyFieldOrganizers: Volunteer[] = []; // Only those with role "Field Organizer"

  constructor(
    private sudarshanService: SudarshanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  mapDataReady() {
    this.mapData = [
      {
        title: 'Volunteer Activity - 30 days',
        id: 'volunteerActivityChart',
        type: 'line',
        legendNeeded: false,
        data: this.dailyActivity.map((entry) => entry.votersReached),
        labels: this.dailyActivity.map((entry) => entry.date),
        width: '32%', // Optional: specify width for better layout control
      },
      {
        title: 'Door-to-Door Outreach - This Week',
        id: 'doorOutreachChart',
        type: 'bar',
        legendNeeded: false,
        data: this.doortoDoorData.map((entry) => entry.housesVisited),
        labels: this.doortoDoorData.map((entry) => entry.date),
        width: '32%', // Optional: specify width for better layout control
      },
      {
        title: 'Voter Sentiment Distribution',
        id: 'voterSentimentChart',
        type: 'doughnut',
        legendNeeded: true,
        data: Object.values(this.voterSentiment),
        labels: Object.keys(this.voterSentiment),
        width: '30%', // Optional: specify width for better layout control
      },
    ];

    this.cdr.detectChanges(); // Ensure the UI updates with the new chart data
  }

  loadData() {
    this.sudarshanService.getVolunteers().subscribe({
      next: (data: Volunteer[]) => {
        this.volunteers = data.map((val: Volunteer) => ({
          ...val,
          isCoordinator: val.role === 'Coordinator',
          isVolunteer: val.role === 'Volunteer',
        }));

        // Force a reference change so the UI 'sees' the update
        this.kpiCards = [
          ...this.kpiCards.map((card) => {
            if (card.title === 'Total Volunteers') {
              return { ...card, count: this.volunteers.length.toString() };
            }
            return card;
          }),
        ];

        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
        // console.log('getVolunteers called... ', this.volunteers);
      },
      error: (err) => {
        console.error('Error fetching volunteers', err);
      },
    });

    // Load Booth Progress from API
    this.sudarshanService.getBoothProgress().subscribe({
      next: (data: boothProgress[]) => {
        this.boothProgress = data;

        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Booth Progress', err);
      },
    });

    // Load War Room Alerts from API
    this.sudarshanService.getWarRoomAlertsSorted().subscribe({
      next: (data) => {
        this.warRoomAlerts = data;
        this.warRoomAlerts.forEach((alert: any) => {
          alert.severity = alert.severity.toLowerCase(); // Ensure severity is lowercase for consistent CSS class mapping
          alert.reportedAt = new Date(alert.reportedAt).toLocaleString(); // Format the date for display
        });
        // console.log('War Room Alerts: ', data);
        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Booth Progress', err);
      },
    });

    this.sudarshanService.getTopInfluencerRecommendations().subscribe({
      next: (data) => {
        // console.log('Influencer Recommendations: ', data);
        this.influencerRecommendations = data;
        this.influencerRecommendations.forEach((influencer: any) => {
          influencer.status = influencer.status.toLowerCase(); // Ensure status is lowercase for consistent CSS class mapping
          influencer.reach = influencer.estimatedInfluence.toLocaleString(); // Format reach with commas
        });
        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Influencer Recommendations', err);
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
        this.dailyActivity = data;
        this.dailyActivity.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ); // Sort by date ascending
        // console.log('Daily Activity: ', this.dailyActivity);
        // console.log(this.dailyActivity.map((entry) => entry.votersReached));
        // console.log('Daily Activity: ', data);

        this.mapDataReady(); // Prepare chart data after daily activity is loaded
        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
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

        this.doortoDoorData = getRecentAccumulatedData(data);
        // console.log('Door-to-Door Visits: ', data);
        console.log('Door-to-Door Visits: ', this.doortoDoorData);

        this.mapDataReady(); // Prepare chart data after data is loaded
        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching door-to-door visits data', err);
      },
    });

    this.sudarshanService.getVoterFeedback().subscribe({
      next: (data) => {
        this.voterFeedback = data;
        // console.log('Voter Feedback: ', data);
        interface VoterFeedbackItem {
          sentiment: string;
          // Add other properties if known, e.g., id?: number; message?: string;
        }

        this.voterSentiment = (data as VoterFeedbackItem[]).reduce(
          (acc, { sentiment }) => {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const totalSentiments = Object.values(this.voterSentiment).reduce(
          (sum, count) => sum + count,
          0,
        );

        const percentages = Object.fromEntries(
          Object.entries(this.voterSentiment).map(([key, value]) => [
            key,
            Math.round((value / totalSentiments) * 100),
          ]),
        );

        this.voterSentiment = percentages; // Update voterSentiment to hold percentage values for the chart
        this.mapDataReady(); // Update charts with new sentiment data
        // FORCE THE UI TO REFRESH
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching voter feedback data', err);
      },
    });
  }

  boothIntell: Array<{
    booth: string;
    totalVoters: number;
    contacted: number;
    supporters: number;
    undecided: number;
    coverage: number;
  }> = [
    {
      booth: 'Booth 42 - Paschim Tola',
      totalVoters: 3241,
      contacted: 2918,
      supporters: 1842,
      undecided: 612,
      coverage: 90.1,
    },
    {
      booth: 'Booth 17 - Ramrekha Ghat',
      totalVoters: 2890,
      contacted: 2400,
      supporters: 1510,
      undecided: 480,
      coverage: 83.0,
    },
    {
      booth: 'Booth 32 - Rameshwar Colony',
      totalVoters: 4102,
      contacted: 3200,
      supporters: 1960,
      undecided: 710,
      coverage: 78.0,
    },
    {
      booth: 'Booth 06 - Churchgate',
      totalVoters: 2650,
      contacted: 1900,
      supporters: 1100,
      undecided: 440,
      coverage: 71.7,
    },
  ];

  kpiCards = [
    {
      title: 'Total Volunteers',
      count: 0,
      trendText: '+148 this week',
      isPositive: true,
      // Provided the string name of global variable
      themeVar: 'var(--ac-blue)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'Active Today',
      count: '107',
      trendText: '+22% vs daily avg',
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

  topInfluencers = [
    {
      id: 1,
      name: 'Dr Amara Sayyed',
      role: 'Doctor',
      status: 'Contacted',
      contact: '9876543210',
      location: 'Sector 12, Patna',
      reach: '1.5K',
      dpUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      role: 'Local Leader',
      status: 'VIP',
      contact: '9876543210',
      location: 'Sector 22, Patna',
      reach: '3.2K',
      dpUrl: '',
    },
    {
      id: 3,
      name: 'Muralidhar Sharma',
      role: 'Business Owner',
      status: 'Confirmed',
      contact: '9876543210',
      location: 'Sector 2, Patna',
      reach: '2.5K',
      dpUrl: '',
    },
    {
      id: 4,
      name: 'Dheeraj Yadav',
      role: 'Commmunity Organizer',
      status: 'New Lead',
      contact: '9876543210',
      location: 'Sector 15, Patna',
      reach: '1.1K',
      dpUrl: 'https://randomuser.me/api/portraits/men/47.jpg',
    },
  ];

  ngAfterViewInit() {
    // Initializing charts here because the <canvas> elements are now in the DOM
  }
}
