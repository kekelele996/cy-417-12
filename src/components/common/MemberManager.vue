<template>
  <section class="band member-manager">
    <header class="mm-header">
      <strong>同行人</strong>
      <span class="muted">共 {{ trip.members.length }} 人</span>
    </header>
    <ul class="mm-list">
      <li v-for="member in trip.members" :key="member.id" class="mm-item">
        <MemberAvatar :member="member" :size="36" />
        <div class="mm-info">
          <div class="mm-name">{{ member.name }}</div>
          <div class="muted mm-spending">人均 {{ formatCurrency(perMemberMap.get(member.id) || 0, trip.currency) }}</div>
        </div>
        <el-button
          size="small"
          text
          type="danger"
          :disabled="trip.members.length <= 1"
          @click="onRemove(member.id)"
        >移除</el-button>
      </li>
    </ul>
    <div class="mm-add">
      <el-input
        v-model="newName"
        placeholder="输入同行人姓名"
        size="default"
        clearable
        @keyup.enter="onAdd"
      />
      <el-button type="primary" @click="onAdd">添加</el-button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Trip } from '../../models/trip';
import type { PerMemberSpending } from '../../utils/budgetCalculator';
import { formatCurrency } from '../../utils/formatters';
import { useTripStore } from '../../stores/tripStore';
import MemberAvatar from './MemberAvatar.vue';
const props = defineProps<{ trip: Trip; perMember: PerMemberSpending[] }>();
const emit = defineEmits<{ change: [] }>();
const tripStore = useTripStore();
const newName = ref('');
const perMemberMap = computed(() => new Map(props.perMember.map((item) => [item.member.id, item.amount])));
function onAdd() {
  if (!newName.value.trim()) return;
  tripStore.addMember(props.trip.id, newName.value);
  newName.value = '';
  emit('change');
}
function onRemove(memberId: string) {
  tripStore.removeMember(props.trip.id, memberId);
  emit('change');
}
</script>
<style scoped>
.member-manager { display: flex; flex-direction: column; gap: 14px; }
.mm-header { display: flex; align-items: center; justify-content: space-between; }
.mm-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.mm-item { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 8px; background: #f8faf6; }
.mm-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.mm-name { font-weight: 600; }
.mm-spending { font-size: 12px; }
.mm-add { display: flex; gap: 10px; }
.mm-add .el-input { flex: 1; }
</style>
