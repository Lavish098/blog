<template>
  <div class="admin">
      <div class="container">
          <h2>Administration</h2>
          <div class="admin-info">
              <h2>Add Admin</h2>
              <div class="input">
                  <input type="text" placeholder="Enter user email to make them an admin" id="addAdmins" v-model="adminEmail">
              </div>
              <span>{{ this.functionMsg }}</span>
              <button @click="addAdmin" class="button">Submit</button>
          </div>
      </div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';
export default {
    data(){
        return{
            adminEmail:"",
            functionMsg: null,
        }
    },
    methods:{
        async addAdmin(){
            const addAdmin =await firebase.functions().httpsCallable('addAdminRole');
            const result = await addAdmin({email: this.adminEmail});
            this.functionMsg = result.data.message;
        }
    }
}
</script>

<style scoped>
.admin .container{
    max-width: 1000px;
    padding: 60px 25px;
}
.container h2{
    text-align: center;
    margin-bottom: 16px;
    font-weight: 300;
    font-size: 32px;
}
.admin-info{
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.86);
    padding: 32px;
    background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: 32px auto;
}
.admin-info span{
    font-size: 14px;
}
.input{
    margin: 16px 0;
}
.input label{
    font-size: 14px;
    display: block;
    padding-bottom: 6px;
}
.input input{
    width: 100%;
    border: none;
    background-color: #f2f7f6;
    padding: 8px;
    height: 50px;
}
.input input:focus{
    outline: none;
}
button{
    align-self: center;
}
</style>