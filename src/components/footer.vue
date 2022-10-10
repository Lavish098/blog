<template>
  <footer>
      <div class="container">
          <div class="left">
              <div class="col-1">
                  <router-link class="header" :to="{name: 'Home'}">SavBlogs</router-link>
                  <ul>
                      <li><a href="#"><i class="fab fa-youtube"></i></a></li>
                      <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                      <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                      <li><a href="#"><i class="fab fa-linkedin"></i></a></li>
                  </ul>
              </div>
              <div class="col-2">
                  <ul>
                      <router-link class="link" :to="{name: 'Home'}">Home</router-link>
                      <router-link class="link" :to="{name: 'MoviesBlogs'}">Blogs</router-link>
                      <router-link v-if="admin" class="link" :to="{name: 'MoviesCreatePost'}">Create Post</router-link>
                      <router-link v-if="!user" class="link" :to="{name: 'Login'}">Login/Register</router-link>
                  </ul>
              </div>
          </div>
          <div class="right">
              <p>Copyright 2021 All Rights Reserved</p>
          </div>
      </div>
  </footer>
</template>

<script>

export default {
computed:{
user(){
    return this.$store.state.user
},
admin(){
    return this.$store.state.profileAdmin;
}
}
}
</script>

<style scoped>
footer{
    margin-top: auto;
    padding: 50px 25px;
    background-color: #303030;
}
.container{
    display: flex;
    flex-direction: column;
    gap: 32px;
}
@media screen and (min-width: 800px) {
    .container{
        flex-direction: row;
        gap: 0px;
    }
}
.container div{
    display: flex;
    flex: 1;
}
.container .left{
    gap: 32px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
}
@media screen and (min-width: 800px) {
    .container .left{
        flex-direction: row;
        gap: 0px;
        align-items: initial;
    }
}
.header{
    text-align: center;
    font-size: 24px;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
}
@media screen and (min-width: 800px) {
    .header{
        text-align: initial;
    }
}
.left ul{
    gap: 16px;
    list-style: none;
    display: flex;
}
.col-1, .col-2{
    gap: 32px;
    display: flex;
    flex: 1;
}
@media screen and (min-width: 800px) {
    .col-1, .col-2{
            gap: 0px;
    }
}
.col-1{
    flex-direction: column;
}
.col-1 ul{
    margin-top: auto;
}
.col-1 li{
    display: flex;
    align-items: center;
}
.col-1 li i{
    width: 24px;
    height: auto;
    color: #fff;
}
.col-2 ul{
    height: 100%;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
}
@media screen and (min-width: 800px) {
    .col-2 ul{
        flex-direction: column;
    }
}
.col-2 .link{
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    text-decoration: none;
}
.right{
    gap: 32px;
    color: #fff;
    align-items: center;
    flex-direction: column;
}
@media screen and (min-width: 800px) {
    .right{
        align-items: flex-end;
        gap: 0px;
    }
}
.right p{
    margin-top: auto;
}
</style>