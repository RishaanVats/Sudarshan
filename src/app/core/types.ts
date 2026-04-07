export interface VolunteerAttendance {
  id: number;
  volunteerId: number;
  booth: number;
  date: string; // ISO format string from server
  status: 'Present' | 'Absent';
}

export interface Volunteer {
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

export interface kpiCards {
  title: string;
  count: number;
  trendText: string;
  isPositive: boolean;
  themeVar: string;
  trendVar: string;
}

export interface boothProgress {
  id: number;
  booth: number;
  boothName: string;
  targetVoters: number;
  votersReached: number;
  supportersIdentified: number;
  undecided: number;
  coverage: number;
}

export interface chartsVerify {
  title: string;
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  legendNeeded: boolean;
  data: number[] | string[];
  labels: string[];
  width?: string; // Optional width property for layout control
}

export interface Influencer {
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

export interface Alert {
  id: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reportedBy?: string;
  type?: string;
  booth?: number;
  description: string;
  reportedAt: string;
}

export interface AttendanceRecord {
  id: number;
  volunteerId: number;
  booth: number;
  date: string; // ISO String
  status: 'Present' | 'Absent';
}

export interface DailyAttendanceCount {
  date: string;
  presentCount: number;
}

export interface DailyActivity {
  date: string;
  votersReached: number;
}

export interface doorToDoorData {
  date: string;
  housesVisited: number;
}

export interface VoterFeedbackItem {
  sentiment: string;
  // Add other properties if known, e.g., id?: number; message?: string;
}

