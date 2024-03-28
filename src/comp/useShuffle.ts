import { ref, watch } from 'vue';

interface Entries {
  [key: string]: string;
}

function simpleShuffle<T>(array: T[]): T[] {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap
  }
  return shuffledArray;
}

export function useShuffle(defaultEntry: string, entries: Entries, keys: string[], shouldShuffle: boolean) {
  const entry = ref(defaultEntry);

  watch(() => shouldShuffle, (newVal) => {
    if (newVal) {
      const shuffledKeys = simpleShuffle(keys);
      const key = shuffledKeys[0]; // Simplified for right now; need to implement indexing logic as needed
      entry.value = entries[key];
    }
  });

  return entry;
}
