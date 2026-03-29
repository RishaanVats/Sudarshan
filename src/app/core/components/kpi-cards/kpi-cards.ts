import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Volunteer {
  active: boolean;
  booth: number;
  id: number;
  name: string;
  phone: number;
  role: string;
  isCoordinator?: boolean;
  isVolunteer?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  @Input() card: any;

}
