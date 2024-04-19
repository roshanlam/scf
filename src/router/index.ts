import Vue from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '../pages/Index.vue';
import Auth from '../pages/Auth.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Index
    },
    {
        path: '/auth',
        component: Auth
    }
];

const router = createRouter({
    history: createWebHistory("/"),
    routes
});

export default router;