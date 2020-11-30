<template>
  <div id="courseEdit" v-if="loaded">
    <div class="controlls">
      <router-link tag="button" :to="{name: 'courseEditData', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_course_data'])">Edit data</router-link>
      <router-link tag="button" :to="{name: 'quizEdit', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_quiz', 'delete_quiz'])">Edit quiz</router-link>
      <router-link tag="button" :to="{name: 'course', params: { id: this.$route.params.id}}" class="edit-button">Return to course</router-link>
    </div>
    <div class="data">
      <label for="title">Title: <input type="text" id="title" v-model="course.title"></label>
      <label for="group-order">Group order: <input type="number" id="group-order" v-model="course.groupOrder"></label>
      <label for="complexity">Complexity:
        <select name="complexity" id="complexity" v-model="course.complexity" >
          <option v-for="com in complexityValues" :key="com" class="assimilation-option">{{com}}</option>
        </select>
      </label>
      <label for="language">Language:
        <select name="language" id="language" v-model="course.language" >
          <option v-for="lang in languages" :key="lang.id" class="language-option" :value="lang">{{lang.name}}</option>
        </select>
      </label>
      <label for="category">Category:
        <select name="category" id="category" v-model="course.category">
          <option v-for="cat in categories" :key="cat.id" class="category-option" :value="cat">{{cat.name}}</option>
        </select>
      </label>
      <button class="save" @click="saveDetails" v-if="$store.getters.authHasPermissionAny(['save_course'])">Save details</button>
    </div>
    <div class="links">
      <template v-if="$store.getters.authHasPermissionAny(['save_link'])">
        <label for="link-create-d">Displayed text<input type="text" id="link-create-d" v-model="newLink.display"></label>
        <label for="link-create-l">Link<input type="text" id="link-create-l" v-model="newLink.link"></label>
        <button class="save" @click="addLink">Add link</button>
      </template>
      <div class="link" v-for="link in links" :key="link.id">
        <span class="link-d">{{link.display}}: </span>
        <span class="link-l">{{link.link}}</span>
        <button class="remove" @click="removeLink(link)" v-if="$store.getters.authHasPermissionAny(['delete_link'])">Remove</button>
      </div>
    </div>
    <div class="files">
      <template v-if="$store.getters.authHasPermissionAny(['save_file'])">
        <label for="link-create-d">Displayed text<input type="text" id="file-create-d" v-model="newFile.display"></label>
        <label for="link-create-l">File<input type="file" id="file-create-l" ref="file" @change="OnFileChange()"></label>
        <button class="save" @click="addFile">Add file</button>
      </template>
<!--      todo: -->
      <div class="file" v-for="file in files" :key="file.id">
        <span class="link-d">{{file.display}}</span>
        <button class="remove" @click="removeFile(file)" v-if="$store.getters.authHasPermissionAny(['delete_file'])">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'

export default {
  name: 'CourseEdit',
  data () {
    return {
      course: null,
      loaded: false,
      quiz: null,
      links: [],
      files: [],
      complexityValues: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      languages: [],
      categories: [],
      isNew: false,
      newLink: {
        display: null,
        link: null
      },
      newFile: {
        display: '',
        file: null
      }
    }
  },
  methods: {
    saveDetails () {
      const data = {
        categoryId: this.course.category.id,
        complexity: this.course.complexity,
        groupOrder: this.course.groupOrder,
        languageId: this.course.language.id,
        title: this.course.title
      }
      if (this.isNew) {
        axios.post('/course', data)
      } else {
        axios.put('/course/' + this.$route.params.id, data)
      }
    },
    addLink () {
      if (!this.$store.getters.authHasPermissionAny(['save_link'])) return
      axios.post('/course/' + this.$route.params.id + '/link', this.newLink)
        .then(res => {
          this.links.push(res.data)
        })
    },
    removeLink (link) {
      if (!this.$store.getters.authHasPermissionAny(['delete_link'])) return
      axios.delete('/course/link/' + link.id)
        .then(res => {
          const index = this.links.indexOf(link)
          this.links.splice(index, 1)
        })
    },
    OnFileChange () {
      this.newFile.file = this.$refs.file.files[0]
    },
    addFile () {
      if (!this.$store.getters.authHasPermissionAny(['save_file'])) return

      const formData = new FormData()
      formData.append('name', this.newFile.display)
      formData.append('file', this.newFile.file)

      axios.post('/course/' + this.$route.params.id + '/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.files.push(res.data)
        }).catch(_ => {
          console.log('failed to save file')
        })
    },
    removeFile (file) {
      if (!this.$store.getters.authHasPermissionAny(['delete_file'])) return
      axios.delete('/course/file/' + file.id)
        .then(res => {
          const index = this.files.indexOf(file)
          this.files.splice(index, 1)
        })
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id)
      .then(res => {
        this.course = res.data
        this.loaded = true
      })
      .catch(_ => {
        this.course = {
          category: null,
          complexity: 'BEGINNER',
          courseGroupResponse: null, // on create maybe pass this or ?
          groupOrder: 0,
          id: null,
          isAuthor: true,
          isFollowing: true,
          isPublished: null,
          language: null,
          title: ''
        }
        this.loaded = true
      })
    axios.get('/course/' + this.$route.params.id + '/quiz')
      .then(res => {
        this.quiz = res.data
      })
    axios.get('/course/' + this.$route.params.id + '/link')
      .then(res => {
        this.links = res.data
      })
    axios.get('/course/' + this.$route.params.id + '/file')
      .then(res => {
        this.files = res.data
      })
    axios.get('/course/category')
      .then(res => {
        this.categories = res.data
      })
    axios.get('/course/language')
      .then(res => {
        this.languages = res.data
      })
  }
}
</script>

<style scoped>

</style>
