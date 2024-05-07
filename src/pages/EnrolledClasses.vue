<template>
  <div id="app" class="bg-gray-100 font-sans">
    <div class="container mx-auto px-4 py-4">
      <header class="bg-white fixed top-0 inset-x-0 z-50 shadow flex justify-between items-center py-2 px-4">
        <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
          <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
        </router-link>
        <nav class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <i class="fas fa-user-circle text-xl text-gray-600"></i>
            <p v-if="userPoints !== null" class="text-lg font-semibold text-gray-600">{{ userPoints }} Points</p>
          </div>
          <select v-model="selectedCourseId" class="rounded border border-gray-300 text-gray-700 py-2 px-3">
            <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">{{ classItem.class_name }}</option>
          </select>
          <router-link to="/enrolled-classes" class="btn primary">Courses</router-link>
          <router-link to="/videos" class="btn primary">Videos</router-link>
        </nav>
      </header>
      <main class="pt-20">
        <div class="text-center my-5">
          <div class="toast-wrapper mb-9">
            <Toast v-if="showToast" :type="toastType" :message="toastMessage" />
          </div>
          <p class="text-xl">Enrolled Classes</p>
          <ul v-if="enrolledClasses.length" class="mt-3">
            <li v-for="classItem in enrolledClasses" :key="classItem.id" class="py-2">{{ classItem.class_name }}</li>
          </ul>
          <p v-else>You are not enrolled in any classes yet.</p>
        </div>
        <div class="flex justify-around flex-wrap">
          <section class="card">
            <h2>Create New Class</h2>
            <input v-model="newClassName" placeholder="Class Name" class="input">
            <input v-model="newClassCode" placeholder="Class Code" class="input">
            <button @click="createNewClass" class="btn primary mt-5">Create</button>
          </section>
          <section class="card">
            <h2>Enroll in a Class</h2>
            <input v-model="newCourseCode" placeholder="Course Code" class="input">
            <button @click="enrollInClass(newCourseCode)" class="btn secondary mt-5">Enroll</button>
          </section>
          <section class="card">
            <h2>Upload Video</h2>
            <input v-model="videoUrl" placeholder="YouTube URL" class="input">
            <input v-model="videoTitle" placeholder="Video Title" class="input">
            <button @click="uploadVideo" class="btn primary mt-5">Upload</button>
          </section>
        </div>
      </main>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Toast from '../components/Toast.vue';

export default {
  name: 'CombinedComponent',
  components: {
    Toast
  },
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
      toastMessage: '',
      showToast: false,
      toastType: ''
    };
  },
  mounted() {
    this.loadUserDetails();
    this.fetchEnrolledClasses();
  },
  methods: {
    displayToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      });
    },
    async loadUserDetails() {
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        this.userDetails = JSON.parse(storedUserDetails);
      }
    },
    async uploadVideo() {
      if (!this.videoUrl || !this.videoTitle) {
        this.displayToast('Video URL and title are required.', 'ERROR');
        return;
      }
      try {
        const sessionID = localStorage.getItem('sessionID');
        const classID = this.selectedCourseId;
        if (typeof classID === 'number') {
          const response = await axios.post(`http://localhost:8000/post-class-video/`, {
            sessionID,
            classID,
            videoURL: this.videoUrl,
            videoTitle: this.videoTitle
          });
          this.videoUrl = '';
          this.videoTitle = '';
          this.displayToast('Video uploaded successfully!', 'SUCCESS');
        }
      } catch (error) {
        this.displayToast('Failed to upload video.', 'ERROR');
      }
    },
    async fetchEnrolledClasses() {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post('http://localhost:8000/get-enrolled-classes/', { sessionID });
        this.enrolledClasses = response.data.enrolled_classes;
      } catch (error) {
        this.displayToast('Failed to fetch enrolled classes.', 'ERROR');
      }
    },
    async createNewClass() {
      if (!this.newClassName || !this.newClassCode) {
        this.displayToast('Both class name and class code are required.', 'ERROR');
        return;
      }
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post('http://localhost:8000/create-new-class/', {
            sessionID,
            class_name: this.newClassName,
            class_code: this.newClassCode,
        });
        if (response.data && response.data.message) {
            this.newClassName = '';
            this.newClassCode = '';
            this.fetchEnrolledClasses();
            this.displayToast('Class created successfully!', 'SUCCESS');
        }
      } catch (error) {
        this.displayToast('Failed to create class.', 'ERROR');
      }
    },
    async enrollInClass(classCode) {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post('http://localhost:8000/enroll-in-class/', { sessionID, classCode });
        this.newCourseCode = '';
        this.fetchEnrolledClasses();
        this.displayToast('Successfully enrolled in class!', 'SUCCESS');
      } catch (error) {
        this.displayToast('Failed to enroll in class.', 'ERROR');
      }
    }
  }
};
</script>



<style scoped>
input, select, textarea {
  background-color: white; /* White background for input fields */
  border: 1px solid #ccc; /* Subtle border for definition */
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem; /* Rounded corners for a softer look */
  width: 100%; /* Ensures full width in container context */
  box-sizing: border-box; /* Includes padding and border in the element's width */
}

input:focus, select:focus, textarea:focus {
  border-color: #FF4136; /* Highlight color when focused */
  outline: none; /* Removes default outline to use border color only */
}

.btn {
  background-color: #FF4136; /* Primary color for buttons */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #E33E2B; /* Darker shade for hover effect */
}

.post-item, .selected-post {
  background-color: white; /* White background for posts */
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc; /* Light border for separation */
  border-radius: 0.25rem;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.post-item:hover, .selected-post {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow on hover for depth */
}

/* Additional styles for layout and spacing */
.container {
  max-width: 960px;
  margin: auto;
  padding: 1rem;
}

header, main {
  padding: 1rem;
  text-align: center;
}

.nav {
  margin-bottom: 2rem;
}

.card {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-top: 2rem;
}

.toast-wrapper {

  z-index: 1000;
  
}
</style>

