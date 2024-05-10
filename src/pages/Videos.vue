<template>
    <div id="app" class="bg-white font-sans">
      <div class="container mx-auto px-4 py-4">
        <header class="bg-white fixed top-0 inset-x-0 z-50 shadow-md py-4 px-6 flex justify-between items-center">
        <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
          <span class="text-[#FF4136] font-bold">Socio</span><span class="text-[#2A3945] font-bold">Coders</span>
        </router-link>          <nav class="flex items-center space-x-4">
            <select v-model="selectedCourseId" class="rounded border border-gray-300 bg-white text-gray-700">
              <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">
                {{ classItem.class_name }}
              </option>
            </select>
            <router-link to="/forum" class="btn">Forum</router-link>
            <router-link to="/enrolled-classes" class="btn">Courses</router-link>
          </nav>
        </header>
        <main class="pt-24 flex flex-col items-center justify-start">
          <section class="w-full max-w-4xl mx-auto">
            <h2 class="text-2xl font-semibold text-center mb-4">All Videos</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="video in videos" :key="video.id" class="video-item rounded-lg overflow-hidden shadow-lg cursor-pointer p-4 bg-gray-50" @click="selectVideo(video)">
                <VideoPlayer :youtubeVideoId="getVideoId(video.video_link)" :videoSource="video.video_link" />
                <div>
                  <h3 class="font-bold mt-2">{{ video.title }}</h3>
                </div>
              </div>
            </div>
            <div v-if="selectedVideoUrl" class="selected-video mt-6" ref="selectedVideo">
              <VideoPlayer :videoSource="selectedVideoUrl" :youtubeVideoId="getVideoId(selectedVideoUrl)" />
              <div v-if="selectedVideoQuestions && selectedVideoQuestions.length > 0" class="mt-4">
                <h4 class="font-semibold mb-2">Video Questions</h4>
                <div v-for="(question, index) in selectedVideoQuestions" :key="index" class="mb-4">
                  <p class="font-medium mb-2">{{ question.question }}</p>
                  <div class="flex flex-col space-y-2">
                    <label v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="flex items-center space-x-2">
                      <input type="radio" :name="`question-${index}`" :value="answerIndex" v-model="selectedAnswers[index]" class="form-radio text-[#FF4136]">
                      <span>{{ answer }}</span>
                    </label>
                  </div>
                  <div v-if="hasSubmittedAnswers" class="mt-2">
                    <span v-if="answerCorrectness[index]" class="text-green-500">Correct</span>
                    <span v-else class="text-red-500">Incorrect</span>
                  </div>
                  <button @click="verifyVideoQuestionAnswers" class="btn">Submit</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </template>
  
  
  

<script>
import axios from 'axios';
import {nextTick, onMounted, ref} from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue';

export default {
    name: 'Videos',
    components: {
        VideoPlayer
    },
    data() {
        return {
            enrolledClasses: [],
            selectedCourseId: isNaN(Number(localStorage.getItem('selectedCourse'))) ? null : Number(localStorage.getItem('selectedCourse')),
            userPoints: null,
            videos: [],
            selectedVideoUrl: null,
            selectedVideoQuestions: [],
            selectedAnswers: [],
            hasSubmittedAnswers: false,
            answerCorrectness: [],
        };
    },
    mounted() {
        this.fetchEnrolledClasses();
        this.getUserPoints();
        this.fetchVideos();
    },
    methods: {
        async fetchEnrolledClasses() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const response = await axios.post('http://localhost:8000/get-enrolled-classes/', { sessionID });
                this.enrolledClasses = response.data.enrolled_classes;
            } catch (error) {
                console.error('Failed to fetch enrolled classes:', error);
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
        // Method to generate the YouTube embed URL from the video URL
        embedUrl(videoUrl) {
            // Extract video ID from YouTube URL
            const videoId = this.getVideoId(videoUrl);
            // Generate the YouTube embed URL
            return `https://www.youtube.com/embed/${videoId}`;
        },
        // Method to extract video ID from YouTube URL
        getVideoId(videoUrl) {
            // Regex to match YouTube video ID from various URL formats
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = videoUrl.match(regExp);
            if (match && match[2].length === 11) {
                return match[2];
            } else {
                // Handle invalid YouTube URL
                console.error('Invalid YouTube URL');
                return null;
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
        async fetchVideos() {
            try {
                const sessionID = localStorage.getItem('sessionID');
                const classID = this.selectedCourseId;

                if (typeof classID === 'number') {
                    const response = await axios.post(`http://localhost:8000/get-class-video-list/`, {
                        sessionID,
                        classID
                    });

                    if (response.data && response.data.videos) {
                        this.videos = response.data.videos.map(video => {
                            // Extract questions data from the video object
                            const questions = video.questions.map(question => {
                                return {
                                    question: question.question,
                                    answers: question.answers,
                                    correct_answer_index: question.correct_answer_index
                                };
                            });

                            // Create a new object with the extracted questions data
                            return {
                                title: video.title,
                                video_link: video.video_link,
                                questions: questions
                            };
                        });
                    } else {
                        console.error("Invalid response format from the backend");
                    }
                    console.log(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }
        },
        selectVideo(video) {
            this.selectedVideoUrl = video.video_link;
            this.selectedVideoQuestions = video.questions;
            this.selectedAnswers = new Array(video.questions.length).fill('');
            this.scrollToVideo();
        },
        scrollToVideo(){
            this.$nextTick(() =>{
                const videoElement = this.$refs.selectedVideo;
                if (videoElement){
                    videoElement.scrollIntoView({behavior: 'smooth', block: 'start' })
                }
            });
        },
        isAnswerCorrect(selectedAnswer, correctAnswerIndex, index) {
            // Check if the selected answer index matches the correct answer index
            console.log(selectedAnswer, correctAnswerIndex);
            this.answerCorrectness[index] = (selectedAnswer === correctAnswerIndex);
        },
        verifyVideoQuestionAnswers() {
            this.selectedAnswers.forEach((selectedAnswer, index) => {
                // Check if the selected answer index matches the correct answer index
                this.answerCorrectness[index] = (selectedAnswer === this.selectedVideoQuestions[index].correct_answer_index);
                if(this.answerCorrectness[index]) {
                    this.updateUserPoints();
                }
            });
            this.hasSubmittedAnswers = true; // Set the flag to true after submitting answers
        }
    },
    watch: {
        selectedCourseId(newCourseId) {
            if (newCourseId !== null) {
                this.fetchVideos(newCourseId);
            }
        }
    }
};
</script>

<style>
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
  
  .video-item iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  
  .selected-video iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  
  .video-item, .selected-video {
    background-color: #f9fafb; /* Light grey background for better readability */
  }


  @media (max-width: 768px) {
    .video-list, .selected-video {
      flex-direction: column;
    }
  }
  </style>