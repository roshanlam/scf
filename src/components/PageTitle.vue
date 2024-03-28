<template>
</template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    mounted() {
      this.previousTitle = document.title;
      document.title = `${this.title} | SocioCoders`;
    },
    beforeUnmount() {
      document.title = this.previousTitle;
    },
    data() {
      return {
        previousTitle: ''
      };
    }
  }
  </script>
  