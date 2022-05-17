<template>
  <div class="create-post">
      <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview"/>
      <Loading v-show="loading" />
      <div class="container">
          <div :class="{invisible: !error}" class="err-message">
              <p><span>Error:</span>{{ this.errorMsg }}</p>
          </div>
          <div class="blog-info">
              <input type="text" placeholder="Enter Blog Title" v-model="blogTitle">
              <div class="upload-file">
                  <label for="blog-photo">Upload Cover Photo</label>
                  <input type="file" ref="blogPhoto" id="blog-photo" accept=".png, .jpg, .jpeg" @change="fileChange">
                  <button class="preview" @click="openPreview" :class="{'button-inactive': !this.$store.state.blogPhotoFileURL}">
                      Preview Photo
                  </button>
                  <span>File Choosen: {{ this.$store.state.blogPhotoName }}</span>
              </div>
          </div>
          <div class="editor">
            <vue-editor :editorOptions="editorSettings" v-model="blogHTML" useCustomImageHandler 
            @image-added="imageHandler"/>
          </div>
          <div class="blog-actions">
              <button @click="uploadBlog">Publish Blog</button>
              <router-link :to="{name: 'BlogPreview'}" class="router-button">Post Preview</router-link>
          </div>
      </div>
  </div>
</template>

<script>
import BlogCoverPreview from './../../components/BlogCoverPreview'
import Loading from './../../components/Loading'
import firebase from 'firebase/compat/app'
import "firebase/compat/storage"
import db from '../../firebase/firebaseInit'
import { VueEditor, Quill } from 'vue3-editor'
window.Quill = Quill
const ImageResize = require('quill-image-resize-module').default;
Quill.register('modules/imageResize', ImageResize)
export default {
    components:{
        BlogCoverPreview, Loading, VueEditor
    },
    data(){
        return{
            file: null,
            error: null,
            errorMsg: null,
            loading: null,
            editorSettings:{
                modules:{
                    imageResize:{},
                }
            },
        }
    },
    computed:{
        profileId(){
            return this.$store.state.profileId;
        },
        blogCoverPhotoName(){
            return this.$store.state.blogPhotoName;
        },
        blogTitle: {
            get() {
                return this.$store.state.blogTitle;
            },
            set(payload){
                this.$store.commit("updateBlogTitle", payload);
            }
        },
        blogHTML: {
            get() {
                return this.$store.state.blogHTML;
            },
            set(payload){
                this.$store.commit("newBlogPost", payload);
            }
        },
    },
    methods:{
        fileChange(){
            this.file = this.$refs.blogPhoto.files[0];
            const fileName = this.file.name;
            this.$store.commit("fileNameChange", fileName);
            this.$store.commit("createFileURL", URL.createObjectURL(this.file));
            
        },
        openPreview(){  
            this.$store.commit("openPhotoPreview")
        },
        imageHandler(file, Editor, cursorLocation, resetUploader){
            const storageRef = firebase.storage().ref();
            const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
            docRef.put(file).on("state_changed", (snapshot) => {
                console.log(snapshot)
            },(err) => {
                console.log(err)
            }, async () => {
                const downloadURL = await docRef.getDownloadURL();
                Editor.insertEmbed(cursorLocation, "image", downloadURL);
                resetUploader();
            })
        },
        uploadBlog(){
            if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0){
                if(this.file){
                    this.loading = true
                    const storageRef = firebase.storage().ref();
                    const docRef = storageRef.child(`document/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
                    docRef.put(this.file).on("state_changed", (snapshot) => {
                        console.log(snapshot)
                    }, (err) =>{
                        console.log(err)
                        this.loading = false
                    }, async () => {
                        const downloadURL = await docRef.getDownloadURL();
                        const timestamp = await new Date();
                        const dataBase = await db.collection("blogPosts").doc();

                        await dataBase.set({
                            blogID: dataBase.id,
                            blogHTML: this.blogHTML,
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoName: this.blogCoverPhotoName,
                            blogTitle: this.blogTitle,
                            profileId: this.profileId,
                            date: timestamp
                        });

                        await this.$store.dispatch("getPost")
                        this.loading = false
                        this.$router.push({ name: 'ViewBlog', params:{ blogid: dataBase.id }})
                        this.blogHTML = "";
                        this.blogTitle = "";
                        this.blogCoverPhotoName= "";
                        this.blogPhotoFileURL = null;
}
                    )
                    return;
                }
                this.error = true;
            this.errorMsg = "Please make sure you uploaded a cover photo!";
            setTimeout(() => {
                this.error = false
            }, 5000)
            return;
            }
            this.error = true;
            this.errorMsg = "Please ensure Blog Title and Blog Post has been filled!";
            setTimeout(() => {
                this.error = false
            }, 5000)
            return;
        },

    }
}
</script>

<style>
.create-post{
    position: relative;
    height: 100%;
}
.create-post button{
    margin-top: 0;
}
.create-post .router-button{
    text-decoration: none;
    color: #fff;
}
.create-post label, button, .router-button{
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;
}
.create-post label, button, .router-button:hover{
    background-color: rgba(48, 48, 48, 0.7);
}
.create-post .container{
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
}
/* error stying */
.create-post .invisible{
    opacity: 0 !important;
}
.create-post .err-message{
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;
}
.err-message p{
    font-size: 14px;
}
.err-message span{
    font-weight: 600;
}
.blog-info{
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
}
@media screen and (min-width: 800px) {
    .blog-info{
    display: flex;
    flex-direction: row;
}
}
.blog-info input:nth-child(1){
    min-width: 300px;
}
.blog-info input{
    width: 50px;
    transition: .5s ease-in-out;
    padding: 10px 4px;
    border: none;
    border-bottom: 1px solid #303030;
}

.blog-info input:focus{
    outline: none;
    box-shadow: 0 1px 0 0 #303030;
}
.upload-file{
    margin-top: 20px;
    margin-left: 1px;
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
}
@media screen and (min-width: 500px) {
    .upload-file{
    margin-top: 0;
    margin-left: 16px;
    flex-direction: row;
}
}
.upload-file input{
    display: none;
}
.upload-file .preview{
    margin-left: 8px;
    margin-bottom: 7px;
    margin-top: 10px;
    text-transform: initial;
}
@media screen and (min-width:800px) {
    .upload-file .preview{
        margin-top: 0;
        margin-left: 16px;
        margin-bottom: 0px;
    }
}
.upload-file span{
    font-size: 12px;
    margin-left: 16px;
    align-self: center;
}
.editor{
    height: 60vh;
    display: flex;
    flex-direction: column;
}
.editor .quillWrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.editor .ql-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: scroll;
}
.editor .ql-editor{
    padding: 20px 16px 30px;
}
.blog-actions{
    margin-top: 30px;
}
.blog-actions button{
    margin-right: 16px;
}
</style>