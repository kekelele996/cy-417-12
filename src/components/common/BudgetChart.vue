<template>
  <div class="budget-chart-wrapper">
    <el-tabs v-model="activeTab" class="bc-tabs" size="small">
      <el-tab-pane label="总览" name="overview">
        <div ref="pieEl" class="budget-chart" />
      </el-tab-pane>
      <el-tab-pane label="按人头" name="perMember">
        <div ref="barEl" class="budget-chart" />
        <div v-if="!perMember.length" class="muted bc-empty">暂无成员数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { PerMemberSpending } from '../../utils/budgetCalculator';
import { formatCurrency } from '../../utils/formatters';
const props = withDefaults(defineProps<{
  spent: number;
  remaining: number;
  currency?: string;
  perMember?: PerMemberSpending[];
}>(), { currency: 'CNY', perMember: () => [] });
const activeTab = ref('overview');
const pieEl = ref<HTMLDivElement>();
const barEl = ref<HTMLDivElement>();
let pieChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;
function renderPie() {
  if (!pieEl.value) return;
  pieChart ||= echarts.init(pieEl.value);
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${formatCurrency(params.value, props.currency)}`,
    },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      label: {
        formatter: (params: any) => `${params.name}\n${formatCurrency(params.value, props.currency)}`,
      },
      data: [
        { name: '已计划', value: props.spent, itemStyle: { color: '#2d7a46' } },
        { name: '剩余', value: Math.max(0, props.remaining), itemStyle: { color: '#dbe7cf' } },
      ],
    }],
  });
}
function renderBar() {
  if (!barEl.value || !props.perMember.length) return;
  barChart ||= echarts.init(barEl.value);
  const data = props.perMember.map((item) => ({
    name: item.member.name,
    value: item.amount,
    itemStyle: { color: item.member.color },
  }));
  barChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        const p = params[0];
        return `${p.name}<br/>人均花费: ${formatCurrency(p.value, props.currency)}`;
      },
    },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: '#61706b' },
      axisLine: { lineStyle: { color: '#dbe7cf' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#61706b',
        formatter: (val: number) => formatCurrency(val, props.currency).replace(/\.00$/, ''),
      },
      splitLine: { lineStyle: { color: '#f0f4ec' } },
    },
    series: [{
      type: 'bar',
      barWidth: '40%',
      data,
      label: {
        show: true,
        position: 'top',
        formatter: (params: any) => formatCurrency(params.value, props.currency),
        fontSize: 11,
        color: '#1f2933',
      },
    }],
  });
}
function renderAll() {
  nextTick(() => {
    renderPie();
    renderBar();
  });
}
onMounted(renderAll);
watch(() => [props.spent, props.remaining, props.perMember, activeTab.value], () => renderAll(), { deep: true });
</script>
<style scoped>
.budget-chart-wrapper { display: flex; flex-direction: column; }
.bc-tabs { margin-bottom: 0; }
.budget-chart { width: 100%; height: 260px; }
.bc-empty { text-align: center; padding: 20px 0; }
</style>
