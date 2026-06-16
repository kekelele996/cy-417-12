<template>
  <header class="trip-header">
    <p class="muted">TripWeaver Share</p>
    <h1>{{ trip.title }}</h1>
    <p class="th-subtitle">{{ trip.destination }} · {{ trip.start_date }} 至 {{ trip.end_date }}</p>
    <div class="th-members" v-if="trip.members.length">
      <div class="th-avatars" :title="trip.members.map(m => m.name).join('、')">
        <MemberAvatar
          v-for="(member, index) in trip.members.slice(0, maxVisibleAvatars)"
          :key="member.id"
          :member="member"
          :size="32"
          :style="index > 0 ? { marginLeft: '-8px' } : {}"
        />
        <span v-if="trip.members.length > maxVisibleAvatars" class="th-more">+{{ trip.members.length - maxVisibleAvatars }}</span>
      </div>
      <span class="muted th-count">共 {{ trip.members.length }} 人同行</span>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { Trip } from '../../models/trip';
import MemberAvatar from './MemberAvatar.vue';
defineProps<{ trip: Trip }>();
const maxVisibleAvatars = ref(6);
</script>
<style scoped>
.trip-header { padding: 28px 0; border-bottom: 2px solid #2d7a46; }
.th-subtitle { margin: 4px 0 16px; }
.th-members { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.th-avatars { display: flex; align-items: center; }
.th-more { margin-left: 8px; font-size: 13px; color: #61706b; }
.th-count { font-size: 13px; }
</style>
