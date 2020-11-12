<template>
  <div id="login">
    <div class="form-div">
      <form>
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
        passwod: this.password
      }
      console.log(data)
    //  todo: send login
    }
  }
}
</script>

<style scoped>

</style>
