<template>
  <div>
    <h2>Enrolled Classes</h2>
    <ul v-if="enrolledClasses.length > 0">
      <li v-for="classItem in enrolledClasses" :key="classItem.id">
        ({{ classItem.class_id }})
      </li>
    </ul>
    <p v-else>You are not enrolled in any classes yet.</p>

    <div>
      <label for="courseNumber">Course Number:</label>
      <input type="text" id="courseNumber" v-model="newCourseNumber" />
      <button @click="enrollInClass(newCourseNumber)">Enroll</button>
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
    async enrollInClass(courseNumber) {
      try {
        const sessionID = localStorage.getItem('sessionID');

        const response = await axios.post('http://localhost:8000/enroll-in-class/', {
          sessionID,
          courseNumber,
        });

        console.log(response.data.message);
        this.newCourseNumber = '';
        this.fetchEnrolledClasses();
      } catch (error) {
        console.error('Failed to enroll in class:', error);
      }
    },
  },
};
</script>