import { ref, watchEffect } from 'vue';

export enum AnimationState {
    ONE = '1',
    ZERO = '0',
}
  

export function useAnimationState(defaultState: AnimationState, zeroToOneTransitionTime: number, oneToZeroTransitionTime: number) {
  const animationState = ref(defaultState);

  watchEffect((onInvalidate) => {
    let timeout: ReturnType<typeof setTimeout>;
    if (animationState.value === AnimationState.ONE) {
      timeout = setTimeout(() => {
        animationState.value = AnimationState.ZERO;
      }, oneToZeroTransitionTime);
    } else {
      timeout = setTimeout(() => {
        animationState.value = AnimationState.ONE;
      }, zeroToOneTransitionTime);
    }

    onInvalidate(() => clearTimeout(timeout));
  });

  return animationState;
}
