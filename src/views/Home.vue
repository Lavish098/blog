<template>
  <div class="home">
    <BlogPost  v-if="!user" :post="welcomeScreen" />
    <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index"/>
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Blogs</h3>
        <div class="blog-cards">
          <BlogCard :post="post" v-for="(post, index) in blogPostsCards" :key="index"/>
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Never miss a post. Register for your free account today!</h2>
        <router-link class="router-button" :to="{name: 'Login'}">
          Register for SavBlogs <i class="fas fa-arrow-right arrow arrow-light"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BlogPost from "../components/BlogPost.vue"
import BlogCard from "../components/BlogCard.vue"

export default {
  name: 'Home',
  components: { BlogPost, BlogCard },
  data(){
    return{
      welcomeScreen:{
        title: "Welcome",
        blogPost: "Get a weekly dose of ZeeWorld gist for all ZeeWorld fans.",
        welcomeScreen: true,
        photo: "zeeworld",
      },
      
      
    };
  },
  computed:{
    blogPostsCards(){
      return this.$store.getters.blogPostsCards;
    },
    blogPostsFeed(){
      return this.$store.getters.blogPostsFeed;
    },
user(){
    return this.$store.state.user;
}
  }
};
</script>
<style scoped>
.blog-card-wrap h3{
  font-weight: 300;
  font-size: 28px;
  margin-bottom: 32px;
}
.updates .container{
  padding: 100px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media screen and (min-width: 800px) {
  .updates .container{
  padding: 120px 25px;
  flex-direction: row;
}
.updates .container .router-button{
  margin-left: auto;
}
.updates .container h2{
  text-align: initial;
  font-size: 40px;
}
}
.updates .container .router-button{
  display: flex;
  font-size: 14px;
  text-decoration: none;
}
.updates .container h2{
  font-size: 32px;
  font-weight: 300;
  max-width: 425px;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
}
</style>