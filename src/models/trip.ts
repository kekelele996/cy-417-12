import { TripStatus } from '../constants/trip';
import type { Member } from './member';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  members: Member[];
  status: TripStatus;
  created_at: string;
}

