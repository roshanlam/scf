<template>
    <div id="app" class="bg-white font-sans text-white">
        <div class="container mx-auto px-11 py-12">
            <header class="fixed top-0 inset-x-0 z-50 bg-white flex justify-between items-center py-4">
                <router-link to="/" class="text-3xl font-bold text-[#FF4136] cursor-pointer ml-7">
                    <span class="text-[#FF4136] font-bold">Socio</span><span
                        class="text-[#2A3945] font-bold">Coders</span>
                </router-link>

                <nav class="flex items-center space-x-6">
                    <h2>Select Class</h2>
                    <p v-if="userPoints !== null" class="text-lg font-semibold text-gray-600">{{ userPoints }} Points
                    </p>
                    <select v-model="selectedCourseId" :placeholder="'Select course'">
                        <option v-for="classItem in enrolledClasses" :key="classItem.id" :value="classItem.id">( {{
                            classItem.class_name }} )</option>
                    </select>
                    <router-link to="/forum"
                        class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Forum</router-link>

                    <router-link to="/enrolled-classes"
                        class="text-lg text-white bg-[#FF4136] px-6 py-2 rounded-full hover:bg-white hover:text-[#FF4136] transition duration-300 ease-in-out flex items-center justify-center">Courses</router-link>
                </nav>
            </header>

            <main class="flex flex-col items-center justify-start pt-32 min-h-screen">
                <div class="content">
                    <div class="videos-panel">
                        <h2>All Videos</h2>
                        <div class="video-container">
                            <div class="video-list">
                                <div v-for="video in videos" :key="video.id" class="video-item"
                                    @click="selectVideo(video)">
                                    <h3>{{ video.title }}</h3>
                                    <p>{{ video.url }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="selected-video">
                            <iframe v-if="selectedVideoUrl" :src="embedUrl(selectedVideoUrl)" frameborder="0" allowfullscreen></iframe>
                            <p v-else>No video selected</p>

                            <div v-if="selectedVideoQuestions">
                                <h3>Video Questions</h3>
                                <div v-for="(question, index) in selectedVideoQuestions" :key="index" class="question">
                                    <p>{{ question.question }}</p>
                                    <div class="choices">
                                        <label v-for="(choice, choiceIndex) in question.answers" :key="choiceIndex">
                                            <input type="radio" :value="choice" v-model="selectedAnswers[index]">
                                            {{ choice }}
                                        </label>
                                    </div>
                                    <!-- Checkmark or "X" based on correctness -->
                                    <span v-if="hasSubmittedAnswers">{{ answerCorrectness[index] ? '✅' : '❌' }}</span>
                                </div>
                                <button @click="verifyVideoQuestionAnswers">Submit</button>
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
    name: 'Videos',
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
        },
        isAnswerCorrect(selectedAnswer, correctAnswerIndex, index) {
            // Check if the selected answer index matches the correct answer index
            console.log(selectedAnswer, correctAnswerIndex);
            this.answerCorrectness[index] = (selectedAnswer === correctAnswerIndex);
        },
        verifyVideoQuestionAnswers() {
            this.selectedAnswers.forEach((selectedAnswer, index) => {
                // Check if the selected answer index matches the correct answer index
                this.answerCorrectness[index] = (selectedAnswer === this.selectedVideoQuestions[index].answers[this.selectedVideoQuestions[index].correct_answer_index]);
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
.main {
    color: black;
}

.video-container {
    display: flex;
}

.video-list {
    margin-top: 20px;
    overflow-y: auto;
    flex: 1;
}

.video-item {
    cursor: pointer;
    margin-bottom: 20px;
}

.selected-video {
    margin-left: 20px;
}

.selected-video iframe {
    width: 560px;
    height: 315px;
}
</style>