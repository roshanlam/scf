<script>
import VideoPlayer from '../components/VideoPlayer.vue';
export default {
  name: 'Index',
  components: {
    VideoPlayer
  }
};
</script>

<template>
  <div id="app" class="bg-white font-sans text-white">
    <div class="container mx-auto px-11 py-12">
      <header class="fixed top-0 inset-x-0 z-50 bg-white flex justify-between items-center py-4">
        <h1 class="text-3xl font-bold text-[#FF4136]">Socio<span style="color: #2A3945">Coders</span></h1>
        <nav class="flex items-center space-x-6">
          <a href="/enrolled-classes" class="text-lg" style="color: #FF4136">Courses</a>
          <a href="/forum" class="text-lg" style="color: #FF4136">Forum</a>
          <a href="/auth"
            class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">SignIn/SignUp</a>
        </nav>
      </header>


      <main class="flex flex-col items-center justify-start pt-32 min-h-screen">
        <h2 class="text-5xl font-bold mb-4 flex flex-col md:flex-row justify-center space-x-0 md:space-x-4">
          <p class="mb-4 md:mb-0"><span style="color: #2A3945">Courses</span></p>
          <p class="mb-4 md:mb-0"><span style="color: #2A3945">Forum</span></p>
          <p class="mb-4 md:mb-0"><span style="color: #FF4136;">Create</span></p>
          <p class="mb-4 md:mb-0"><span style="color: #2A3945">Empower</span></p>
        </h2>
        <p class="text-xl max-w-lg text-center mx-auto">
          Learn the technology to create what you want for the common good and empower
        </p>
        <div class="app-container">
          <VideoPlayer youtubeVideoId="DaxcmbWcdTA" videoSource="https://www.youtube.com/watch?v=DaxcmbWcdTA" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
}

#app {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

button,
a {
  outline: none;
  cursor: pointer;
}

p {
  color: #35452a;
}

button:hover,
a:hover {
  text-decoration: none;
}

.nav a {
  transition: color 0.3s ease;
}

.nav a:hover {
  color: #FF4136;
}
</style>
