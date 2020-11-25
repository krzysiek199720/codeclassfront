<template>
  <div id="admin-settings" v-if="loaded">
    <div class="language-settings" v-if="$store.getters.authHasPermissionAny(['save_language', 'delete_language'])">
      <div class="lang-add" v-if="$store.getters.authHasPermission('save_language')">
        <label for="language"><input type="text" id="language" v-model="newLang"></label>
        <button class="save" @click="addLanguage">Add language</button>
      </div>
      <template v-for="(l, index) in languages">
        <div class="lang" :key="l.id">
          <input v-model="languages[index].name">
          <button class="save" @click="saveLanguage(l)" v-if="$store.getters.authHasPermission('save_language')">Edit language</button>
          <button class="delete" @click="deleteLanguage(l)" v-if="$store.getters.authHasPermission('delete_language')">Delete language</button>
        </div>
      </template>
    </div>
    <div class="category-settings" v-if="$store.getters.authHasPermissionAny(['save_category', 'delete_category'])">
      <div class="cat-add" v-if="$store.getters.authHasPermission('save_category')">
        <label for="category"><input type="text" id="category" v-model="newLang"></label>
        <button class="save" @click="addLanguage">Add category</button>
      </div>
      <template v-for="(c, index) in categories">
        <div class="cat" :key="c.id">
          <input v-model="categories[index].name">
          <button class="save" @click="saveCategory(c)" v-if="$store.getters.authHasPermission('save_category')">Edit category</button>
          <button class="delete" @click="deleteCategory(c)" v-if="$store.getters.authHasPermission('delete_category')">Delete category</button>
        </div>
      </template>
    </div>
    <div class="role-settings" v-if="$store.getters.authHasPermission('get_role')">
      <router-link tag="button" :to="{name: 'roleEdit', params: {id: null}}" class="new-role" v-if="$store.getters.authHasPermission('save_role')">New role</router-link>
      <template v-for="role in roles">
        <div class="role" :key="role.id">
          <span class="role-name">{{role.name}}</span>
          <router-link tag="button" :to="{name: 'roleEdit', params: {id: role.id}}" v-if="$store.getters.authHasPermission('save_role')">Edit</router-link>
          <button class="delete" v-if="$store.getters.authHasPermission('delete_role')">Delete role</button>
        </div>
      </template>
    </div>
    <div class="user-settings" v-if="$store.getters.authHasPermission('update_role_user')"></div> <!-- maybe new component -->
  </div>
</template>

<script>
import axios from '@/axios/axios'

export default {
  name: 'AdminSettings',
  data () {
    return {
      langLoad: false,
      catLoad: false,
      roleLoad: false,
      languages: [],
      categories: [],
      roles: [],
      newLang: null,
      newCat: null
    }
  },
  computed: {
    loaded () {
      return this.langLoad && this.catLoad && this.roleLoad
    }
  },
  methods: {
    addLanguage () {
      const data = {
        name: this.newLang
      }
      axios.post('/course/language', data)
        .then(res => {
          this.languages.push(res.data)
        })
    },
    saveLanguage (lang) {
      const data = {
        name: lang.name
      }
      axios.put('/course/language/' + lang.id, data)
        .then(res => {
          lang = res.data
        })
    },
    deleteLanguage (lang) {
      axios.delete('/course/category/' + lang.id)
        .then(res => {
          const index = this.categories.indexOf(lang)
          this.languages.splice(index, 1)
        })
    },
    addCategory () {
      const data = {
        name: this.newCat
      }
      axios.post('/course/category', data)
        .then(res => {
          this.languages.push(res.data)
        })
    },
    saveCategory (cat) {
      const data = {
        name: cat.name
      }
      axios.put('/course/category/' + cat.id, data)
        .then(res => {
          cat = res.data
        })
    },
    deleteCategory (cat) {
      axios.delete('/course/category/' + cat.id)
        .then(res => {
          const index = this.categories.indexOf(cat)
          this.categories.splice(index, 1)
        })
    }
  },
  async created () {
    axios.get('/course/language')
      .then(res => {
        this.languages = res.data
        this.langLoad = true
      })
    axios.get('/course/category')
      .then(res => {
        this.categories = res.data
        this.catLoad = true
      })

    axios.get('/auth/role')
      .then(res => {
        this.roles = res.data
        this.roleLoad = true
      })
  }
}
</script>

<style scoped>

</style>
