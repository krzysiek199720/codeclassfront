<template>
  <div id="role-edit" v-if="loaded">
    <router-link tag="button" :to="{ name: 'settingsAdmin' }">Back to admin settings</router-link>
    <label for="name">Role name <input type="text" id="name" class="name" v-model="roleName"></label>
    <br> <!-- todo tmp -->
    <label for="isAdmin">Is admin role <input type="checkbox" id="isAdmin" class="isAdmin" v-model="isAdmin"></label>
    <hr> <!-- todo tmp -->
    <div class="permission-group" v-for="group in permissions" :key="group.groupName">
      <div class="permission-list">
        <div class="permission" v-for="perm in group.permissions" :key="perm.id">
          <label :for="'perm' + perm.id">{{perm.name}}<input type="checkbox" :id="'perm' + perm.id" :value="perm.id" v-model="selectedPermissions"></label>
        </div>
      </div>
    </div>
    <button class="save" @click="saveRole">Save</button>
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
      console.log('document.referrer')
      console.log(document.referrer)
      const x = router.go(-1)
      console.log(x)
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

<style scoped>

</style>
