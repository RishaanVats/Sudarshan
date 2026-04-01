import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

import { Volunteer, VolunteerAttendance, boothProgress } from '../../core/types';

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
  boothProgress: boothProgress[] = [];
  // boothProgressTable: any[][] = []; // Stores transformed table data
  warRoomAlerts: any[] = []; // Define an interface if ever want a specific structure for alerts

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

        // Segregate into specific lists
        // this.onlyVolunteers = this.volunteers.filter((v) => v.role === 'Volunteer');
        // this.onlyCoordinators = this.volunteers.filter((v) => v.role === 'Coordinator');
        // this.onlyBoothWorkers = this.volunteers.filter((v) => v.role === 'Booth Worker');
        // this.onlyFieldOrganizers = this.volunteers.filter((v) => v.role === 'Field Organizer');
        // this.onlySocialMedia = this.volunteers.filter((v) => v.role === 'Social Media');

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
        // this.boothProgressTable = this.transformToTableRobust(data);
        // console.log('Booth Progress: ', this.boothProgressTable);


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
  }

//   transformToTableRobust<T extends object>(data: T[]): any[][] {
//   if (data.length === 0) return [];

//   // 1. Get all unique keys from all objects (in case some are missing in the first one)
//   const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj)))) as (keyof T)[];

//   // 2. Map each object, filling in undefined/null for missing keys
//   const rows = data.map((obj) => 
//     allKeys.map((key) => (key in obj ? obj[key] : null)) 
//   );

//   // 3. Return headers + data rows
//   return [allKeys, ...rows];
// }

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

  kpiCharts: Array<{
    title: string;
    id: string;
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    legendNeeded: boolean;
    data: number[] | string[];
    labels: string[];
    width?: string; // Optional width for layout control in percentage or fixed units (e.g., '400px')
  }> = [
    {
      title: 'Volunteer Activity - 30 days',
      id: 'volunteerActivityChart',
      type: 'line',
      legendNeeded: false,
      data: [120, 190, 150, 250, 300, 450, 560],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      width: '32%', // Optional: specify width for better layout control
    },
    {
      title: 'Door-to-Door Outreach - This Week',
      id: 'doorOutreachChart',
      type: 'bar',
      legendNeeded: false,
      data: [50, 75, 100, 150, 200, 250, 318],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      width: '32%', // Optional: specify width for better layout control
    },
    {
      title: 'Voter Sentiment Distribution',
      id: 'voterSentimentChart',
      type: 'doughnut',
      legendNeeded: true,
      data: [38, 29, 18, 15],
      labels: ['Positive', 'Neutral', 'Negative', 'Unknown'],
      width: '30%', // Optional: specify width for better layout control
    },
  ];

  strategicAlerts = [
    {
      id: 1,
      // Cast the variable as the specific type
      severity: 'high' as 'low' | 'critical' | 'high' | 'medium',
      description: 'Something happened somewhere',
      reportedAt: new Date().toLocaleString(),
      reportedBy: 'Volunteer 3',
    },
    {
      id: 2,
      severity: 'critical' as 'low' | 'critical' | 'high' | 'medium',
      description: 'Master Blaster ON',
      reportedAt: new Date().toLocaleString(),
      reportedBy: 'Volunteer 6',
    },
    {
      id: 3,
      severity: 'medium' as 'low' | 'critical' | 'high' | 'medium',
      description: 'Meeting @ War Room',
      reportedAt: new Date().toLocaleString(),
      reportedBy: 'Manager 3',
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
