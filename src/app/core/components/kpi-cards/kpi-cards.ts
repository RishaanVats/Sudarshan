import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Volunteer } from '../../types';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  @Input() card: any;

}
