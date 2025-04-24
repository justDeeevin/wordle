import { answers } from './lists';

type LetterStateInner = 'absent' | 'present' | 'correct';
export class LetterState {
  state: LetterStateInner;

  constructor(state: LetterStateInner) {
    this.state = state;
  }

  get color() {
    switch (this.state) {
      case 'absent':
        return 'bg-gray-500';
      case 'present':
        return 'bg-yellow-300';
      case 'correct':
        return 'bg-green-400';
    }
  }

  toString() {
    return this.state;
  }
}

export function random_index() {
  return Math.floor(Math.random() * answers.length);
}
