<template>
    <div>
        <h2>Select Class</h2>

        <select v-model="selectedCourse">
            <option value="">Select a course</option>
            <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.class_id">
                ({{ classItem.class_id }})
            </option>
        </select>

        <ul v-if="enrolledClasses.length > 0">
            <li v-for="classItem in enrolledClasses" :key="classItem.id">
                ({{ classItem.class_id }})
            </li>
        </ul>
        <p v-else>You are not enrolled in any classes yet.</p>

        <h2>Create a New Post</h2>
        <input type="text" placeholder="Title" v-model="newPostTitle">
        <textarea placeholder="Content" v-model="newPostContent"></textarea>
        <button @click="postToForum">Post to Forum</button>

        <div v-if="posts.length > 0">
            <h2>All Posts</h2>
            <div class="post-list" ref="postList">
                <div v-for="post in posts" :key="post.id" class="post-item">
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.content }}</p>
                </div>
            </div>
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
            posts: [],
            selectedCourse: localStorage.getItem('selectedCourse') || '',
            newPostTitle: '',
            newPostContent: ''
        };
    },
    mounted() {
        this.fetchEnrolledClasses();
        if (this.selectedCourse) {
            this.fetchPosts(this.selectedCourse);
        }
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
        async fetchPosts(classID) {
            try {
                // Retrieve sessionID from localStorage
                const sessionID = localStorage.getItem('sessionID');

                // Make a POST request to the forum endpoint with sessionID and classID
                const response = await axios.post(`http://localhost:8000/get-all-posts/`, {
                    sessionID,
                    classID,
                });

                // Check the structure of the response from the backend
                console.log(response.data);

                // Assuming the response is an object containing an array of posts
                if (response.data && response.data.posts) {
                    this.posts = response.data.posts;
                } else {
                    console.error("Invalid response format from the backend");
                }
            } catch (error) {
                console.error("Failed to get all posts:", error);
            }
        },
        async postToForum() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourse; // Get selected course ID

                const response = await axios.post(`http://localhost:8000/post-to-forum/`, {
                    sessionID,
                    classID,
                    title: this.newPostTitle,
                    content: this.newPostContent
                });
                console.log(this.newPostContent, this.newPostTitle)

                console.log(response.data);

                // Clear the input fields
                this.newPostTitle = '';
                this.newPostContent = '';

                // Optionally, refetch posts to update the display:
                this.fetchPosts(classID);

            } catch (error) {
                console.error("Failed to send forum post:", error);
            }
        },
    },
    watch: {
        selectedCourse(newCourseId) {
            if (newCourseId) {
                this.fetchPosts(newCourseId);
                localStorage.setItem('selectedCourse', newCourseId); // Save selection to localStorage
            } else {
                localStorage.removeItem('selectedCourse'); // Clear on empty selection
            }
        }
    }
};
</script>