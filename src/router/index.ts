import Vue from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '../pages/Index.vue';
import Auth from '../pages/Auth.vue';
import EnrolledClasses from '../pages/EnrolledClasses.vue';
import Forum from '../pages/Forum.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Index },
  { path: '/auth', component: Auth },
  { path: '/enrolled-classes', component: EnrolledClasses },
  { path: '/forum', component: Forum },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;