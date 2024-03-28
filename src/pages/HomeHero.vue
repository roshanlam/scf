<template>
  <div class="flex justify-center items-center relative pt-8">
    <div class="flex items-center max-w-[calc(480px+50px+714px+64px)]">
      <div class="flex justify-center items-center mr-12 pl-16">
        <div>
          <h1 class="text-6xl font-bold">SocioCoders</h1>
          <span :class="helloClass">
            {{ helloText }}
          </span>
          <h2 class="mt-8 text-base font-normal">
            Learn to code, collaborate on projects, gain experience, 
            build a community, and help make an impact on the world.
          </h2>
        </div>
      </div>
      <div class="relative">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { AnimationState, useAnimationState, useShuffle } from '../comp'; // Assumes these are adapted for Vue
import hello, { defaultHello, HelloKeys } from './hello';

export default {
  setup() {
    const animationState = useAnimationState(AnimationState.ONE, 1000, 4000);
    const shouldShuffle = ref(false);
    const helloText = useShuffle(defaultHello, hello, HelloKeys, shouldShuffle.value);
    
    watch(animationState, (newValue) => {
      shouldShuffle.value = newValue === AnimationState.ZERO;
    });

    const helloClass = computed(() => {
      return [
        animationState.value === AnimationState.ONE ? 'fadeIn' : 'fadeOut',
        'block mb-[-20px]'
      ];
    });

    return {
      helloText,
      helloClass
    };
  }
}
</script>
