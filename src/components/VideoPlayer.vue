<script>
export default {
  name: 'VideoPlayer',
  props: {
    videoSource: String,
    youtubeVideoId: String
  },
  data() {
    return {
      isYouTube: false,
      isPlaying: false,
      duration: 0,
      currentTime: 0
    };
  },
  computed: {
    youtubeEmbedUrl() {
      return `https://www.youtube.com/embed/${this.youtubeVideoId}`;
    }
  },
  methods: {
    initCustomControls() {
      this.duration = this.$refs.videoPlayer.duration;
    },
    togglePlay() {
      const video = this.$refs.videoPlayer;
      if (video.paused) {
        this.isPlaying = true;
        video.play();
      } else {
        this.isPlaying = false;
        video.pause();
      }
    },
    seek(event) {
      const video = this.$refs.videoPlayer;
      video.currentTime = event.target.value;
    },
    updateTime() {
      this.currentTime = this.$refs.videoPlayer.currentTime;
    }
  },
  watch: {
    videoSource(newVal) {
      this.isYouTube = newVal.includes("youtube.com") || newVal.includes("youtu.be");
    }
  },
  mounted() {
    this.isYouTube = this.videoSource.includes("youtube.com") || this.videoSource.includes("youtu.be");
  }
};
</script>

<template>
    <div class="video-player relative bg-black overflow-hidden rounded-lg shadow-lg max-w-full mx-auto">
      <video 
        ref="videoPlayer" 
        class="w-full video-js" 
        :controls="!isYouTube" 
        :src="!isYouTube ? videoSource : null" 
        v-if="!isYouTube" 
        @loadedmetadata="initCustomControls" 
        @timeupdate="updateTime">
      </video>
      <iframe 
        v-if="isYouTube" 
        :src="youtubeEmbedUrl" 
        class="w-full aspect-video" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
      <div v-if="!isYouTube" class="controls absolute bottom-0 w-full flex items-center px-4 py-2 bg-opacity-80 bg-gray-900">
        <button @click="togglePlay" class="play-pause-button focus:outline-none">
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.504 3.752m6.504-3.752V7.328m0 3.84l6.504-3.752m-6.504 3.752l6.504 3.752" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l-6 4 6 4V10z" />
          </svg>
        </button>
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="mx-4 flex-grow range range-primary" />
      </div>
    </div>
  </template>

  
  <style scoped>
  .controls {
    background-color: rgba(31, 41, 55, 0.8);
  }
  
  .play-pause-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }
  
  .range {
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    background: #4B5563;
    border-radius: 1px;
  }
  
  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #10B981;
    cursor: pointer;
  }
  
  .range::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #10B981;
    cursor: pointer;
  }
  

  .video-player {
  max-width: 640px; /* You can adjust this to fit your design */
}

/* The control bar at the bottom of the video player */
.controls {
  transition: background-color 0.3s;
}

/* The play/pause button within the control bar */
.play-pause-button svg {
  transition: transform 0.1s ease-in-out;
}

/* Styling for the video progress bar (slider) */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #374151; /* Tailwind color gray-700 */
  border-radius: 2px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10B981; /* Tailwind color green-500 */
  cursor: pointer;
}

.slider:focus {
  outline: none;
}

.slider:active::-webkit-slider-thumb {
  background: #059669; /* Tailwind color green-600 */
}
  </style>
  