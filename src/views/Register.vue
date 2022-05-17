<template>
   <div class="form-wrap">
      <form class="register">
          <p class="login-register">
              Already have an account?
              <router-link class="router-link" :to="{name: 'Login'}">Login</router-link>
          </p>
          <h2>Create your SavBlogs account</h2>
          <div class="inputs">
              <div class="input">
                  <input type="text" placeholder="First Name" v-model="firstName">
                  <i class="fas fa-user icon"></i>
              </div>
              <div class="input">
                  <input type="text" placeholder="Last Name" v-model="lastName">
                  <i class="fas fa-user icon"></i>
              </div>
              <div class="input">
                  <input type="text" placeholder="Username" v-model="username">
                  <i class="fas fa-user icon"></i>
              </div>
              <div class="input">
                  <input type="text" placeholder="Email" v-model="email">
                  <i class="fas fa-envelope icon"></i>
              </div>
              <div class="input">
                  <input type="password" placeholder="Password" v-model="password">
                  <i class="fas fa-key icon"></i>
              </div>
              <div class="error" v-show="error">{{ this.errorMsg }}</div>
              </div>
              <button @click.prevent="register">Sign Up</button>
              <div class="angle"></div>
      </form>
      <div class="background"></div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import db from "../firebase/firebaseInit";

export default {
    name: 'Register',
    data(){
        return{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            error:null,
            errorMsg:""
            }
    },
    methods:{
        async register(){
            if(
                this.email !== "" &&
                this.password !== "" &&
                this.firstName !== "" &&
                this.lastName !== "" &&
                this.username !== ""
            ){
                this.error = false;
                this.errorMsg = "";
                const firebaseAuth = await firebase.auth();
                const createUser = await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password);
                const result = await createUser;
                const dataBase = db.collection("users").doc(result.user.uid);
                await dataBase.set({
                    firstName: this.firstName,
                lastName: this.lastName,
                username: this.username, 
                    email: this.email,
                });
                this.$router.push({ name: 'Home' });
                const user = firebase.auth().currentUser
                user.sendEmailVerification();
                return;
            }
            this.error = true;
            this.errorMsg = "Please fill out all the fields";
            return;
        }
    }
}
</script>

<style scoped>
.register h2{
    max-width: 350px;
}
</style>