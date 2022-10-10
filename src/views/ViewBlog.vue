<template>
  <div class="post-view">
      <div class="container quillWrapper" v-if="currentBlog">
          <h2>{{ (this.currentBlog[0].blogTitle) }}</h2>
          <h4>Posted on: {{ new Date(this.currentBlog[0].blogDate.seconds * 1000).toLocaleString("en-us")}}</h4>
          <img :src="this.currentBlog[0].blogCoverPhoto" alt="">
          <div class="post-content ql-editor" v-html="this.currentBlog[0].blogHTML"></div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      currentBlog: null,
    }
  },
  async mounted(){
    this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
      console.log(post.blogID === this.$route.params.blogid)
      return post.blogID === this.$route.params.blogid;
    })
  }
}
</script>

<style>
.post-view h4{
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 24px;
}
</style>