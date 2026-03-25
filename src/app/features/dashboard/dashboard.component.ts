import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

    kpiCards = [
    {
      title: 'Total Volunteers',
      count: '4,812',
      trendText: '+148 this week',
      isPositive: true,
      // Provide the string name of your global variable
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
      title: "Opp. Events",
      count: '17',
      trendText: '3 new alerts today',
      isPositive: false,
      themeVar: 'var(--ac-rose)',
      trendVar: 'var(--ac-rose)',
    },
  ];

}
