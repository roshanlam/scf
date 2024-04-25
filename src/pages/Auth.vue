<template>
  <div>
    <button @click="login">Login Using Google</button>
    <div v-if="userDetails">
      <p>Name: {{ userDetails.name }}</p>
      <p>Email: {{ userDetails.email }}</p>
    </div>
  </div>
  <div>
    <button @click="sign_out">Sign Out</button>
    <button @click="enrollInClass(1)">Enroll in Course</button>
    <button @click="postToForum(1, 'hello', 'yellow')">Post to forum</button>
    <button @click="getAllPosts(1)">Log all posts</button>
  </div>
</template>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";

export default {
  name: "YourComponent",
  data() {
    return {
      userDetails: null,
    };
  },
  mounted() {
    // Check if user details are stored in localStorage
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails);
    }
  },
  methods: {
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
    async enrollInClass(classID) {
      try {
        // Retrieve sessionID and classID from component's data
        const sessionID = localStorage.getItem('sessionID');
        const classID = 1;

        // Make a POST request to enroll in class endpoint with sessionID and classID
        const response = await axios.post(`http://localhost:8000/enroll-in-class/`, {
          sessionID,
          classID,
        });
        // Log the response from the backend
        console.log(response.data);

        // Optionally, you can perform additional actions after enrollment
      } catch (error) {
        console.error("Failed to enroll in class:", error);
      }
    },
    async postToForum(classID, title, content) {
      try {
        // Retrieve sessionID and classID from component's data
        const sessionID = localStorage.getItem('sessionID');

        // Make a POST request to the forum endpoint with sessionID, classID, title, and content
        const response = await axios.post(`http://localhost:8000/post-to-forum/`, {
          sessionID,
          classID,
          title,
          content
        });
        
        // Log the response from the backend
        console.log(response.data);

        // Optionally, you can perform additional actions after posting to the forum
      } catch (error) {
        console.error("Failed to send forum post:", error);
      }
    },
    async getAllPosts(classID) {
      try {
        // Retrieve sessionID and classID from component's data
        const sessionID = localStorage.getItem('sessionID');

        // Make a POST request to the forum endpoint with sessionID, classID, title, and content
        const response = await axios.post(`http://localhost:8000/get-all-posts/`, {
          sessionID,
          classID,
        });
        
        // Log the response from the backend
        console.log(response.data);

        // Optionally, you can perform additional actions after posting to the forum
      } catch (error) {
        console.error("Failed to send forum post:", error);
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
