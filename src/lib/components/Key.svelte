<script lang="ts">
  import type { LetterState } from '$lib';

  let {
    letter,
    state,
    text = $bindable(),
    onclick,
    disabled = false
  }: {
    letter?: string;
    state?: LetterState;
    text: string;
    onclick?: () => void;
    disabled?: boolean;
  } = $props();
</script>

<button
  class={`
    m-0.5
    flex
    sm:m-1
    sm:h-16 ${onclick ? 'sm:w-22' : 'sm:w-14'}
    h-10 ${onclick ? 'w-14' : 'w-9'}
    items-center justify-center
    rounded-sm
    ${state ? state.color : 'bg-gray-400'}
    border-0!
  `}
  onclick={onclick ??
    (() => {
      if (text.length < 5) text += letter;
    })}
  {disabled}
>
  {letter?.toUpperCase()}
</button>
