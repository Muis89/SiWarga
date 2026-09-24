<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    // Default to light (white mode) unless user explicitly chose 'dark'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  });
</script>

<svelte:head>
  <title>Sistem Dashboard Pengelolaan Data Warga</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
  {@render children()}
</div>
