<template>
  <div id="courseEdit" v-if="loaded">
    <div class="section controls">
      <router-link tag="button" :to="{name: 'courseEditData', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_course_data'])">Edit data</router-link>
      <router-link tag="button" :to="{name: 'quizEdit', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_quiz', 'delete_quiz'])">Edit quiz</router-link>
      <router-link tag="button" :to="{name: 'course', params: { id: this.$route.params.id}}" class="edit-button">Return to course</router-link>
    </div>
    <div class="section data">
      <div class="top">
        <label for="title">Title: <input type="text" id="title" v-model="course.title"></label>
        <label for="group-order">Group order: <input type="number" id="group-order" v-model="course.groupOrder"></label>
      </div>
      <div class="boxes">
        <label for="complexity">Complexity:
          <div class="select">
            <select name="complexity" id="complexity" v-model="course.complexity" >
              <option v-for="com in complexityValues" :key="com" class="assimilation-option">{{com}}</option>
            </select>
          </div>
        </label>
        <label for="language">Language:
          <div class="select">
            <select name="language" id="language" v-model="course.language" >
              <option v-for="lang in languages" :key="lang.id" class="language-option" :value="lang">{{lang.name}}</option>
            </select>
          </div>
        </label>
        <label for="category">Category:
          <div class="select">
            <select name="category" id="category" v-model="course.category">
              <option v-for="cat in categories" :key="cat.id" class="category-option" :value="cat">{{cat.name}}</option>
            </select>
          </div>
        </label>
      </div>
      <button class="save" @click="saveDetails" v-if="$store.getters.authHasPermissionAny(['save_course'])">Save details</button>
    </div>
    <div class="section links" v-if="$store.getters.authHasPermissionAny(['save_link'])">
      <div class="create">
        <label for="link-create-d">Displayed text<input type="text" id="link-create-d" v-model="newLink.display"></label>
        <label for="link-create-l">Link<input type="text" id="link-create-l" v-model="newLink.link"></label>
        <button class="save" @click="addLink">Add link</button>
      </div>
      <div class="link" v-for="link in links" :key="link.id">
        <span class="link-d">{{link.display}} </span>
        <span class="link-l">{{link.link}}</span>
        <button class="remove" @click="removeLink(link)" v-if="$store.getters.authHasPermissionAny(['delete_link'])">Remove</button>
      </div>
    </div>
    <div class="section files" v-if="$store.getters.authHasPermissionAny(['save_file'])">
      <div class="create">
        <label for="file-create-d">Displayed text<input type="text" id="file-create-d" v-model="newFile.display"></label>
        <label for="file-create-l">File<input type="file" id="file-create-l" ref="file" @change="OnFileChange()"></label>
        <button class="save" @click="addFile">Add file</button>
      </div>
      <div class="file" v-for="file in files" :key="file.id">
        <span class="file-d">{{file.display}}</span>
        <button class="remove" @click="removeFile(file)" v-if="$store.getters.authHasPermissionAny(['delete_file'])">Remove</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import store from '@/store/store'

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
  },
  beforeRouteEnter: (to, from, next) => {
    next(store.getters.authHasPermissionAny(['save_course', 'delete_course']))
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#courseEdit{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1200px;
  margin: 120px auto auto auto;
  color: $text-color;

  .section{
    background-color: $header-bg-color;
    padding: 30px;
    border-radius: 5px;
  }
  .section+.section{
    margin-top: 10px;
  }

  .controls{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 3fr;
  }
}

button{
  width: 140px;
  height: 30px;
  color: $save-color;
  border-color: $save-color;
}
button:hover{
  color: $header-bg-color;
  background-color: $save-color;
}

input{
  width: 100%;
  height: 30px;
  color: $input-color;
  border: 0;
  border-bottom: 1px solid $input-color;
  background-color: transparent;
  margin: 0 auto;
  outline: 0;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  box-shadow: none;
  border: 0 !important;
  background: $primary-color;
  background-image: none;
}
select::-ms-expand {
  display: none;
}
.select {
  position: relative;
  display: flex;
  width: 100%;
  height: 30px;
  line-height: 3;
  background: $primary-color;
  overflow: hidden;
  border-radius: .25em;
}

select {
  flex: 1;
  padding: 0 .5em;
  color: $text-color;
  cursor: pointer;
}
.select::after {
  content: '\25BC';
  position: absolute;
  top: -0.5em;
  right: 0;
  padding: 0 0.5em;
  background: $primary-color;
  color: $secondary-color;
  cursor: pointer;
  pointer-events: none;
  -webkit-transition: .25s all ease;
  -o-transition: .25s all ease;
  transition: .25s all ease;
}
.select:hover::after {
  color: $text-color;
}

.data{
  label{
    padding: 0
  }
  label+label{
    padding-left: 10px;
  }
  .top{
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
  .boxes{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.remove{
  color: $delete-color;
  border-color: $delete-color;
}
.remove:hover{
  color: $header-bg-color;
  background-color: $delete-color;
}

.links{
  label+label{
    padding-left: 10px;
  }
  .create{
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    border-bottom: rgba($text-color, 0.4) 1px solid;
    padding-bottom: 10px;
    margin-bottom: 10px;
    align-items: center;
    button{
      justify-self: center;
    }
  }
  .link{
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    padding: 7px 0;
    align-items: center;
    button{
      justify-self: center;
    }

    .link-d{
      color: $highlight-color;
    }
    .link-l{
      padding-left: 10px;
    }
  }
}

.files{
  label+label{
    padding-left: 10px;
  }
  .create{
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    border-bottom: rgba($text-color, 0.4) 1px solid;
    padding-bottom: 10px;
    margin-bottom: 10px;
    align-items: center;
    button{
      justify-self: center;
    }
  }
  .file{
    display: grid;
    grid-template-columns: 2fr 1fr;
    padding: 7px 0;
    align-items: center;
    margin: 0 20%;

    .file-d{
      color: $highlight-color;
    }
    button{
      justify-self: end;
    }
  }
}
</style>
