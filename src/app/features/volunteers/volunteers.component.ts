import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';

// Assuming these types are defined in your core/types file
import {
  VolunteerAttendance,
  AttendanceRecord,
  DailyAttendanceCount,
  Volunteer,
} from '../../core/types';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';
import { map } from 'rxjs';

interface ZoneMap {
  [key: string]: number;
}

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [CommonModule, KpiCards, Charts, TablesComponent],
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.css'],
})
export class VolunteersComponent implements OnInit {
  // 1. Definite Assignment: Initialized to prevent TS errors
  public kpiCharts: any[] = [];
  public dailyVolunnteerChecks: DailyAttendanceCount[] = [];
  public attendanceRecord: AttendanceRecord[] = [];
  private sortedPercentages: any[] = [];

  volunteersData: Volunteer[] = [];

  // Mock data for KPI Cards
  public kpiCards = [
    {
      title: 'Registered',
      count: '4,812',
      trendText: '+148 this week',
      isPositive: true,
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
      title: 'Hours Logged',
      count: '9,340',
      trendText: '+1,200 today',
      isPositive: true,
      themeVar: 'var(--ac-emerald)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'New This Week',
      count: '148',
      trendText: '+22% vs prior week',
      isPositive: true,
      themeVar: 'var(--ac-violet)',
      trendVar: 'var(--ac-emerald)',
    },
    {
      title: 'Absentees Today',
      count: '63',
      trendText: '-5.2% absence rate',
      isPositive: false,
      themeVar: 'var(--ac-rose)',
      trendVar: 'var(--ac-rose)',
    },
  ];

  constructor(
    private sudarshanService: SudarshanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAttendanceData();
    this.loadVolunteersData();
  }

  private loadAttendanceData(): void {
    this.sudarshanService.getVolunteerAttendance().subscribe({
      next: (data: VolunteerAttendance) => {
        // Handle nested data structure if necessary; assuming data is the array
        const rawRecords = Array.isArray(data) ? data : (data as any).records || [];
        this.attendanceRecord = rawRecords;

        // Process the raw records into the DailyAttendanceCount format
        this.dailyVolunnteerChecks = this.processAttendanceData(this.attendanceRecord);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching volunteer attendance:', err),
    });
  }

  private loadVolunteersData(): void {
    this.sudarshanService.getVolunteers().subscribe({
      next: (data: Volunteer[]) => {
        data.forEach((volunteer) => {
          volunteer['lastSync'] = new Date(volunteer['lastSync']).toLocaleString(); // Set the last sync time
        });
        this.volunteersData = data;

        const zoneCounts = this.volunteersData.reduce((acc: ZoneMap, curr) => {
          const zone = curr['zone'];
          // If the zone exists in our accumulator, increment it; otherwise, set to 1
          acc[zone] = (acc[zone] || 0) + 1;
          return acc;
        }, {} as ZoneMap);

        // 2. Map the counts to percentages
        const zonePercentages = Object.keys(zoneCounts).map((zoneName) => {
          const count = zoneCounts[zoneName];
          const percentage = ((count / this.volunteersData.length) * 100).toFixed(1); // Keep 1 decimal point

          return {
            zone: zoneName,
            count: count,
            percentage: `${percentage}%`,
          };
        });

        this.sortedPercentages = zonePercentages.sort((a, b) => {
          return a.zone.localeCompare(b.zone, undefined, { numeric: true });
        });

        // Map to the chart once data is processed
        this.plotVolunteerAttendanceChart();
        // console.log(zoneCounts, zonePercentages, sortedPercentages);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching volunteers data:', err),
    });
  }

  private processAttendanceData(data: AttendanceRecord[]): DailyAttendanceCount[] {
    // Step 1: Accumulate "Present" counts by date
    const tally = data.reduce<Record<string, number>>((acc, record) => {
      if (record.status === 'Present') {
        // Extract YYYY-MM-DD from ISO string
        const dateKey = record.date.split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {});

    // Step 2: Convert to Array and Sort Ascending (standard for line/bar charts)
    return Object.entries(tally)
      .map(
        ([date, presentCount]): DailyAttendanceCount => ({
          date,
          presentCount,
        }),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  plotVolunteerAttendanceChart(): void {
    // Extract the first 15 days of data for the chart
    const limitedData = this.dailyVolunnteerChecks.slice(0, 15);

    // Update the kpiCharts array (re-assignment triggers Angular change detection)
    this.kpiCharts = [
      {
        title: 'Daily Volunteer Check-Ins - Last 15 Days',
        id: 'dailyVolunteerChecks',
        type: 'bar',
        legendNeeded: false,
        data: limitedData.map((record) => record.presentCount),
        labels: limitedData.map((record) => record.date),
        width: '64%', // Optional: specify width for better layout control
      },
      {
        title: 'Volunteer distribution by Zone',
        id: 'volunteerDistribution',
        type: 'doughnut',
        legendNeeded: true,
        data: [...this.sortedPercentages.map((item) => item.count)], 
        labels: [...this.sortedPercentages.map((item) => item.zone)],
        width: '25%', // Optional
      },
    ];

    // Debugging output as requested (Comma separated string)
    const countString = limitedData.map((record) => record.presentCount).join(', ');
    // console.log('Processed Chart Data (Counts):', countString);
  }
}
