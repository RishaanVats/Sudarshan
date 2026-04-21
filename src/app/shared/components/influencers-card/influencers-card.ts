import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';

import { Influencer } from '../../../core/types';

@Component({
  selector: 'app-influencers-card',
  imports: [CommonModule],
  templateUrl: './influencers-card.html',
  styleUrl: './influencers-card.css',
})
export class InfluencersCard implements OnInit {
  @Input() person = {} as Influencer;
  // personDPWord = signal<Influencer>({ dpWord: 'TT' } as Influencer);

  personDPWord = computed(() => {
    return { dpWord: this.getDPword(this.person.name) } as Influencer;
  });

  ngOnInit() { }

  getDPword(name: string): string {
    if (!name) {
      this.person.dpWord = '';
      return 'N/A';
    } else {
      this.person.dpWord = '';
      const arr = this.person.name.split(' ');
      const len = arr.length;

      this.person.dpWord = arr[0][0] + arr[len - 1][0];
      // console.log(this.person.dpWord);
      return this.person.dpWord;
    }
  }

  // getStatusClass(status: string): string {
  //   switch (status.toLowerCase()) {
  //     case 'confirmed':
  //       return 'status-confirmed';
  //     case 'pending':
  //       return 'status-pending';
  //     case 'contacted':
  //       return 'status-contacted';
  //     case 'new lead':
  //       return 'status-new-lead';
  //     case 'vip':
  //       return 'status-vip';
  //     default:
  //       return 'status-new-lead'; // Default to 'New Lead' style if status is unrecognized
  //   }
  // }

  readonly statusMap: Record<string, string> = {
    confirmed: 'status-confirmed',
    pending: 'status-pending',
    contacted: 'status-contacted',
    'new lead': 'status-new-lead',
    vip: 'status-vip',
  };

  // Fallback for the 'default' case
  readonly defaultStatusClass = 'status-new-lead';
}
