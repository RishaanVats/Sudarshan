import { Component, computed, signal } from '@angular/core';

import { SudarshanService } from '../../core/services/sudarshan.service';

import { KpiCards } from '../../shared/components/kpi-cards/kpi-cards';
import { Charts } from '../../shared/components/charts/charts';
import { TablesComponent } from '../../shared/components/tables-component/tables-component';

import { kpiCards, chartsVerify } from '../../core/types';

@Component({
  selector: 'app-door-outreach',
  imports: [KpiCards],
  templateUrl: './door-outreach.html',
  styleUrl: './door-outreach.css',
})
export class DoorOutreach {
  constructor(private sudarshanService: SudarshanService) {}

  doorToDoorData = signal([]);
  kpiCardData = signal({
    doorsKnocked: 0,
    contactRate: 0,
    pledgesSecured: 0,
    teamsDeployed: 0,
    noContactDoors: 0,
  });

  ngOnInit() {
    this.fetchData();
  }

  kpiCards = computed(() => {
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

  fetchData() {
    this.sudarshanService.getDoorToDoorVisits().subscribe({
      next: (data) => {
        this.doorToDoorData.set(data);
        console.log(this.doorToDoorData());

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

        console.log(this.kpiCardData());
      },
      error: (err) => {
        console.error('Failed to fetch door to door data', err);
      },
    });
  }
}
