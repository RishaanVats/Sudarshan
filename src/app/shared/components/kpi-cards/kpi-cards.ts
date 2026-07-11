import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';

registerLocaleData(localeIn);

import { Volunteer } from '../../../core/types';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  @Input() card: any;
}
