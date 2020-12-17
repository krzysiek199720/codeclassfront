<template>
  <div id="login">
    <div class="form-div">
      <div class="title">Log In</div>
      <form>
        <input type="email" id="email" name="email" placeholder="Email" v-model="email"/>
        <input type="password" id="password" name="password" placeholder="Password" v-model="password"/>
        <button @click.prevent="login">Log in</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios/axios'
import store from '@/store/store'

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      const data = {
        email: this.email,
        password: this.password
      }
      axios.post('/auth/login', data)
      axios.post('/auth/login', data)
        .then(res => {
          this.$store.dispatch('authSet', res)
          this.$router.push({ name: 'home' })
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

#login{
  display: flex;
  justify-content: center;
  margin: 160px 0 20px;
  .form-div{
    display: flex;
    flex-direction: column;
    background-color: $box-bg-color1;
    height: 400px;
    width: 300px;

    box-shadow:
      0 2.8px 2.2px rgba($header-bg-color, 0.034),
      0 6.7px 5.3px rgba($header-bg-color, 0.048),
      0 12.5px 10px rgba($header-bg-color, 0.06),
      0 22.3px 17.9px rgba($header-bg-color, 0.072),
      0 41.8px 33.4px rgba($header-bg-color, 0.086),
      0 100px 80px rgba($header-bg-color, 0.12)

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
