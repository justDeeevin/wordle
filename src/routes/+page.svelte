<script lang="ts">
  import Letter from '$lib/components/Letter.svelte';
  import Key from '$lib/components/Key.svelte';

  import { answers, words } from '$lib/lists';
  import { random_index, LetterState } from '$lib';
  import { page } from '$app/state';

  const cheat = page.url.searchParams.has('cheat');

  let texts: string[] = $state(Array(6).fill(''));
  let states: LetterState[][] = $state(Array.from({ length: 6 }, () => []));
  let current_row = $state(0);
  let end = $state(false);
  let index = $state(random_index());
  let show_answer = $state(false);

  const text = $derived(texts[current_row].toLowerCase());
  const word = $derived(answers[index]);
  const win = $derived(end && texts[current_row - 1] === word);
  const letters = $derived(
    states.flat().reduce((set: { [letter: string]: LetterState | undefined }, state, i) => {
      const letter = texts.map((t) => [...t]).flat()[i];

      if (!set[letter] || set[letter] < state) set[letter] = state;

      return set;
    }, {})
  );

  let input: HTMLInputElement;

  function new_game() {
    current_row = 0;
    texts = Array(6).fill('');
    end = false;
    index = random_index();
    show_answer = false;
    states = [[]];
  }

  function submit() {
    if (!words.has(text)) {
      window.alert('Invalid word');
      return;
    } else if (text === word || current_row === 5) {
      end = true;
    }

    if (text !== word && current_row === 5) {
      show_answer = true;
    }

    let temp = [...text].map((letter, i) => {
      if (letter === word[i]) return new LetterState('correct');
      else if (word.search(letter) !== -1) return new LetterState('present');
      else return new LetterState('absent');
    });

    for (const i_str in temp) {
      const i = i_str as unknown as number;
      const s = temp[i];
      if (
        s.toString() === new LetterState('present').toString() &&
        temp.filter((check, check_i) => check_i !== i && text[check_i] === text[i] && check >= s)
          .length >
          word.split(text[i]).length - 1
      ) {
        temp[i] = new LetterState('absent');
      }
    }

    states[current_row] = temp;

    current_row++;
  }

  function emojis(): string {
    return texts
      .map((t, r) => [...t].map((_, c) => states[r][c].emoji).join(''))
      .join('\n')
      .trim();
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
        <Letter letter={texts[row][l]} state={current_row > row ? states[row][l] : undefined} />
      {/each}
    </div>
  {/each}

  {#if cheat}
    <button onclick={() => (show_answer = true)}>Show answer</button>
  {/if}
  {#if show_answer || (end && !win)}
    <p class="text-lg">The word was {word.toUpperCase()}</p>
  {/if}

  <button onclick={new_game}>New game</button>

  <p class="text-center text-lg">Word is randomly selected on each new game</p>

  {#if win}
    <p class="m-2 text-xl">Congrats!</p>
    <button onclick={() => navigator.clipboard.writeText(emojis())}
      >Share (copies to clipboard)</button
    >
  {/if}

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
