<script lang="ts">
  import Letter from '$lib/components/Letter.svelte';
  import { answers, words } from '$lib/lists';
  import { random_index, LetterState } from '$lib';
  import Key from '$lib/components/Key.svelte';

  let texts = $state(Array.from({ length: 6 }, () => ''));
  let row = $state(0);
  let text = $derived(texts[row].toLowerCase());
  let input: HTMLInputElement;
  let end = $state(false);
  let index = $state(random_index());
  let word = $derived(answers[index]);
  let show_answer = $state(false);
  let letters: { [key: string]: LetterState } = $state({});

  function letter_state(row: number, l: number): LetterState | undefined {
    const input = texts[row];
    const letter = input[l];
    if (!letter) {
      return undefined;
    }
    if (letter === word[l]) return new LetterState('correct');
    else if (
      word.search(letter) !== -1 &&
      (input.split(letter).length - 1 === 1 || input.search(letter) == l)
    )
      return new LetterState('present');
    else return new LetterState('absent');
  }

  function new_game() {
    row = 0;
    texts = Array.from({ length: 6 }, () => '');
    end = false;
    index = random_index();
    letters = {};
  }

  function submit() {
    console.log('submitted');
    if (!words.has(text)) {
      window.alert('Invalid word');
      return;
    }
    if (text === word) {
      end = true;
    }
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      if (!letters[letter]) {
        letters[letter] = letter_state(row, i) as LetterState;
      }
    }
    row++;
  }
</script>

<svelte:window onkeydown={() => input.focus()} />

<input
  bind:value={texts[row]}
  maxlength="5"
  disabled={end}
  oninput={() => (texts[row] = text.replace(/[^a-zA-Z]/g, ''))}
  onkeydown={(e) => {
    if (e.key === 'Enter' && text.length === 5) submit();
  }}
  bind:this={input}
  class="fixed m-0 h-0 w-0"
/>

<div class="flex flex-col items-center justify-center">
  <div class="flex flex-col">
    {#each Array(6) as _, this_row}
      <div class="flex flex-row">
        {#each Array(5) as _, l}
          <Letter
            letter={texts[this_row][l]}
            state={row > this_row ? letter_state(this_row, l) : undefined}
          />
        {/each}
      </div>
    {/each}
  </div>

  <div class="mx-1">
    <input type="checkbox" bind:checked={show_answer} id="show_answer" class="cursor-pointer" />
    <label for="show_answer" class="cursor-pointer">Show Answer</label>
    {#if show_answer}
      <p>{word}</p>
    {:else}
      <br />
    {/if}
    <button onclick={new_game}>New game</button>
  </div>

  <div class="fixed bottom-0 flex w-full flex-col items-center justify-center">
    <div class="flex flex-row">
      {#each 'qwertyuiop' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[row]} />
      {/each}
    </div>
    <div class="flex flex-row">
      {#each 'asdfghjkl' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[row]} />
      {/each}
    </div>
    <div class="flex flex-row">
      <Key
        letter="enter"
        onclick={() => {
          if (text.length === 5) submit();
        }}
        text=""
      />
      {#each 'zxcvbnm' as letter}
        <Key {letter} state={letters[letter]} bind:text={texts[row]} />
      {/each}
      <Key
        letter="BKSPC"
        onclick={() => {
          if (text.length > 0) texts[row] = text.slice(0, -1);
        }}
        text=""
      />
    </div>
  </div>
</div>
