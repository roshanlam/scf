<template>
    <div>
        <h2>Select Class</h2>

        <select v-model="selectedCourseId">
            <option value="">Select a course</option>
            <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">
                ({{ classItem.class_name }})
            </option>
        </select>

        <ul v-if="enrolledClasses.length > 0">
            <li v-for="classItem in enrolledClasses" :key="classItem.id">
                ({{ classItem.class_name }})
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
            selectedCourseId: isNaN(Number(localStorage.getItem('selectedCourse'))) ? null : Number(localStorage.getItem('selectedCourse')),
            newPostTitle: '',
            newPostContent: ''
        };
    },
    mounted() {
        this.fetchEnrolledClasses();
        if (this.selectedCourseId) {
            this.fetchPosts();
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
        async fetchPosts() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourseId;
                console.log(classID, this.selectedCourseId); // Add this line for debugging

                if (typeof classID === 'number') {
                    const response = await axios.post(`http://localhost:8000/get-all-posts/`, {
                        sessionID,
                        classID,
                    });

                    console.log(response.data);

                    if (response.data && response.data.posts) {
                        this.posts = response.data.posts;
                    } else {
                        console.error("Invalid response format from the backend");
                    }
                }
            } catch (error) {
                console.error("Failed to get all posts:", error);
            }
        },

        async postToForum() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourseId;

                if (typeof classID === 'number') {
                    const response = await axios.post(`http://localhost:8000/post-to-forum/`, {
                        sessionID,
                        classID,
                        title: this.newPostTitle,
                        content: this.newPostContent
                    });
                    console.log(this.newPostContent, this.newPostTitle);

                    console.log(response.data);

                    this.newPostTitle = '';
                    this.newPostContent = '';

                    this.fetchPosts();
                }
            } catch (error) {
                console.error("Failed to send forum post:", error);
            }
        },
    },
    watch: {
    selectedCourseId(newCourseId) {
        console.log('Selected course changed to:', newCourseId);
        if (newCourseId !== null) {
            this.fetchPosts(newCourseId);
            localStorage.setItem('selectedCourse', String(newCourseId));
        } else {
            localStorage.removeItem('selectedCourse');
        }
    }
}
};
</script>