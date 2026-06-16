<template>
  <div
    class="member-avatar"
    :style="{ background: member.color, width: size + 'px', height: size + 'px', fontSize: (size * 0.4) + 'px' }"
    :title="member.name"
  >
    {{ initials }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '../../models/member';
import { getInitials } from '../../utils/formatters';
const props = withDefaults(defineProps<{ member: Member; size?: number }>(), { size: 32 });
const initials = computed(() => getInitials(props.member.name));
</script>
<style scoped>
.member-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
  user-select: none;
}
</style>
