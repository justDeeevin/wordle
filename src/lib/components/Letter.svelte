<script lang="ts">
  import type { LetterState } from '$lib';
  const { letter, state }: { letter?: string; state?: LetterState } = $props();
</script>

<div
  class={`
    m-1
    flex
    h-16 w-16
    items-center justify-center
    border-2 border-gray-${letter ? '600' : '400'}
    ${state?.color}
  `}
>
  <p class="text-4xl">{letter?.toUpperCase()}</p>
</div>
