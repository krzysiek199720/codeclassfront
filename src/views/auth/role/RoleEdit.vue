<template>
  <div id="role-edit" v-if="loaded">
    <div class="container">
      <div class="title-container">
        <div v-if="$route.params.id !== null" class="title">Edit role</div>
        <div v-else class="title">Create role</div>
        <router-link class="back-button" tag="button" :to="{ name: 'settingsAdmin' }">Back to admin settings</router-link>
      </div>
      <div class="top-container">
        <div class="input-box">
          <input placeholder="Name" type="text" id="name" class="name" v-model="roleName">
        </div>
        <div class="permission-check">
          <label for="isAdmin">Is admin role <input type="checkbox" id="isAdmin" class="isAdmin" v-model="isAdmin"><span class="checkmark"></span></label>
        </div>
      </div>
      <div class="bottom-container">
        <div class="permission-group" v-for="group in permissions" :key="group.groupName">
          <div class="permission-list">
            <div class="permission-check" v-for="perm in group.permissions" :key="perm.id">
              <label :for="'perm' + perm.id">{{perm.name}}<input type="checkbox" :id="'perm' + perm.id" :value="perm.id" v-model="selectedPermissions"><span class="checkmark"></span></label>
            </div>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="save-button" @click="saveRole">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import store from '@/store/store'
import router from '@/router/router'

export default {
  name: 'RoleEdit',
  data () {
    return {
      loadedPermissions: false,
      loadedRole: false,
      roleId: this.$route.params.id,
      permissions: [],
      selectedPermissions: [],
      roleName: '',
      isAdmin: false
    }
  },
  computed: {
    loaded () { return this.loadedPermissions && this.loadedRole }
  },
  methods: {
    saveRole () {
      const data = {
        name: this.roleName,
        isAdmin: this.isAdmin,
        permissions: this.selectedPermissions
      }
      if (this.roleId === null) {
        axios.post('/auth/role', data)
          .then(res => {
            this.$router.push({ name: 'settingsAdmin' })
          })
      } else {
        axios.put('/auth/role/' + this.roleId, data)
          .then(res => {
            this.$router.push({ name: 'settingsAdmin' })
          })
      }
    }
  },

  created () {
    if (!(store.getters.authHasPermission('get_role') && store.getters.authHasPermission('save_role'))) {
      router.go(-1)
    }

    axios.get('/auth/permissions')
      .then(res => {
        this.permissions = res.data
        this.loadedPermissions = true
      })
    if (this.roleId === null) {
      this.loadedRole = true
    } else {
      axios.get('/auth/role/' + this.roleId)
        .then(res => {
          this.selectedPermissions = res.data.permissions.map(x => x.id)
          this.roleName = res.data.name
          this.isAdmin = res.data.isAdmin
          this.loadedRole = true
        })
    }
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#role-edit{
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto 20px auto;
  .container{
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }
  .title-container{
    display: flex;
    justify-content: space-between;
  }
  .title{
    font-family: $font2;
    color: $text-color2;
    font-size: 20px;
  }
  .back-button{
    width: 200px;
    height: 30px;
    color: $delete-color;
    border-color: $delete-color;
  }
  .back-button:hover{
    color: $box-bg-color1;
    background-color: $delete-color;
  }
  .save-button{
    width: 200px;
    height: 30px;
    color: $save-color;
    border-color: $save-color;
  }
  .save-button:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }
  .top-container{
    display: flex;
    flex-direction: column;
    border-bottom: $box-border1;
  }
  .input-box{
    display: flex;
    flex-direction: column;
    width: 200px;
  }
  input{
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
  label{
    padding: 5px 5px 5px 30px;
    font-size: 16px;
    font-family: $font2;
    margin: 0;
  }
  .permission-check{
    padding: 10px 0;

    /* Hide the browser's default checkbox */
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    /* Create a custom checkbox */
    .checkmark {
      position: absolute;
      top: 5px;
      left: 5px;
      height: 16px;
      width: 16px;
      background-color: $highlight-color;
    }
    ///* On mouse-over, add a grey background color */
    //&:hover input ~ .checkmark {
    //  background-color: $text-color;
    //}
    /* When the checkbox is checked, add a blue background */
    input:checked ~ .checkmark {
      background-color: $highlight-color;
    }
    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    /* Show the checkmark when checked */
    input:checked ~ .checkmark:after {
      display: block;
    }
    /* Style the checkmark/indicator */
    .checkmark:after {
      left: 5px;
      top: 2px;
      width: 3px;
      height: 7px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
  .bottom-container{
    display: flex;
    flex-flow: row wrap;
    margin: 0 -10px;
  }
  .permission-group {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    width: calc(33.3% - 20px);
    border-bottom: $box-border1;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    padding: 20px 0 0;
    justify-content: flex-end;
  }

}

</style>
