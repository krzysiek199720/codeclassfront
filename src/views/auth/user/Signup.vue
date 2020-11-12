<template>
  <div id="signup">
    <div class="form-div">
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
        <button @click.prevent="login">Log in</button>
      </form>
    </div>
  </div>
</template>

<script>
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
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        passwod: this.password
      }
      console.log(data)
    //  todo: send signup
    }
  }
}
</script>

<style scoped>

</style>
