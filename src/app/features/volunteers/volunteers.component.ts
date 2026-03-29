import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SudarshanService } from '../../core/services/sudarshan.service';
import { ChangeDetectorRef } from '@angular/core';

import { KpiCards } from '../../core/components/kpi-cards/kpi-cards';

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [CommonModule, KpiCards],
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.css'],
})
export class VolunteersComponent {
  constructor(
    private sudarshanService: SudarshanService,
    private cdr: ChangeDetectorRef,
  ) {}

  kpiCards = [
    {
      title: 'Registered',
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
}
