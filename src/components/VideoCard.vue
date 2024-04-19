<template>
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="md:flex">
        <div class="p-8">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Video Title</div>
          <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Watch our video</a>
          <p class="mt-2 text-gray-500">This video provides you with detailed information about our latest project...</p>
          <button @click="openModal" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Watch Video
          </button>
        </div>
      </div>
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click.self="closeModal">
          <div class="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <VideoPlayer :videoSource="videoSource" :youtubeVideoId="youtubeVideoId" />
            <button @click="closeModal" class="absolute top-0 right-0 cursor-pointer p-2 text-3xl leading-none font-semibold text-black">&times;</button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import VideoPlayer from './VideoPlayer.vue';
  
  export default {
    components: {
      VideoPlayer
    },
    props: {
      videoSource: String,
      youtubeVideoId: String
    },
    data() {
      return {
        showModal: false
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  