<script>
import VideoPlayer from '../components/VideoPlayer.vue';
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

export default {
  name: 'Index',
  components: {
    VideoPlayer
  },
  data() {
    return {
      userDetails: null,
    };
  },
  mounted() {
    // Load user details when the component is mounted
    this.loadUserDetails();
  },
  methods: {
    async loadUserDetails() {
      // Check if user details are stored in localStorage
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        this.userDetails = JSON.parse(storedUserDetails);
      }
    },
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "782259591806-dh78pai5geh3kjpusv1ins5v988ogbkc.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "http://localhost:5173",
            callback: response => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            }
          })
          .requestCode();
      });
    },
    async sendCodeToBackend(code) {
      try {
        const headers = {
          Authorization: code
        };
        const response = await axios.post("http://localhost:8000/auth-receiver", null, { headers });
        const userDetails = response.data;
        console.log(userDetails.session_key)
        console.log("User Details:", userDetails.user_data.name);
        this.userDetails = userDetails.user_data;
        this.sessionID = userDetails.session_key;

        // Save user details to localStorage
        localStorage.setItem('userDetails', JSON.stringify(userDetails.user_data));
        localStorage.setItem('sessionID', userDetails.session_key);

        // Redirect to the homepage ("/")
        //this.$router.push("/");
      } catch (error) {
        console.error("Failed to send authorization code:", error);
      }
    },
    async sign_out() {
      try {
        // Retrieve session ID from local storage
        const sessionID = localStorage.getItem('sessionID');

        // If session ID is not available, return
        if (!sessionID) {
          console.error("Session ID not found.");
          return;
        }

        // Call sign-out endpoint with session ID included in the URL
        const response = await axios.get(`http://localhost:8000/sign-out/${sessionID}/`);
        console.log(response.data);
        console.log("User Details:", sessionID);

        // Clear user details and session ID from local storage
        localStorage.removeItem('userDetails');
        localStorage.removeItem('sessionID');

        // Reset userDetails and sessionID in the component
        this.userDetails = null;
        this.sessionID = null;

        // Optionally, perform additional cleanup or navigation
        // For example, you can redirect the user to the sign-in page
        // this.$router.push("/sign-in");
      } catch (error) {
        console.error("Failed to sign out:", error);
      }
    },
  }
};
</script>

<template>
  <div id="app" class="bg-white font-sans text-white">
    <div class="container mx-auto px-11 py-12">
      <header class="fixed top-0 inset-x-0 z-50 bg-white flex justify-between items-center py-4">
        <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
          <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
        </router-link>
       
        <nav class="flex items-center space-x-6">
          <router-link to="/enrolled-classes"
            class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Courses</router-link>
          <router-link to="/forum"
            class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Forum</router-link>
          <button v-if="!userDetails" @click="login" class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Login Using Google</button>
          <button v-if="userDetails" @click="sign_out" class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Sign Out</button>
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
        <div v-if="userDetails">
          <p class="text-lg">Hi, {{ userDetails.name }}</p>
        </div>
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
