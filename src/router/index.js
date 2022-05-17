import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MoviesBlogs from '../views/MoviesBlog/MoviesBlogs.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Profile from '../views/Profile.vue'
import Admin from '../views/Admin.vue'
import MoviesCreatePost from '../views/MoviesBlog/MoviesCreatePost.vue'
import BlogPreview from '../views/BlogPreview.vue'
import ViewBlog from '../views/ViewBlog.vue'
import EditBlog from '../views/EditBlog.vue'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title: 'Home',
      requiresAuth: false,
    }
  },
  {
    path:'/movies-blogs',
    name:'MoviesBlogs',
    component: MoviesBlogs,
    meta:{
      title: 'Blogs',
      requiresAuth: false,
    }
  },
  {
    path:'/login',
    name:'Login',
    component: Login,
    meta:{
      title: 'Login',
      requiresAuth: false,
    }
  },
  {
    path:'/register',
    name:'Register',
    component: Register,
    meta:{
      title: 'Register',
      requiresAuth: false,
    }
  },
  {
    path:'/forgotPassword',
    name:'ForgotPassword',
    component: ForgotPassword,
    meta:{
      title: 'ForgotPassword',
      requiresAuth: false,
    }
  },
  {
    path:'/profile',
    name:'Profile',
    component: Profile,
    meta:{
      title: 'Profile',
      requiresAuth: true,
    }
  },
  {
    path:'/admin',
    name:'Admin',
    component: Admin,
    meta:{
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
  {
    path:'/movies-create-post',
    name:'MoviesCreatePost',
    component: MoviesCreatePost,
    meta:{
      title: 'CreatePost',
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
  {
    path:'/post-preview',
    name:'BlogPreview',
    component: BlogPreview,
    meta:{
      title: 'BlogPreview',
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
  {
    path:'/view-blog/:blogid',
    name:'ViewBlog',
    component: ViewBlog,
    meta:{
      title: 'ViewBlog',
      requiresAuth: false,
    }
  },
  {
    path:'/edit-blog/:blogid',
    name:'EditBlog',
    component: EditBlog,
    meta:{
      title: 'Edit Blog Post',
      requiresAuth: true,
      requiresAdmin: true,
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SavBlog`;
  next();
  setTimeout(() => {
    window.scrollTo(0, 0);
}, 100);
next();
})
router.beforeEach(async (to, from, next) => {
  let user = firebase.auth().currentUser;
  let admin = null;
  if (user){
    let token = await user.getIdTokenResult();
    admin = token.claims.admin;
  }
  if(to.matched.some((res) => res.meta.requiresAuth)){
    if(user){
      if(to.matched.some((res) => res.meta.requiresAdmin)){
        if(admin){
          return next();
        }
        return next({name: "Home"});
      } 
      return next();
    }
    return next({name: "Home"});
  }
  return next();
})
export default router
