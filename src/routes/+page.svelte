<script lang="ts">
  import Letter from '$lib/components/Letter.svelte';
  import Key from '$lib/components/Key.svelte';

  import { answers, words } from '$lib/lists';
  import { random_index, LetterState } from '$lib';
  import { page } from '$app/state';

  const cheat = page.url.searchParams.has('cheat');

  let texts: string[] = $state(Array(6).fill(''));
  let current_row = $state(0);
  let end = $state(false);
  let index = $state(random_index());
  let show_answer = $state(false);
  let letters: { [key: string]: LetterState } = $state({});

  let text = $derived(texts[current_row].toLowerCase());
  let word = $derived(answers[index]);

  let input: HTMLInputElement;

  function letter_state(row: number, l: number): LetterState | undefined {
    const input = texts[row];
    const letter: string | undefined = input[l];

    if (!letter) return undefined;
    else if (letter === word[l]) return new LetterState('correct');
    else if (
      word.search(letter) !== -1 &&
      (input.split(letter).length - 1 === 1 || input.search(letter) === l)
    )
      return new LetterState('present');
    else return new LetterState('absent');
  }

  function new_game() {
    current_row = 0;
    texts = Array(6).fill('');
    end = false;
    index = random_index();
    letters = {};
    show_answer = false;
  }

  function submit() {
    if (!words.has(text)) {
      window.alert('Invalid word');
      return;
    } else if (text === word || current_row === 5) {
      end = true;
    } else if (text !== word && current_row === 5) {
      show_answer = true;
    }

    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      const state = letter_state(current_row, i) as LetterState;
      if (!letters[letter] || letters[letter] < state) {
        letters[letter] = state;
      }
    }

    current_row++;
  }
</script>

<svelte:window onkeydown={() => input.focus()} />

<input
  bind:value={texts[current_row]}
  maxlength={5}
  disabled={end}
  oninput={() => (texts[current_row] = text.replace(/[^a-zA-Z]/g, ''))}
  onkeydown={(e) => {
    if (e.key === 'Enter' && text.length === 5) submit();
  }}
  bind:this={input}
  class="fixed m-0 h-0 w-0"
/>

<div class="flex flex-col items-center justify-center">
  {#each Array(6) as _, row}
    <div class="flex flex-row">
      {#each Array(5) as _, l}
        <Letter
          letter={texts[row][l]}
          state={current_row > row ? letter_state(row, l) : undefined}
        />
      {/each}
    </div>
  {/each}

  {#if cheat}
    <button onclick={() => (show_answer = true)}>Show answer</button>
  {/if}
  {#if show_answer}
    <p class="text-lg">The word was {word.toUpperCase()}</p>
  {/if}

  <button onclick={new_game}>New game</button>

  <p class="text-center text-lg">Word is randomly selected on each new game</p>

  <div class="fixed bottom-0 flex w-full flex-col items-center justify-center">
    <div class="flex flex-row">
      {#each 'qwertyuiop' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[current_row]} disabled={end} />
      {/each}
    </div>
    <div class="flex flex-row">
      {#each 'asdfghjkl' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[current_row]} disabled={end} />
      {/each}
    </div>
    <div class="flex flex-row">
      <Key
        letter="⏎"
        onclick={() => {
          if (text.length === 5) submit();
        }}
        text=""
        disabled={end}
      />
      {#each 'zxcvbnm' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[current_row]} disabled={end} />
      {/each}
      <Key
        letter="⌫"
        onclick={() => {
          if (text.length > 0) texts[current_row] = text.slice(0, -1);
        }}
        text=""
        disabled={end}
      />
    </div>
  </div>
</div>
