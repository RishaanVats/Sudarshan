import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Alert {
  id: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reportedBy?: string;
  type?: string;
  booth?: number;
  description: string;
  reportedAt: string;
}

@Component({
  selector: 'app-strategic-alerts',
  imports: [CommonModule],
  templateUrl: './strategic-alerts.html',
  styleUrl: './strategic-alerts.css',
})
export class StrategicAlerts {
  @Input() alert = {} as Alert;

  readonly severityMap: Record<string, string> = {
    critical: 'alert-critical',
    high: 'alert-high',
    medium: 'alert-medium',
    low: 'alert-low',
  };

  // Fallback for the 'default' case
  readonly defaultStatusClass = 'alert-medium';
}
