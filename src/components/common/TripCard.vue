<template>
  <article class="trip-card">
    <div>
      <strong>{{ trip.title }}</strong>
      <p class="muted">{{ trip.destination }} · {{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</p>
    </div>
    <el-tag>{{ tripStatusText[trip.status] }}</el-tag>
    <div class="tc-members">
      <p>预算 {{ formatCurrency(trip.budget, trip.currency) }} · 同行 {{ trip.members.length }} 人</p>
      <div class="tc-avatars" :title="trip.members.map(m => m.name).join('、')">
        <MemberAvatar
          v-for="(member, index) in trip.members.slice(0, maxVisibleAvatars)"
          :key="member.id"
          :member="member"
          :size="26"
          class="tc-avatar"
          :style="index > 0 ? { marginLeft: '-6px' } : {}"
        />
        <span v-if="trip.members.length > maxVisibleAvatars" class="tc-more">+{{ trip.members.length - maxVisibleAvatars }}</span>
      </div>
    </div>
    <div class="toolbar">
      <el-button type="primary" @click="$emit('open', trip.id)">进入详情</el-button>
      <el-button @click="$emit('remove', trip.id)">删除</el-button>
    </div>
  </article>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { Trip } from '../../models/trip';
import { formatCurrency, formatDate, tripStatusText } from '../../utils/formatters';
import MemberAvatar from './MemberAvatar.vue';
defineProps<{ trip: Trip }>();
defineEmits<{ open: [id: string]; remove: [id: string] }>();
const maxVisibleAvatars = ref(4);
</script>
<style scoped>
.trip-card { background: #fff; border: 1px solid #dbe7cf; border-radius: 8px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.tc-members { display: flex; flex-direction: column; gap: 8px; }
.tc-avatars { display: flex; align-items: center; }
.tc-avatar { border: 2px solid #fff; }
.tc-more { margin-left: 6px; font-size: 12px; color: #61706b; }
</style>
