import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createPinia } from 'pinia'
import router from './router';

const pinia = createPinia()
const app = createApp(App as any)

app.use(pinia)
app.use(router);
app.mount('#app')
