<template>
  <div id="signup">
    <div class="form-div">
      <div class="title">Sign Up</div>
      <form>
        <div class="input-div">
          <label for="firstname"></label>
          <input type="text" id="firstname" name="firstname" placeholder="Firstname" v-model="firstname"/>
        </div>
        <div class="input-div">
          <label for="lastname"></label>
          <input type="text" id="lastname" name="lastname" placeholder="Lastname" v-model="lastname"/>
        </div>
        <div class="input-div">
          <label for="email"></label>
          <input type="email" id="email" name="email" placeholder="Email" v-model="email"/>
        </div>
        <div class="input-div">
          <label for="password"></label>
<!--          TODO: make a showable password component-->
          <input type="text" id="password" name="password" placeholder="Password" v-model="password"/>
        </div>
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
  margin-top: 200px;
  .form-div{
    display: flex;
    flex-direction: column;
    background-color: $header-bg-color;
    border-radius: 10px;
    height: 500px;
    width: 300px;

    box-shadow:
      0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072),
      0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12)

  }
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form>div{
    margin: 5px 0;
  }

  button{
    margin-top: 50px;
    color: $highlight-color;
    border-color: $highlight-color;
    width:80%;
    height: 35px;
  }
  button:hover{
    color: $header-bg-color;
    background-color: $highlight-color;
  }
  .input-div{
    width: 80%;
  }
  input{
    width: 100%;
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
    margin: 0 auto;
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
