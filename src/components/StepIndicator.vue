<script>
  export default {
    props: {
      className: {
        type: String,
        default: ''
      },
      number: {
        type: Number,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    },
    computed: {
      bubbleClasses() {
        return [
          'StepIndicator__bubble',
          ...this.getCustomClassNames('__bubble')
        ];
      }
    },
    methods: {
      getCustomClassNames(suffix) {
        if (!this.className) return [];
        return this.className.split(' ').map(className => `${className}${suffix}`);
      }
    }
  }
  </script>

<template>
  <div :class="['StepIndicator', className]">
    <div :class="bubbleClasses">
      {{ number }}
    </div>
    <div :class="['StepIndicator__text']">
      {{ text }}
    </div>
  </div>
</template>
  
  <style scoped>
  .StepIndicator {
      align-items: center;
      color: white;
      display: flex;
      font-size: 20px;
      font-weight: 800;
  }
  .StepIndicator__text {
        color: white;
  }
  .StepIndicator__bubble{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1ea672;
        border-radius: 18px;
        display: flex;
        flex-shrink: 0;
        height: 36px;
        justify-content: center;
        margin-right: 12px;
        width: 36px;
  }
  </style>
  