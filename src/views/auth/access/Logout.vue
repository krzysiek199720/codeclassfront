<template>
  <div id="logout"></div>
</template>

<script>
import axios from '../../../axios/axios'

export default {
  name: 'logout',
  beforeMount () {
    if (!this.$store.getters.authIsAuthenticated) { this.$router.push({ name: 'home' }); return }
    axios.get('/auth/logout')
      .then(res => {
        this.$store.dispatch('authLogout')
        this.$router.push({ name: 'home' })
      })
  }
}
</script>
