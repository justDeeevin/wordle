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
    m-0.5
    flex
    sm:m-1
    sm:h-16 ${onclick ? 'sm:w-22' : 'sm:w-14'}
    h-8 ${onclick ? 'w-11' : 'w-7'}
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
