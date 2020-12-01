<template>
  <div id="settings" v-if="loaded">
    <button class="logout" @click="logoutAll">Log out all sessions</button>
    <div class="controlls">
      <div class="edit">
        <label for="email">New email<input type="text" id="email" class="email" v-model="newEmail.email"></label>
        <label for="passwordEmail">Password<input type="text" id="passwordEmail" class="password" v-model="newEmail.password"></label>
        <button class="save" @click="editEmail">Change email</button>
      </div>
      <div class="edit">
        <label for="passwordNew">New password<input type="text" id="passwordNew" class="email" v-model="newPassword.newPassword"></label>
        <label for="passwordOld">Old password<input type="text" id="passwordOld" class="password" v-model="newPassword.oldPassword"></label>
        <button class="save" @click="editPassword">Change password</button>
      </div>
      <button class="remove-account" @click="deleteAccount">Remove account</button>
    </div>
    <div class="course-groups">
      <router-link tag="button" :to="{name: 'courseGroupSave', params:{id: null}}" v-if="$store.getters.authHasPermission('save_course_group')">Create course group</router-link>
      <router-link tag="span" class="course-group" v-for="cg in courseGroups" :key="cg.id" :to="{name: 'courseGroup', params:{id: cg.id}}">{{cg.name}}</router-link>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import store from '@/store/store'

export default {
  name: 'UserSettings',
  data () {
    return {
      loaded: false,
      courseGroups: null,
      newEmail: {
        email: null,
        password: null
      },
      newPassword: {
        newPassword: null,
        oldPassword: null
      }
    }
  },
  methods: {
    deleteAccount () {
      if (confirm('Do you really wish to delete your account?')) {
        axios.delete('/user/' + this.$store.getters.authUserId)
          .then(_ => {
            this.$store.dispatch('authLogout')
            this.$router.push({ name: 'home' })
          })
      }
    },
    logoutAll () {
      // only logout and route if server responded,
      // if response was positive - you were loggedd out
      // if not - you were never logged in a first place (or your token says so)
      axios.get('/auth/logout/all')
        .then(_ => {
          this.$store.dispatch('authLogout')
          this.$router.push({ name: 'home' })
        })
        .catch(_ => {
          this.$store.dispatch('authLogout')
          this.$router.push({ name: 'home' })
        })
    },
    editEmail () {
      axios.put('/user/' + this.$store.getters.authUserId + '/email', this.newEmail)
        .then(_ => {
          this.newEmail = {
            email: null,
            password: null
          }
        })
    },
    editPassword () {
      axios.put('/user/' + this.$store.getters.authUserId + '/password', this.newPassword)
        .then(_ => {
          this.newPassword = {
            newPassword: null,
            oldPassword: null
          }
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('before rouite')
    if (!store.getters.authIsAuthenticated) { next({ name: 'login' }) }
    next()
  },
  created () {
    axios.get('/course/group/user')
      .then(res => {
        this.courseGroups = res.data
        this.loaded = true
      })
  }
}
</script>

<style scoped>

</style>
