<template>
<div class="reset-password">
    <Modal v-if="modalActive" :modalMessage="modalMessage" @close-modal="closeModal"/>
    <Loading v-if="loading"/>
   <div class="form-wrap">
      <form class="reset">
          <p class="login-register">
              Back to
              <router-link class="router-link" :to="{name: 'Login'}">Login</router-link>
          </p>
          <h2>Reset Password</h2>
          <p>Forgot your pasword? Enter your email to reset it</p>
          <div class="inputs">
              <div class="input">
                  <input type="text" placeholder="Email" v-model="email">
                  <i class="fas fa-envelope icon"></i>
              </div>
              
  </div>
              <button @click.prevent="resetPassword">Reset</button>
              <div class="angle"></div>
      </form>
      <div class="background"></div>
  </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue"
import Loading from "../components/Loading.vue"
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
    name: 'ForgotPassword',
    components:{
        Modal, Loading
    },
    data(){
        return{
            email: null,
            modalActive: null,
            modalMessage:"",
            loading: null,
        }
    },
    methods:{
        closeModal(){
            this.modalActive = !this.modalActive;
            this.email = "";
        },
        resetPassword(){
            this.loading = true;
            firebase.auth().sendPasswordResetEmail(this.email).then(() => {
                this.modalMessage = "If your account exists, you will receive an email";
                this.loading = false;
                this.modalActive = true;
            }).catch(err => {
                this.modalMessage = err.message;
                this.loading = false;
                this.modalActive = true;
            })
        }
    }

}
</script>

<style scoped>
.reset-password{
    position: relative;
}
.form-warp .reset h2{
    margin-bottom: 8px;
}
.form-warp .reset p{
    text-align: center;
    margin-bottom: 32px;
}
.angle{
    height: 401%;
}
</style>