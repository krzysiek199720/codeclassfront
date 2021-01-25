<template>
  <div id="settings" v-if="loaded">
    <div class="settings">
      <div class="buttons">
        <button class="logout" @click="logoutAll">Log out all sessions</button>
        <button class="remove-account" @click="deleteAccount">Remove account</button>
      </div>
      <div class="controls">
        <div class="edit">
          <div class="edit-title">Change email</div>
          <div class="input-box">
            <input placeholder="New email" type="text" id="email" class="email" v-model="newEmail.email">
            <input placeholder="Password" type="text" id="passwordEmail" class="password" v-model="newEmail.password">
          </div>
          <button class="save" @click="editEmail">Change email</button>
        </div>
        <div class="edit">
          <div class="edit-title">Change password</div>
          <div class="input-box">
            <input placeholder="Old password" type="text" id="passwordOld" class="password" v-model="newPassword.oldPassword">
            <input placeholder="New password" type="text" id="passwordNew" class="email" v-model="newPassword.newPassword">
          </div>
          <button class="save" @click="editPassword">Change password</button>
        </div>
      </div>
    </div>
    <div class="course-groups">
      <div class="title-container">
        <div class="title">Course groups</div>
        <router-link tag="button" :to="{name: 'courseGroupSave', params:{id: null}}" v-if="$store.getters.authHasPermission('save_course_group')">Create course group</router-link>
      </div>
      <div class="groups">
        <router-link tag="a" class="course-group" v-for="cg in courseGroups" :key="cg.id" :to="{name: 'courseGroup', params:{id: cg.id}}">
          <div class="course-group-name">{{cg.name}}</div>
        </router-link>
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
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto auto auto;

  .settings{
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }

  .course-groups{
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $box-bg-color1;
    padding: 30px;
    box-shadow: $box-shadow1;

    .title-container{
      display: flex;
      justify-content: space-between;
    }
    .title{
      font-family: $font2;
      color: $text-color2;
      font-size: 20px;
    }
    button{
      width: 200px;
      height: 30px;
      color: $save-color;
      border-color: $save-color;
    }

    button:hover{
      color: $box-bg-color1;
      background-color: $save-color;
    }
  }

  .groups{
    margin-top: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    .course-group{
      background-color: $box-bg-color1;
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      border-bottom: $box-border1;
    }
    .course-group:hover{
      background-color: $box-bg-color2;
    }
  }

  .buttons{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 10px;
    button{
      margin: 0 0 0 10px;
    }
  }

  .controls{
    display: grid;
    grid-template-columns: 1fr 1fr;

    .edit{
      padding: 30px 30px 30px 0;
      display: flex;
      flex-direction: column;
    }

    .edit+.edit{
      border-left: $box-border1;
      padding: 30px 0px 30px 30px;
    }

    .save{
      width: 140px;
      height: 30px;
      color: $save-color;
      border-color: $save-color;
      align-self: flex-end;
    }
    .save:hover{
      color: $box-bg-color1;
      background-color: $save-color;
    }

    .edit-title{
      color: $text-color2;
      font-family: $font2;
      font-size: 20px;
    }

    .input-box{
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }

    input{
      height: 30px;
      margin: 10px 0 10px 0;
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
    width: 200px;
    height: 30px;
    color: $highlight-color;
    border-color: $highlight-color;
  }

  .logout:hover{
    color: $box-bg-color1;
    background-color: $highlight-color;
  }

  .remove-account{
    width: 200px;
    height: 30px;
    color: $delete-color;
    border-color: $delete-color;
  }

  .remove-account:hover{
    color: $box-bg-color1;
    background-color: $delete-color;
  }
}

</style>
