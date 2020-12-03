<template>
  <div id="settings" v-if="loaded">
    <div class="settings">
      <div class="buttons">
        <button class="logout" @click="logoutAll">Log out all sessions</button>
        <button class="remove-account" @click="deleteAccount">Remove account</button>
      </div>
      <div class="controls">
        <div class="edit">
          <label for="email">New email<input type="text" id="email" class="email" v-model="newEmail.email"></label>
          <label for="passwordEmail">Password<input type="text" id="passwordEmail" class="password" v-model="newEmail.password"></label>
          <button class="save" @click="editEmail">Change email</button>
        </div>
        <div class="edit">
          <label for="passwordOld">Old password<input type="text" id="passwordOld" class="password" v-model="newPassword.oldPassword"></label>
          <label for="passwordNew">New password<input type="text" id="passwordNew" class="email" v-model="newPassword.newPassword"></label>
          <button class="save" @click="editPassword">Change password</button>
        </div>
      </div>
    </div>
    <div class="course-groups">
      <router-link tag="button" :to="{name: 'courseGroupSave', params:{id: null}}" v-if="$store.getters.authHasPermission('save_course_group')">Create course group</router-link>
      <div class="groups">
        <router-link tag="span" class="course-group" v-for="cg in courseGroups" :key="cg.id" :to="{name: 'courseGroup', params:{id: cg.id}}">{{cg.name}}</router-link>
      </div>
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

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200px;
  margin: 120px auto auto auto;
  color: $text-color;

  .settings{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    background-color: $header-bg-color;
    padding: 30px;
    border-radius: 5px;
  }

  .course-groups{
    margin-top:10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    background-color: $header-bg-color;
    padding: 30px;
    border-radius: 5px;

    button{
      width: 15%;
      height: 30px;
      color: $save-color;
      border-color: $save-color;
    }

    button:hover{
      color: $header-bg-color;
      background-color: $save-color;
    }
  }

  .groups{
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    .course-group{
      justify-self: center;
      padding: 2px 10px;
      margin: auto;
      cursor: pointer;
      border-bottom: rgba($input-color, 0.2) 1px solid;
    }
    .course-group:hover{
      border-color: rgba($input-color, 0.5)
    }
  }

  .buttons{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 15px 0 15px 15px;
    button{
      margin: 0 0 0 10px;
    }
  }

  .controls{
    display: grid;
    grid-template-columns: 1fr 1fr;

    .edit{
      border: $input-color 1px solid;
      padding:15px;
      display: flex;
      flex-direction: column;
    }

    .edit+.edit{
      margin-left:10px;
    }

    .save{
      width: 140px;
      height: 30px;
      color: $save-color;
      border-color: $save-color;
      margin-left:70%;
    }
    .save:hover{
      color: $header-bg-color;
      background-color: $save-color;
    }

    label{
      width: 90%;
      padding-right: 10px;
      cursor: default;
    }

    input{
      width: 100%;
      height: 30px;
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
  }

  .logout{
    width: 15%;
    height: 30px;
    color: $delete-color;
    border-color: $delete-color;
  }

  .logout:hover{
    color: $header-bg-color;
    background-color: $delete-color;
  }

  .remove-account{
    width: 15%;
    height: 30px;
    color: red;
    border-color: red;
  }

  .remove-account:hover{
    color: $header-bg-color;
    background-color: red;
  }
}

</style>
