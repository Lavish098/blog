<template>
  <header>
      <nav class="container">
          <div class="branding">
              <router-link class="header" :to="{name: 'Home'}">
                  <img src="../assets/savblog.png" class="sav" alt="">
                  <h2 id="sav">SavBlogs</h2> 
                  </router-link>
              <div class="nav-links">
                  <ul v-show="!mobile">
                      <router-link class="link" :to="{name: 'Home'}">Home</router-link>
                      <router-link class="link" :to="{name: 'MoviesBlogs'}">Movies</router-link>
                      <router-link v-if="admin" class="link" :to="{name: 'CreatePost'}">Create Post</router-link>
                      <router-link v-if="!user" class="link" :to="{name: 'Login'}">Login/Register</router-link>
                  </ul>
                  <div v-if="user" @click="toggleProfileMenu" class="profile" ref="profile">
                      <span>{{ this.$store.state.profileInitials }}</span>
                      <div class="profile-menu" v-show="profileMenu">
                          <div class="info">
                              <p class="initials">{{ this.$store.state.profileInitials }}</p>
                              <div class="right">
                                  <p>{{ this.$store.state.profileFirstName }} {{ this.$store.state.profileLastName }}</p>
                                  <p>{{ this.$store.state.profileUsername }}</p>
                                  <p>{{ this.$store.state.profileEmail }}</p>
                              </div>
                          </div>
                          <div class="options">
                              <div class="option" >
                                  <router-link @click="toggleProfileMenu" class="option" :to="{name: 'Profile'}">
                                      <i class="fas fa-user icon"></i>
                                      <p>Profile</p>
                                  </router-link>
                              </div>
                              <div v-if="admin" class="option" >
                                  <router-link @click="toggleProfileMenu" class="option" :to="{name: 'Admin'}">
                                      <i class="fas fa-user-shield icon"></i>
                                      <p>Admin</p>
                                  </router-link>
                              </div>
                              <div @click="signOut" class="option">
                                      <i class="fas fa-sign-out-alt icon"></i>
                                      <p>Sign Out</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </nav>
      <div @click="toggleMobileNav" v-show="mobile" class="menu-icon" :class="{'btn-home':mobileNav}" >
        <div class="bar" ></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <transition name="mobile-nav" >
          <ul class="mobile-nav"  v-show="mobileNav">
                      <router-link @click="toggleMobileNav" class="link" :to="{name: 'Home'}">Home</router-link>
                      <router-link @click="toggleMobileNav" class="link" :to="{name: 'MoviesBlogs'}">Movies</router-link>
                      <router-link @click="toggleMobileNav" v-if="admin" class="link" :to="{name: 'CreatePost'}">Create Post</router-link>
                      <router-link @click="toggleMobileNav" v-if="!user" class="link" :to="{name: 'Login'}">Login/Register</router-link>
                  </ul>
      </transition>
  </header>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
name: 'Navigation',
components:{
},
data(){
    return{
        mobile: null,
        mobileNav: null,
        windowWidth: null,
        profileMenu:null,
    };
},
created(){
    window.addEventListener('resize', this.checkScreen);
    this.checkScreen();
},
methods:{
    checkScreen(){
        this.windowWidth = window.innerWidth;
        if(this.windowWidth <= 750){
            this.mobile = true;
            return;
        }
        this.mobile = false;
        this.mobileNav = false;
        return;
    },
    toggleMobileNav(){
        this.mobileNav = !this.mobileNav;
    },
    toggleProfileMenu(e){
        if(e.target === this.$refs.profile){
            this.profileMenu = !this.profileMenu;
        }
        
    },
    signOut(){
        firebase.auth().signOut();
        window.location.reload();
    }
},
computed:{
user(){
    return this.$store.state.user;
},
admin(){
    return this.$store.state.profileAdmin;
}
}
}
</script>

<style scoped>
header{
    background-color: #fff;
    padding: 0 25px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
    z-index: 99;
}
.link{
    font-weight: 600;
    padding: 0 8px;
    transition: .3s color ease;
}
.link:hover{
    color: #1eb8b8;
}
nav{
    display: flex;
    padding: 25px 0;
}
nav .branding{
    display: flex;
    align-items: center;
    width:100%;
}
.header{
    display: flex;
    font-weight: 600;
    font-size: 24px;
    color: #000;
    text-decoration: none;
}
.sav{
    margin-left: -15px;
    width: 50px;
}
@media screen and (min-width: 500px) {
    .sav{
        margin-left: 0;
    }
}
#sav{
    font-size: 30px;
    margin-top: 5px;
}
.branding .nav-links{
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    margin-right: 40px;
    
}
.nav-links ul{
    margin-right: 32px;
}
.nav-links .link{
    margin-right: 32px;
}
.nav-links .link:last-child{
    margin-right: 0;
}
.nav-links .profile{
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #fff;
    background-color: #303030;
}
.profile .profile-menu{
    position: absolute;
    top: 60px;
    right: -40px;
    width: 300px;
    background-color: #303030;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
}
.profile-menu .info{
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #fff;
}
.info .initials{
    position: initial;
    width: 40px;
    height: 40px;
    background-color: #fff;
    color: #303030;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
.right{
    flex:1;
    margin-left: 24px;
}
    .right p:nth-child(1){
        font-size: 14px;
    }
    .right p:nth-child(2), p:nth-child(3){
        font-size: 12px;
    }
.options{
    padding: 15px;
}
.options .option{
    text-decoration: none;
    color: #fff;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
} 
.option .icon{
    width: 18px;
    height: auto;
}
.option p{
    font-size: 14px;
    margin-left: 12px;
}
.option:last-child{
    margin-bottom: 0px;
}
span{
    pointer-events: none;
}
.menu-icon{
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
}
.mobile-nav{
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;
}
.mobile-nav .link{
    padding: 15px 0;
    color: #fff;
}
.mobile-nav-enter-active,
.mobile-nav-leave-active{
    transition: all 1s ease;
}
.mobile-nav-enter{
    transform: translateX(-250px);
}
.mobile-nav-leave{
    transform: translateX(0);
}
.mobile-nav-enter-to{
    transform: translateX(0);
}
.mobile-nav-leave-to{
    transform: translateX(-250px);
}
.btn-home .bar:nth-child(2) {
    opacity: 0;
  }
  .btn-home .bar:nth-child(1) {
    width: 2.25rem;
    height: 5px;
    transform: translateY(13px) rotate(45deg);
  }
  .btn-home .bar:nth-child(3) {
    width: 2.25rem;
    height: 5px;
    transform: translateY(-13px) rotate(-45deg);
  }
  .btn-home .bar{
    background: black;
    ;
  }
  .bar{
      width: 28px;
      height: 4px;
      margin-bottom: 8px;
      background: black;
    transition: all ease-in-out 0.5s;
  }
</style>