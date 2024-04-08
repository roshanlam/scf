import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App as any) // Add type declaration for App module

app.use(pinia)
app.mount('#app')
