<template>
  <div class="form-wrap">
      <form class="login">
          <p class="login-register">
              Don't have an account?
              <router-link class="router-link" :to="{name: 'Register'}">Register</router-link>
          </p>
          <h2>Login to SavBlogs</h2>
          <div class="inputs">
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
              <router-link class="forgot-password" :to="{name: 'ForgotPassword'}">Forgot your password?</router-link>
              <button @click="signIn">Sign In</button>
              <div class="angle"></div>
      </form>
      <div class="background"></div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
export default {
    name: 'Login',
    data(){
        return{
            email: null,
            password: null,
            error:null,
            errorMsg:""
        }
    },
    methods:{
        signIn(e){
            e.preventDefault();
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
                this.$router.push({ name: 'Home' } );
                this.error = false;
                this.errorMsg = "";
            }).catch(err => {
                this.error = true;
                this.errorMsg = err.message;
        return;
            });
        }
    }
}
</script>

<style>
.form-wrap{
    overflow: hidden;
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 90%;
}
@media screen and (min-width: 900px) {
    .form-wrap{
        width: 100%;
    }
}
.form-wrap .login-register{
    margin-bottom: 32px;
}
.login-register .router-link{
    color: #000;
}
form{
    padding: 0 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
}
@media screen and (min-width: 900px) {
    form{
        padding: 0 50px;
    }
    form h2{
        font-size: 40px;
    }
}
form h2{
    text-align: center;
    font-size: 32px;
    color: #303030;
    margin-bottom: 40px;
}
.forgot-password{
    text-decoration: none;
    color: #000;
    cursor: pointer;
    font-size: 14px;
    margin: 16px 0 32px;
    border-bottom: 1px solid transparent;
    transition: 0.5s ease all;
}
.forgot-password:hover{
    border-color: #303030;
}
.inputs{
    width: 100%;
    max-width: 350px;
}
.inputs .input{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}
.input input{
    width: 100%;
    border: none;
    background-color: #f2f7f6;
    padding: 4px 4px 4px 30px;
    height: 50px;
}
.input input:focus{
    outline: none;
}
.inputs .input .icon{
    width: 12px;
    position: absolute;
    left: 6px;
}
.angle{
    display: none;
    position: absolute;
    background-color: #fff;
    transform: rotateZ(3deg);
    width: 60px;
    right: -30px;
    height: 201%;
}
@media screen and (min-width: 900px) {
    .angle{
        display: initial;
    }
}
.background{
    display: none;
    flex: 2;
    background-size: cover;
    background-image: url("../assets/background.png");
    height: 100%;
    width: 100%;
}
@media screen and (min-width: 900px) {
    .background{
        display: initial;
    }
}
</style>