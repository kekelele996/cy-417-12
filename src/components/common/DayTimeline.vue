<template>
  <section class="band">
    <header class="dt-header">
      <h3>第 {{ day.day_index }} 天 · {{ day.date }}</h3>
      <div class="dt-leader">
        <template v-if="editable">
          <el-tooltip content="指定今日负责人" placement="top">
            <el-select
              :model-value="day.leader_id"
              placeholder="选负责人"
              size="small"
              style="width: 150px"
              clearable
              @change="onLeaderChange"
            >
              <el-option
                v-for="member in members"
                :key="member.id"
                :label="member.name"
                :value="member.id"
              >
                <div class="dt-option">
                  <MemberAvatar :member="member" :size="22" />
                  <span>{{ member.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-tooltip>
        </template>
        <template v-else>
          <div v-if="leader" class="dt-leader-display">
            <MemberAvatar :member="leader" :size="24" />
            <span class="muted dt-leader-name">负责人: {{ leader.name }}</span>
          </div>
          <span v-else class="muted dt-no-leader">未指定负责人</span>
        </template>
      </div>
    </header>
    <ol>
      <li v-for="item in day.items" :key="item.spot_id + item.start_time">
        <strong>{{ spotName(item.spot_id) }}</strong>
        <span class="muted">{{ item.start_time }}-{{ item.end_time }} · {{ transportText[item.transport] }} · {{ item.note }}</span>
      </li>
    </ol>
    <p v-if="!day.items.length" class="muted">这一天还没有安排。</p>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { DayPlan } from '../../models/dayPlan';
import type { Spot } from '../../models/spot';
import type { Member } from '../../models/member';
import { transportText } from '../../utils/formatters';
import { useDayPlanStore } from '../../stores/dayPlanStore';
import MemberAvatar from './MemberAvatar.vue';
const props = withDefaults(defineProps<{
  day: DayPlan;
  spots: Spot[];
  members?: Member[];
  editable?: boolean;
}>(), { members: () => [], editable: false });
const dayPlanStore = useDayPlanStore();
const leader = computed(() => props.members.find((m) => m.id === props.day.leader_id));
const spotName = (id: string) => props.spots.find((spot) => spot.id === id)?.name || '未知景点';
function onLeaderChange(value: string | null) {
  dayPlanStore.setLeader(props.day.id, value);
}
</script>
<style scoped>
.dt-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.dt-header h3 { margin: 0; }
.dt-leader { display: flex; align-items: center; }
.dt-leader-display { display: flex; align-items: center; gap: 8px; }
.dt-leader-name { font-size: 13px; }
.dt-no-leader { font-size: 13px; }
.dt-option { display: flex; align-items: center; gap: 8px; }
ol { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 8px; }
li strong { margin-right: 8px; }
</style>
