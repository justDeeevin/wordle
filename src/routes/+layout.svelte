<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Wordle</title>
</svelte:head>

{@render children()}
