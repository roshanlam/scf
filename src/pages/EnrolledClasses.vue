<template>
  <div id="app" class="bg-white font-sans text-white">
    <div class="container mx-auto px-11 py-12">
      <header class="fixed top-0 inset-x-0 z-50 bg-white flex justify-between items-center py-4">
        <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
          <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
        </router-link>

        <nav class="flex items-center space-x-6">
          <select v-model="selectedCourseId" :placeholder="'Select course'">
            <p v-if="userPoints !== null" class="text-lg font-semibold text-gray-600">{{ userPoints }} Points</p>
            <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">( {{
              classItem.class_name }} )</option>
          </select>
          <router-link to="/videos"
            class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Videos</router-link>
          <router-link to="/forum"
            class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Forum</router-link>
        </nav>
      </header>

      <main class="flex flex-col items-center justify-start pt-32 min-h-screen">
        <p class="text-xl max-w-lg text-center mx-auto enrolled-classes-text">Enrolled Classes</p>
        <ul v-if="enrolledClasses.length > 0" class="enrolled-list">
          <li v-for="classItem in enrolledClasses" :key="classItem.id" class="enrolled-item">
            ({{ classItem.class_name }})
          </li>
        </ul>
        <p class="text-xl max-w-lg text-center mx-auto enrolled-classes-text" v-else>You are not enrolled in any classes
          yet.</p>

        <div>
          <label class="text-xl max-w-lg text-center mx-auto enrolled-classes-text" for="className">Class Name:</label>
          <input type="text" id="className" v-model="newClassName" />
        </div>
        <div>
          <label class="text-xl max-w-lg text-center mx-auto enrolled-classes-text" for="classId">Class Code:</label>
          <input type="text" id="classId" v-model="newClassCode" />
        </div>
        <button @click="createNewClass">Create New Class</button>

        <div>
          <label class="text-xl max-w-lg text-center mx-auto enrolled-classes-text" for="courseNumber">Course
            Code:</label>
          <input type="text" id="newClassCode" v-model="newCourseCode" />
          <button @click="enrollInClass(newCourseCode)">Enroll</button>
        </div>

        <div class="upload-video">
          <h2>Upload Video</h2>
          <div>
            <input type="text" placeholder="YouTube URL" v-model="videoUrl">
          </div>
          <div>
            <input type="text" placeholder="Video Title" v-model="videoTitle">
          </div>
          <button @click="uploadVideo">Upload Video</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CombinedComponent',
  data() {
    return {
      userDetails: null,
      enrolledClasses: [],
      newCourseNumber: '',
      newClassCode: '',
      newClassName: "",
      newCourseCode: '',
      videoUrl: '',
      videoTitle: '',
      selectedCourseId: isNaN(Number(localStorage.getItem('selectedCourse'))) ? null : Number(localStorage.getItem('selectedCourse')),
    };
  },
  mounted() {
    this.loadUserDetails();
    this.fetchEnrolledClasses();
  },
  methods: {
    async loadUserDetails() {
      // Check if user details are stored in localStorage
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        this.userDetails = JSON.parse(storedUserDetails);
      }
    },
    async uploadVideo() {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const classID = this.selectedCourseId; // Assuming you have a selectedCourseId property
        
        if (typeof classID === 'number') {
          const response = await axios.post(`http://localhost:8000/post-class-video/`, {
            sessionID,
            classID,
            videoURL: this.videoUrl,
            videoTitle: this.videoTitle
          });
          console.log(response.data);

          // Clear input fields after upload
          this.videoUrl = '';
          this.videoTitle = '';
        }
      } catch (error) {
        console.error("Failed to upload video:", error);
      }
    },
    async fetchEnrolledClasses() {
      try {
        const sessionID = localStorage.getItem('sessionID');

        const response = await axios.post('http://localhost:8000/get-enrolled-classes/', {
          sessionID,
        });

        this.enrolledClasses = response.data.enrolled_classes;
        console.log(response.data.enrolled_classes);
      } catch (error) {
        console.error('Failed to fetch enrolled classes:', error);
      }
    },
    async getUserPoints() {
        try {
            const sessionID = localStorage.getItem('sessionID');
            const response = await axios.post('http://localhost:8000/get-user-points/', { sessionID });
            this.userPoints = response.data.points;
        } catch (error) {
            console.error('Error fetching user points:', error);
        }
    },
    async createNewClass() {
      try {
        const sessionID = localStorage.getItem('sessionID');

        const response = await axios.post('http://localhost:8000/create-new-class/', {
          sessionID,
          class_name: this.newClassName,
          class_code: this.newClassCode,
        });

        console.log(response.data.message);
        this.fetchEnrolledClasses();
      } catch (error) {
        console.error('Failed to create new class:', error);
      }
    },
    async enrollInClass(classCode) {
      try {
        const sessionID = localStorage.getItem('sessionID');

        const response = await axios.post('http://localhost:8000/enroll-in-class/', {
          sessionID,
          classCode,
        });

        console.log(response.data.message);
        this.newCourseCode = '';
        this.fetchEnrolledClasses();
      } catch (error) {
        console.error('Failed to enroll in class:', error);
      }
    },
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: "782259591806-dh78pai5geh3kjpusv1ins5v988ogbkc.apps.googleusercontent.com",
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
        // Remove user details from local storage
        localStorage.removeItem('userDetails');
        localStorage.removeItem('sessionID');
        // Redirect to the login page ("/login")
        //this.$router.push("/login");
      } catch (error) {
        console.error("Failed to sign out:", error);
      }
    }
  },
};
</script>

<style scoped>
.enrolled-list {
  color: black;
  /* Set the text color to black */
  /* Add any other styles as needed */
}

.enrolled-classes-text {
  color: black;
}
.upload-video {
  margin-top: 20px;
}
.upload-video input {
  width: 100%;
  margin-bottom: 10px;
}
.upload-video button {
  background-color: #FF4136;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
.upload-video button:hover {
  background-color: #FF6347;
}
</style>