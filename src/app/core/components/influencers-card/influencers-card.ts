import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface Influencer {
  id: number;
  name: string;
  role: string;
  status: string;
  contact: string;
  location: string;
  reach: string;
  dpUrl: string;
  dpWord?: string;
  [key: string]: any; // Allows any additional properties
}

@Component({
  selector: 'app-influencers-card',
  imports: [CommonModule],
  templateUrl: './influencers-card.html',
  styleUrl: './influencers-card.css',
})
export class InfluencersCard implements OnInit {
  @Input() person = {} as Influencer;

  ngOnInit() {
    if (this.person.dpUrl === '' || this.person.dpUrl === null) {
      this.person.dpWord = '';
      for (let i = 0; i < this.person.name.split(' ').length; i++) {
        this.person.dpWord += this.person.name.split(' ')[i][0];
      }
      console.log(this.person.dpUrl);
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
