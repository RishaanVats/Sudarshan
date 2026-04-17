// src/app/core/services/sudarshan.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SudarshanService {
  constructor(private api: ApiService) {}


  // --- Core Entities ---
  getVolunteers(): Observable<any> {
    return this.api.get('volunteers');
  }

  getBooths(): Observable<any> {
    return this.api.get('booths');
  }

  getEvents(): Observable<any> {
    return this.api.get('events');
  }

  getIssues(): Observable<any> {
    return this.api.get('issues');
  }

  getDailyActive(): Observable<any> {
    return this.api.get('dailyActivity');
  }

  // --- Field Operations ---
  getDoorToDoorVisits(): Observable<any> {
    return this.api.get('doorToDoorVisits');
  }

  getVolunteerAttendance(): Observable<any> {
    return this.api.get('volunteerAttendance');
  }

  getVoterFeedback(): Observable<any> {
    return this.api.get('voterFeedback');
  }

  getVoterFeedbackByZone(): Observable<any> {
    return this.api.get('voterFeedback/byZone');
  }

  getSentimentTrend(): Observable<any> {
    return this.api.get('sentimentTrend');
  }

  getBoothProgress(): Observable<any> {
    return this.api.get('boothProgress');
  }

  // --- Intelligence & Management ---
  getInfluencerRecommendations(): Observable<any> {
    return this.api.get('influencerRecommendations');
  }

    getTopInfluencerRecommendations(): Observable<any> {
    return this.api.get('influencerRecommendations?_sort=estimatedInfluence&_order=desc&_limit=12');
  }

  getOppositionActivity(): Observable<any> {
    return this.api.get('oppositionActivity');
  }

  getManagerReports(): Observable<any> {
    return this.api.get('managerReports');
  }

  // --- Strategy & Monitoring ---
  getCampaignTimeline(): Observable<any> {
    return this.api.get('campaignTimeline');
  }

  getWarroomAlerts(): Observable<any> {
    return this.api.get('warroomAlerts');
  }

  getAnalytics(): Observable<any> {
    return this.api.get('analytics');
  }

  getWarRoomAlertsSorted(): Observable<any> {
    return this.api.get('warroomAlerts/sorted-data');
  }

  getWarRoomReports() : Observable<any>{
    return this.api.get('warRoomReports');
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
