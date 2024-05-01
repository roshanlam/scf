<template>
  <div id="app" class="bg-white font-sans text-white">
    <div class="container mx-auto px-11 py-12">
      <header class="fixed top-0 inset-x-0 z-50 bg-white flex justify-between items-center py-4">
        <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer">
          <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
        </router-link>

        <nav class="flex items-center space-x-6">
          <router-link to="/enrolled-classes" class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Courses</router-link>
        </nav>
      </header>

      <main class="flex flex-col items-center justify-start pt-32 min-h-screen">
        <div class="search-bar">
          <input type="text" placeholder="Search Posts" v-model="searchQuery" @input="filterPosts">
        </div>

        <div class="main-container">
          <div class="posts-panel">
            <h2>All Posts</h2>
            <div class="post-list" ref="postList">
              <div v-for="post in filteredPosts" :key="post.id" class="post-item" :class="{ 'teacher-post': post.teacher_post }" @click="selectPost(post)">
                <h3>{{ post.title }}</h3>
                <p>{{ post.content }}</p>
              </div>
            </div>
          </div>

          <div class="content">
            <h2>Select Class</h2>
            <select v-model="selectedCourseId">
              <option value="">Select a course</option>
              <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">( {{ classItem.class_name }} )</option>
            </select>
            <ul v-if="enrolledClasses.length > 0">
              <li v-for="classItem in enrolledClasses" :key="classItem.id">( {{ classItem.class_name }} )</li>
            </ul>
            <p v-else>You are not enrolled in any classes yet.</p>

            <h2>Create a New Post</h2>
            <input type="text" placeholder="Title" v-model="newPostTitle">
            <textarea placeholder="Content" v-model="newPostContent"></textarea>
            <button @click="postToForum">Post to Forum</button>

            <div v-if="selectedPost">
              <h3>Selected Post</h3>
              <div class="post-item">
                <h3>{{ selectedPost.title }}</h3>
                <p>{{ selectedPost.content }}</p>
              </div>

              <div>
                <h3>Add Comment</h3>
                <input type="text" placeholder="Comment Title" v-model="commentName">
                <textarea placeholder="Comment Body" v-model="commentBody"></textarea>
                <button @click="sendComment">Send Comment</button>
              </div>
            </div>
          </div>
        </div>
      </main>
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
            newPostContent: '',
            selectedPost: null,
            commentName: '',
            commentBody: '',
            searchQuery: ''
        };
    },
    mounted() {
        this.fetchEnrolledClasses();
        if (this.selectedCourseId) {
            this.fetchPosts();
        }
    },
    computed: {
        filteredPosts() {
            if (!this.searchQuery) {
                return this.posts;
            }
            // Implement your own relevance sorting algorithm here
            const sortedPosts = this.posts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
            return sortedPosts;
        }
    },
    methods: {
        selectPost(post_id) {
            // Store the selected post in your component's data
            this.selectedPost = post_id;
            console.log(this.selectedPost)
        },
        async sendComment() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourseId;

                if (typeof classID === 'number') {
                    const response = await axios.post(`http://localhost:8000/post-comment-to-forum/`, {
                        sessionID,
                        classID,
                        title: this.commentName,
                        content: this.commentBody,
                        parentPostID: this.selectedPost.id,
                    });
                    console.log(this.newPostContent, this.newPostTitle, this.selectPost, classID);

                    console.log(response.data);

                    this.newPostTitle = '';
                    this.newPostContent = '';

                    this.fetchPosts();
                }
            } catch (error) {
                console.error("Failed to send forum post:", error);
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
        async fetchPosts() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourseId;
                console.log(classID, this.selectedCourseId);

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
<style>
  main {
    color: black;
  }

  .main-container {
    display: flex;
  }

  .posts-panel {
    width: 300px;
    /* Adjust width as needed */
    height: calc(100vh - 120px); /* Adjust height as needed */
    overflow-y: auto;
    /* Enable vertical scrolling */
    border-right: 1px solid #ccc;
    /* Add a border to separate from the content */
    padding: 20px;
    /* Add padding for spacing */
    flex: 0 0 auto; /* Don't allow the posts panel to grow or shrink */
  }

  .post-item {
    cursor: pointer;
    /* Change cursor to pointer on hover */
    margin-bottom: 20px;
    /* Add spacing between posts */
  }

  .content {
    flex: 1;
    /* Allow content to grow and occupy remaining space */
    padding: 20px;
    /* Add padding for spacing */
  }
</style>
