<template>
  <div class="home-steps flex justify-center items-center bg-blue-900 text-white">
    <div class="content-container flex flex-col md:flex-row justify-between items-center max-w-[1308px] p-[64px] space-y-12 md:space-y-0 md:space-x-12">
      <div v-for="step in steps" :key="step.id" class="step flex flex-col md:flex-row items-center md:space-x-4">
        <StepIndicator :number="step.id" :text="step.valueTitle" />
        <div class="instructional-text mt-2 md:mt-0 md:pl-12">
          {{ step.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepIndicator from '../components/StepIndicator.vue';

export default {
  components: {
    StepIndicator,
  },
  data() {
    return {
      steps: [
        { id: 1, valueTitle: "Sign up for Github", value: "Create a Github Account If you don't have one" },
        { id: 2, valueTitle: "Complete Tasks", value: "Complete Tasks and Earn Points" },
        { id: 3, valueTitle: "Earn Points", value: "Climb the Leaderboard and be a top developer" },
      ],
    };
  },
};
</script>

<style scoped>
.home-steps {
  background-color: #042235; /* Adjust the color to match your theme */
}

.content-container {
  padding: 64px;
}

.step {
  margin: 0 48px;
}

.instructional-text {
  color: #ffffff;
  margin-top: 8px;
  padding-left: 48px;
}

@media (max-width: 1080px) {
  .content-container {
    flex-direction: column;
    padding: 64px 0 24px;
  }

  .step {
    margin: 0 0 48px 0;
    max-width: 430px;
  }
}

@media (max-width: 480px) {
  .step {
    margin: 0 32px 32px;
  }
}
</style>
