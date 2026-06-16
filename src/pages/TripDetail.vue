<template>
  <main class="page" v-if="trip">
    <TripHeader :trip="trip" />
    <div class="toolbar">
      <el-button type="primary" @click="router.push('/spots')">添加景点</el-button>
      <el-button @click="router.push('/planner/' + trip.id + '/1')">编排第 1 天</el-button>
      <el-button @click="router.push('/share')">分享预览</el-button>
    </div>
    <section class="grid td-grid">
      <BudgetChart
        :spent="stats.value.budget.spent"
        :remaining="stats.value.budget.remaining"
        :currency="trip.currency"
        :perMember="stats.value.budget.perMember"
      />
      <MemberManager
        :trip="trip"
        :perMember="stats.value.budget.perMember"
        @change="refreshTick = Date.now()"
      />
      <div class="band">
        <strong>统计</strong>
        <p>天数 {{ stats.value.days }} · 景点 {{ stats.value.spotCount }}</p>
        <p class="muted">{{ stats.value.budget.warning }}</p>
      </div>
    </section>
    <DayTimeline
      v-for="day in tripDays"
      :key="day.id + '-' + refreshTick"
      :day="day"
      :spots="spotStore.spots"
      :members="trip.members"
      :editable="true"
    />
  </main>
  <main v-else class="page"><EmptyState title="旅行不存在" /></main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTripStore } from '../stores/tripStore';
import { useSpotStore } from '../stores/spotStore';
import { useDayPlanStore } from '../stores/dayPlanStore';
import { useTripStats } from '../hooks/useTripStats';
import TripHeader from '../components/common/TripHeader.vue';
import DayTimeline from '../components/common/DayTimeline.vue';
import BudgetChart from '../components/common/BudgetChart.vue';
import MemberManager from '../components/common/MemberManager.vue';
import EmptyState from '../components/common/EmptyState.vue';
const route = useRoute();
const router = useRouter();
const tripStore = useTripStore();
const spotStore = useSpotStore();
const dayPlanStore = useDayPlanStore();
const refreshTick = ref(Date.now());
const trip = computed(() => tripStore.trips.find((item) => item.id === route.params.id));
const tripDays = computed(() => dayPlanStore.dayPlans.filter((day) => day.trip_id === route.params.id));
const stats = computed(() => {
  if (!trip.value) {
    return { value: { days: 0, spotCount: 0, budget: { spent: 0, remaining: 0, warning: '', perMember: [] } } };
  }
  return useTripStats(trip.value, dayPlanStore.dayPlans, spotStore.spots);
});
</script>
<style scoped>
.td-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
</style>
