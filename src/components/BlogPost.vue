<template>
  <div class="blog-wrapper" :class="{'no-user' : !user}">
      <div class="blog-content">
          <div>
              <h2 v-if="post.welcomeScreen">{{ post.title }}</h2>
              <h2 v-else>{{ post.blogTitle }}</h2>
              <p v-if="post.welcomeScreen">{{ post.blogPost }}</p>
              <p class="content-preview" v-else v-html="post.blogHTML"></p>
              <router-link class="link link-light" v-if="post.welcomeScreen" :to="{name: 'Login'}">
                  Login/Register<i class="fas fa-arrow-right arrow arrow-light"></i>
              </router-link>
              <router-link class="link" v-else :to="{name: 'ViewBlog', params:{blogid: this.post.blogID}}">
                  View the post<i class="fas fa-arrow-right arrow"></i>
              </router-link>
          </div>
      </div>
      <div class="blog-photo">
              <img v-if="post.welcomeScreen" :src="require(`../assets/${post.photo}.jpeg`)" alt="">
              <img v-else :src="post.blogCoverPhoto" alt="">
          </div>
  </div>
</template>

<script>
export default {
name: "BlogPost",
props:["post"],
computed:{
user(){
    return this.$store.state.user
}
}
}
</script>

<style scoped>
.blog-wrapper{
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
}
@media screen and (min-width: 700px) {
    .blog-wrapper{
        min-height: 400px;
        max-height: 400px;
        flex-direction: row;
    }
}
.blog-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 4;
    order: 2;
}
@media screen and (min-width: 700px) {
    .blog-content{
        order: 1;
    }
}
@media screen and (min-width: 800px) {
    .blog-content{
        flex: 3;
    }
}
.blog-content div{
    max-width: 375px;
    padding: 72px 24px;
}
@media screen and (min-width: 700px) {
    .blog-content div{
        padding: 0 24px;
    }
}
.blog-content div h2{
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 24px;
}
@media screen and (min-width: 700px) {
    .blog-content div h2{
        font-size: 40px;
    }
}
.blog-content div p{
    font-size: 15px;
    font-weight: 300;
    line-height: 1.7;
}
.content-preview{
    font-size: 13px;
    max-height: 24px;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.blog-content div .link{
    display: inline-flex;
    align-items: center;
    margin-top: 32px;
    padding-bottom: 4px;
    border-bottom: 1px solid transparent;
    transition: .5s ease-in all;
}
.blog-content div .link:hover{
    border-bottom-color: #303030;
}
.blog-content div .link-light:hover{
    border-bottom-color: #fff;
}
.blog-photo{
    order: 1;
    flex: 3;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
}
@media screen and (min-width: 700px) {
    .blog-photo{
        order: 2;
    }
}
@media screen and (min-width: 800px) {
    .blog-photo{
        flex: 4;
    }
}
.blog-photo img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.blog-wrapper:nth-child(even) .blog-content{
    order: 2;
}
.blog-wrapper:nth-child(even) .blog-photo{
    order: 1;
}
.no-user:first-child .blog-content{
    background-color: #303030;
    color: #fff;
}
</style>