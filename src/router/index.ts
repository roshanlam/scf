import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '../pages/Index.vue';
import EnrolledClasses from '../pages/EnrolledClasses.vue';
import Forum from '../pages/Forum.vue';
import Videos from '../pages/Videos.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Index },
  { path: '/enrolled-classes', component: EnrolledClasses },
  { path: '/forum', component: Forum },
  { path: '/videos', component: Videos },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;