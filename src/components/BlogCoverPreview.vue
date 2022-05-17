<template>
  <div class="modal" ref="modal">
      <div class="modal-content">
          <i class="far fa-times-circle icon" @click="closePreview"></i>
          <img :src="this.blogCoverPhoto" alt="">
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        closePreview(){
            this.$store.commit("openPhotoPreview");
        },
    },
    computed:{
        blogCoverPhoto(){
            return this.$store.state.blogPhotoFileURL;
        },
    },
};
</script>

<style scoped>
.modal{
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.modal .modal-content{
    display:flex;
    position: relative;
    justify-content: center;
    border-radius: 12px;
    width: 450px;
    height: 400px;
    padding: 50px;
    background-color: #fff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
}
@media screen and (min-width:800px) {
    .modal .modal-content{
        width: 600px;
    }
}
.icon{
    width: 24px;
    height: auto;
    cursor: pointer;
    font-size: 24px;
    position: absolute;
    top: 15px;
    right: 15px;
    color: #303030;
}
img{
    margin-top: 16px;
    display: block;
    width: 120%;
    height: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
}
@media screen and (min-width: 800px) {
    img{
        width: auto;
    }
}
</style>