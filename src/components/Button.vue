<script>
  export default {
    props: {
      buttonType: {
        type: String,
        default: 'button', // This can be 'button', 'submit', or 'reset'
      },
      variant: {
        type: String,
        default: 'primary', // Default variant, can be changed to support different styles
      }
    },
    computed: {
      buttonClass() {
        switch (this.variant) {
          case 'primary':
            return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
          case 'secondary':
            return 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded';
          case 'danger':
            return 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
          default:
            return 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
        }
      }
    },
    methods: {
      clickHandler(event) {
        // Emit the click event to the parent component
        this.$emit('click', event);
      }
    }
  }
  </script>

<template>
    <button
      :type="buttonType"
      :class="buttonClass"
      @click="clickHandler"
    >
      <slot></slot>
    </button>
  </template>
  