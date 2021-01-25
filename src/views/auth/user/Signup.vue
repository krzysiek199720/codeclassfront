<template>
  <div id="signup">
    <div class="form-div">
      <div class="title">Sign Up</div>
      <form>
        <input type="text" id="firstname" name="firstname" placeholder="Firstname" v-model="firstname"/>
        <input type="text" id="lastname" name="lastname" placeholder="Lastname" v-model="lastname"/>
        <input type="email" id="email" name="email" placeholder="Email" v-model="email"/>
<!--          TODO: make a showable password component-->
        <input type="text" id="password" name="password" placeholder="Password" v-model="password"/>
        <button @click.prevent="login">Sign in</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios/axios'
import store from '@/store/store'

export default {
  name: 'signup',
  data () {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      const data = {
        firstName: this.firstname,
        lastName: this.lastname,
        email: this.email,
        password: this.password
      }
      axios.post('/user', data)
        .then(res => {
          this.$router.push({ name: 'login' })
        })
        .catch(error => {
          // resolve error
          console.log(error)
        })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (store.getters.authIsAuthenticated) {
      next({ name: 'Home' })
    }
    next()
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#signup{
  display: flex;
  justify-content: center;
  margin: 160px 0 20px;
  .form-div{
    display: flex;
    flex-direction: column;
    background-color: $box-bg-color1;
    height: 500px;
    width: 300px;
    box-shadow:
        0 3px 3px rgba($highlight-color, 0.03),
        0 5px 6px rgba($highlight-color, 0.025),
        0 10px 12px rgba($highlight-color, 0.02),
        0 20px 24px rgba($highlight-color, 0.015),
        0 40px 48px rgba($highlight-color, 0.01),
        0 80px 96px rgba($highlight-color, 0.05);

  }
  form{
    display: flex;
    flex-direction: column;
    padding: 0 30px;
  }

  button{
    margin-top: 45px;
    color: $highlight-color;
    border-color: $highlight-color;
    width:80%;
    height: 35px;
    align-self: center;
  }

  button:hover{
    color: $box-bg-color1;
    background-color: $highlight-color;
  }

  .error{
    border-bottom: 1px solid $error-color;
  }

  input{
    height: 30px;
    margin: 8px 0;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
  }

  input::placeholder{
    color: $input-placeholder-color;
  }

  input:focus, input:active, input:hover{
    border: 0;
    border-bottom: 1px solid $highlight-color;
    outline: 0;
  }

  .title{
    font-weight: 700;
    font-size: 30px;
    margin: 20% auto 20% auto;
    color: $highlight-color;
  }
}
</style>
