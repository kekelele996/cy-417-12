import type { DayPlan } from '../models/dayPlan';
import type { Spot } from '../models/spot';
import type { Trip } from '../models/trip';
import type { Member } from '../models/member';
import { messages } from '../constants/messages';

export interface PerMemberSpending {
  member: Member;
  amount: number;
}

export function calcTripCost(dayPlans: DayPlan[], spots: Spot[]) {
  const spotMap = new Map(spots.map((spot) => [spot.id, spot]));
  return dayPlans.reduce((sum, day) => {
    return sum + day.items.reduce((inner, item) => inner + (spotMap.get(item.spot_id)?.price || 0), 0);
  }, 0);
}

export function calcPerMemberSpending(trip: Trip, dayPlans: DayPlan[], spots: Spot[]): PerMemberSpending[] {
  const total = calcTripCost(dayPlans, spots);
  const memberCount = Math.max(1, trip.members.length);
  const perPerson = total / memberCount;
  return trip.members.map((member) => ({ member, amount: perPerson }));
}

export function budgetStatus(trip: Trip, dayPlans: DayPlan[], spots: Spot[]) {
  const spent = calcTripCost(dayPlans, spots);
  const perMember = calcPerMemberSpending(trip, dayPlans, spots);
  return {
    spent,
    remaining: trip.budget - spent,
    warning: spent > trip.budget ? messages.budgetExceeded : '',
    perMember,
  };
}
