import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import './components/fontawesome-free-5.15.1-web/css/all.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const apps = createApp()
apps.component('QuillEditor', QuillEditor)

let app;
firebase.auth().onAuthStateChanged(() => {
    if(!app){
        createApp(App).use(router).use(store).mount('#app')
    }
})

