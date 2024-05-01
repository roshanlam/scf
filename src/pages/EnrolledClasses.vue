<template>
  <div>
    <h2>Enrolled Classes</h2>
    <ul v-if="enrolledClasses.length > 0">
      <li v-for="classItem in enrolledClasses" :key="classItem.id">
        ({{ classItem.class_name }})
      </li>
    </ul>
    <p v-else>You are not enrolled in any classes yet.</p>

    <div>
      <label for="className">Class Name:</label>
      <input type="text" id="className" v-model="newClassName" />
    </div>
    <div>
      <label for="classId">Class Code:</label>
      <input type="text" id="classId" v-model="newClassCode" />
    </div>
    <button @click="createNewClass">Create New Class</button>

    <div>
      <label for="courseNumber">Course Code:</label>
      <input type="text" id="newClassCode" v-model="newCourseCode" />
      <button @click="enrollInClass(newCourseCode)">Enroll</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EnrolledClasses',
  data() {
  return {
    enrolledClasses: [],
    newCourseNumber: '',
    newClassCode: '', // Change to an empty string to match input type
    newClassName: "",
    newCourseCode: '' // Define newCourseCode here
  };
},

  mounted() {
    this.fetchEnrolledClasses();
  },
  methods: {
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
  },
};
</script>