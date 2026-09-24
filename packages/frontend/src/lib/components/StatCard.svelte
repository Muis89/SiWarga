<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    title: string;
    value: number | string;
    description: string;
    icon: any;
    colorVariant?: 'emerald' | 'blue' | 'indigo' | 'amber';
  }

  let {
    title,
    value,
    description,
    icon: Icon,
    colorVariant = 'emerald'
  }: Props = $props();

  const colorStyles = {
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700'
    },
    blue: {
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400',
      border: 'hover:border-sky-300 dark:hover:border-sky-700'
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400',
      border: 'hover:border-indigo-300 dark:hover:border-indigo-700'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-700'
    }
  };

  const style = $derived(colorStyles[colorVariant] || colorStyles.emerald);
</script>

<div class="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all {style.border} dark:border-slate-800 dark:bg-slate-900">
  <div class="flex items-center justify-between">
    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
      {title}
    </span>
    <div class="flex h-10 w-10 items-center justify-center rounded-lg {style.iconBg}">
      <Icon class="h-5 w-5" />
    </div>
  </div>

  <div class="mt-3 flex items-baseline gap-2">
    <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
      {value}
    </div>
  </div>

  <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
    {description}
  </p>
</div>
