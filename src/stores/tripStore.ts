import { defineStore } from 'pinia';
import { TripStatus } from '../constants/trip';
import type { Trip } from '../models/trip';
import type { Member } from '../models/member';
import { tripApi } from '../api/tripApi';
import { messages } from '../constants/messages';
import { toast } from '../utils/message';

const AVATAR_COLORS = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#C0392B',
  '#8E44AD', '#27AE60', '#2980B9', '#D35400', '#7F8C8D',
];

function pickColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function migrateMembers(raw: any[]): Member[] {
  if (!raw.length) return [];
  if (typeof raw[0] === 'string') {
    return raw.map((name: string, i) => ({
      id: crypto.randomUUID(),
      name,
      color: pickColor(i),
    }));
  }
  return raw as Member[];
}

function migrateTrips(trips: any[]): Trip[] {
  return trips.map((trip) => ({
    ...trip,
    members: migrateMembers(trip.members || []),
  }));
}

export const useTripStore = defineStore('trip', {
  state: () => {
    const raw = tripApi.list();
    const trips = migrateTrips(raw as any[]);
    if (JSON.stringify(raw) !== JSON.stringify(trips)) {
      tripApi.save(trips);
    }
    return { trips, statusFilter: 'all' as TripStatus | 'all' };
  },
  getters: {
    filteredTrips: (state) => state.statusFilter === 'all' ? state.trips : state.trips.filter((trip) => trip.status === state.statusFilter),
  },
  actions: {
    createTrip(title = '杭州周末慢旅行') {
      const trip: Trip = {
        id: crypto.randomUUID(),
        title,
        destination: '杭州',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        budget: 3200,
        currency: 'CNY',
        members: [
          { id: crypto.randomUUID(), name: '我', color: pickColor(0) },
          { id: crypto.randomUUID(), name: '朋友', color: pickColor(1) },
        ],
        status: TripStatus.PLANNING,
        created_at: new Date().toISOString(),
      };
      this.trips.unshift(trip);
      tripApi.save(this.trips);
      toast.ok(messages.tripCreated);
      return trip.id;
    },
    removeTrip(id: string) {
      this.trips = this.trips.filter((trip) => trip.id !== id);
      tripApi.save(this.trips);
      toast.ok(messages.tripDeleted);
    },
    addMember(tripId: string, name: string) {
      const trip = this.trips.find((t) => t.id === tripId);
      if (!trip || !name.trim()) return;
      const member: Member = {
        id: crypto.randomUUID(),
        name: name.trim(),
        color: pickColor(trip.members.length),
      };
      trip.members.push(member);
      tripApi.save(this.trips);
      toast.ok('已添加成员');
      return member;
    },
    removeMember(tripId: string, memberId: string) {
      const trip = this.trips.find((t) => t.id === tripId);
      if (!trip) return;
      if (trip.members.length <= 1) {
        toast.fail('至少保留一名成员');
        return;
      }
      trip.members = trip.members.filter((m) => m.id !== memberId);
      tripApi.save(this.trips);
      toast.ok('已移除成员');
    },
    getTrip(tripId: string) {
      return this.trips.find((t) => t.id === tripId);
    },
  },
});
