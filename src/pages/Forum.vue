<template>
  <div id="app" class="font-sans">
    <div class="container mx-auto px-4 py-4">
      <header class="bg-white fixed top-0 inset-x-0 z-50 shadow-md">
        <div class="container flex justify-between items-center py-4 px-6 mx-auto">
          <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
            <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
          </router-link>
          <nav class="flex items-center space-x-4">
            <p v-if="userPoints !== null" class="text-lg font-semibold">
              {{ userPoints }} Points
            </p>
            <select v-model="selectedCourseId" class="p-2 rounded border border-gray-300 bg-white">
              <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">
                {{ classItem.class_name }}
              </option>
            </select>
            <router-link to="/enrolled-classes" class="btn">Courses</router-link>
            <router-link to="/videos" class="btn">Videos</router-link>
          </nav>
        </div>
      </header>
      <div class="text-center pt-24">
        <div class="inline-block w-full max-w-md p-4 bg-white rounded-lg shadow">
          <input type="text" placeholder="Search Posts" v-model="searchQuery" @input="filterPosts" class="p-2 w-full border rounded mb-4">
          <button class="btn mr-2" @click="showNewPostForm = true">Create New Post</button>
          <button class="btn" @click="updateUserPoints">Add Point</button>
        </div>
        <section class="mt-4">
          <h2 class="font-semibold text-lg mb-4">All Posts</h2>
          <div v-for="post in filteredPosts" :key="post.id" class="p-4 bg-white rounded-lg shadow my-2 cursor-pointer" @click="togglePostSelection(post)">
            <h3 class="font-bold">{{ post.title }}</h3>
            <p>{{ post.content }}</p>
          </div>
          <div v-if="selectedPost" class="bg-white rounded-lg shadow mt-4 p-4">
            <h3 class="font-bold">{{ selectedPost.title }}</h3>
            <p>{{ selectedPost.content }}</p>
            <div v-for="comment in selectedPostComments" :key="comment.id" class="mt-2 p-2 border-t">
              <h4 class="font-semibold">{{ comment.title }}</h4>
              <p>{{ comment.content }}</p>
            </div>
            <div class="mt-4">
              <input type="text" placeholder="Comment Title" v-model="commentName" class="p-2 w-full border rounded">
              <textarea placeholder="Comment Body" v-model="commentBody" class="p-2 w-full border rounded my-2"></textarea>
              <button class="btn" @click="sendComment">Send Comment</button>
            </div>
          </div>
        </section>
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
      newPostContent: '',
      selectedPost: null,
      selectedPostComments: [],
      commentName: '',
      commentBody: '',
      searchQuery: '',
      showNewPostForm: false,
      showSelectedPostDetails: false,
      userPoints: null

    };
  },
  mounted() {
    this.fetchEnrolledClasses();
    this.getUserPoints();
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
    togglePostSelection(post) {
      if (this.selectedPost === post) {
        this.selectedPost = null; // Deselect the post if already selected
      } else {
        this.selectedPost = post; // Select the post if not already selected
        this.selectPost(post)
        // Fetch comments or other actions if needed
      }
    },
    async getUserPoints() {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post('http://localhost:8000/get-user-points/', {
          sessionID: sessionID,
        });
        
        // Store user points in data property
        this.userPoints = response.data.points;
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    },
    async updateUserPoints() {
      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post('http://localhost:8000/update-user-points/', {
          sessionID: sessionID,
          pointsDelta: 1,
        });
        
        // Update user points after adding a point
        this.getUserPoints();
      } catch (error) {
        console.error('Error updating user points:', error);
      }
    },
    async selectPost(post) {
      this.selectedPost = post;

      try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await axios.post(`http://localhost:8000/get-post-comments/`, {
          sessionID,
          postID: post.id,
        });

        console.log(response.data);
        this.selectedPostComments = response.data.sub_posts;

        console.log(this.selectedPost, this.selectedPostComments.sub_posts);
      } catch (error) {
        console.error("Failed to fetch post and comments:", error);
      }
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
    console.log("Posting to forum with:", {
        sessionID: localStorage.getItem('sessionID'),
        classID: this.selectedCourseId || 0,
        title: this.newPostTitle || "No Title Provided",
        content: this.newPostContent || "No Content Provided"
    });

    if (!this.selectedCourseId) {
        alert("Please select a class ID.");
        return;
    }
    if (!this.newPostTitle || !this.newPostContent) {
        alert("Please complete all fields.");
        return;
    }

    try {
        const response = await axios.post(`http://localhost:8000/post-to-forum/`, {
            sessionID: localStorage.getItem('sessionID'),
            classID: this.selectedCourseId,
            title: this.newPostTitle,
            content: this.newPostContent
        });

        console.log("Response received:", response.data);
        // Additional code to handle the response
    } catch (error) {
        console.error("Failed to send forum post:", error);
    }
}

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
  },

};
</script>

<style>
body {
  background-color: #f9fafb; 
  color: #1f2937;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.btn {
  background-color: #FF4136;
  color: white;
  padding: 8px 16px;
  border-radius: 8px; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #E33E2B;
}

header {
  background-color: white; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

main {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

input[type="text"], textarea {
  background-color: white;
  border: 1px solid #ccc;
  color: #1f2937;
  padding: 8px 12px;
  border-radius: 4px;
  width: 100%;
}

input[type="text"]:focus, textarea:focus {
  border-color: #FF4136;
  outline: none;
}

.posts-panel, .content {
  background-color: white; 
  margin: 1rem;
  flex-basis: calc(50% - 2rem); /* Half width minus margin */
  max-width: calc(50% - 2rem); /* Prevents growth beyond calc size */
}

.post-item:hover, .selected-post {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .posts-panel, .content {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>