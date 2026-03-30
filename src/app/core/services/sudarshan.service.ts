// src/app/core/services/sudarshan.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SudarshanService {
  constructor(private api: ApiService) {}

  // Example: Get all volunteers
  getVolunteers(): Observable<any> {
    return this.api.get('volunteers');
  }

  getDailyActive(): Observable<any> {
    return this.api.get('dailyActivity');
  }

  getBoothProgress(): Observable<any> {
    return this.api.get('boothProgress');
  }

  getWarRoomAlertsSorted(): Observable<any> {
    return this.api.get('warroomAlerts/sorted-data');
  }

  // Example: Add volunteer
  addVolunteer(data: any): Observable<any> {
    return this.api.post('volunteers', data);
  }

  // Example: Get campaigns
  getCampaigns(): Observable<any> {
    return this.api.get('campaigns');
  }

  // Example: Update campaign
  updateCampaign(id: string, data: any): Observable<any> {
    return this.api.put(`campaigns/${id}`, data);
  }

  // Example: Delete campaign
  deleteCampaign(id: string): Observable<any> {
    return this.api.delete(`campaigns/${id}`);
  }
}
