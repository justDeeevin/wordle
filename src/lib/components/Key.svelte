<script lang="ts">
  import type { LetterState } from '$lib';

  let {
    letter,
    state,
    text = $bindable(),
    onclick
  }: { letter?: string; state?: LetterState; text: string; onclick?: () => void } = $props();
</script>

<button
  class={`
    m-1
    flex
    h-16 ${onclick ? 'w-22' : 'w-14'}
    items-center justify-center
    rounded-sm
    ${state ? state.color : 'bg-gray-400'}
    border-0!
  `}
  onclick={onclick ??
    (() => {
      if (text.length < 5) text += letter;
    })}
>
  {letter?.toUpperCase()}
</button>
