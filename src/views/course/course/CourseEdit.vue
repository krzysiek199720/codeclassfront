<template>
  <div id="courseEdit" v-if="loaded">
    <div class="section data">
      <div class="title-container">
        <div class="title">Edit course</div>
        <div class="buttons">
          <router-link tag="button" :to="{name: 'courseEditData', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_course_data'])">Edit data</router-link>
          <router-link tag="button" :to="{name: 'quizEdit', params: { id: this.$route.params.id}}" class="edit-button" v-if="$store.getters.authHasPermissionAny(['save_quiz', 'delete_quiz'])">Edit quiz</router-link>
          <router-link tag="button" :to="{name: 'course', params: { id: this.$route.params.id}}" class="edit-button">Return to course</router-link>
        </div>
      </div>
      <div class="top">
        <div class="input-container">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="course.title">
        </div>
        <div class="input-container">
          <label for="group-order">Group order</label>
          <input type="number" id="group-order" v-model="course.groupOrder">
        </div>
      </div>
      <div class="boxes">
        <div class="input-container">
          <label for="complexity">Complexity</label>
          <div class="select">
            <select name="complexity" id="complexity" v-model="course.complexity" >
              <option v-for="com in complexityValues" :key="com" class="assimilation-option">{{com}}</option>
            </select>
          </div>
        </div>
        <div class="input-container">
          <label for="language">Language</label>
          <div class="select">
            <select name="language" id="language" v-model="course.language" >
              <option v-for="lang in languages" :key="lang.id" class="language-option" :value="lang">{{lang.name}}</option>
            </select>
          </div>
        </div>
        <div class="input-container">
          <label for="category">Category</label>
          <div class="select">
            <select name="category" id="category" v-model="course.category">
              <option v-for="cat in categories" :key="cat.id" class="category-option" :value="cat">{{cat.name}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="save" @click="saveDetails" v-if="$store.getters.authHasPermissionAny(['save_course'])">Save details</button>
      </div>
    </div>
    <div class="section links" v-if="$store.getters.authHasPermissionAny(['save_link'])">
      <div class="title-container">
        <div class="title">Edit useful links</div>
      </div>
      <div class="create">
        <div class="input-container">
          <label for="link-create-d">Displayed text</label>
          <input type="text" id="link-create-d" v-model="newLink.display">
        </div>
        <div class="input-container">
          <label for="link-create-l">Link</label>
          <input type="text" id="link-create-l" v-model="newLink.link">
        </div>
        <div class="button">
          <button class="save" @click="addLink">Add link</button>
        </div>
      </div>
      <div class="link" v-for="link in links" :key="link.id">
        <span class="link-d">{{link.display}} </span>
        <span class="link-l">{{link.link}}</span>
        <div class="button">
          <button class="remove" @click="removeLink(link)" v-if="$store.getters.authHasPermissionAny(['delete_link'])">Remove</button>
        </div>
      </div>
    </div>
    <div class="section files" v-if="$store.getters.authHasPermissionAny(['save_file'])">
      <div class="create">
        <div class="input-container">
          <label for="file-create-d">Displayed text</label>
          <input type="text" id="file-create-d" v-model="newFile.display">
        </div>
        <div class="input-container">
          <label for="file-create-l-text">File</label>
          <input type="text" id="file-create-l-text" v-model="fileName" disabled>
          <div class="hover">
            <input type="file" id="file-create-l" ref="file" @change="OnFileChange()">
            <div class="file-button">Choose file</div>
          </div>
        </div>
        <div class="button">
          <button class="save" @click="addFile">Add file</button>
        </div>
      </div>
      <div class="file" v-for="file in files" :key="file.id">
        <span class="file-d">{{file.display}}</span>
        <div></div>
        <div class="button">
          <button class="remove" @click="removeFile(file)" v-if="$store.getters.authHasPermissionAny(['delete_file'])">Remove</button>
        </div>
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
      fileName: '',
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
      this.fileName = this.newFile.file.name
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

#courseEdit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto 20px auto;

  .section {
    position: relative;
    background-color: $box-bg-color1;
    box-shadow: $box-shadow1;
    padding: 30px;
  }

  .button-container {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;

    .title {
      font-family: $font2;
      color: $text-color2;
      font-size: 20px;
    }

    .buttons {
      display: flex;
    }

    button + button {
      margin-left: 10px;
    }
  }

  .section + .section {
    margin-top: 20px;
  }

  button {
    color: $highlight-color;
    border-color: $highlight-color;
    height: 30px;

    &.remove {
      color: $unfollow-color;
      border-color: $delete-color;
    }
  }

  button:hover {
    color: $box-bg-color1;
    background-color: $highlight-color;

    &.remove {
      color: $box-bg-color1;
      background-color: $delete-color;
    }
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

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
    appearance: none;
    outline: 0;
    box-shadow: none;
    border: 0 !important;
    background: $box-bg-color2;
    background-image: none;
  }
  select::-ms-expand {
    display: none;
  }
  .select {
    margin-top: 10px;
    position: relative;
    display: flex;
    height: 30px;
    line-height: 3;
    overflow: hidden;
    &:hover select, select:focus {
      color: $highlight-color;
      background-color: $box-bg-color3;
      option {
        color: $text-color;
        background: $box-bg-color1;
      }
    }
  }

  select {
    width: 100%;
    padding: 0 .5em;
    color: $text-color;
    border-radius: 5px;
    cursor: pointer;
  }
  .select::after {
    content: '\25BC';
    position: absolute;
    overflow: hidden;
    font-size: 10px;
    color: $text-color2;
    cursor: pointer;
    pointer-events: none;
    -webkit-transition: .25s all ease;
    -o-transition: .25s all ease;
    transition: .25s all ease;
    right: 0;
    padding: 0 0.8em;
    height: 30px;
    border-radius: 5px;

  }
  .select:hover::after {
    color: $box-bg-color1;
  }

  .input-container{
    position: relative;
    display: flex;
    flex-direction: column;
    .hover{
      position: absolute;
      cursor: pointer;
      bottom: 2.5px;
      right: 0;
      display: flex;
      flex-direction: column;
      &:hover .file-button{
        color: $box-bg-color1;
        background-color: $highlight-color;
      }
    }
    .file-button{
      z-index: 1;
      cursor: pointer;
      position: absolute;
      bottom: 5.5px;
      font-family: $font2;
      font-size: 11px;
      border-radius: 10px;
      padding: 2.5px 30px;
      right: 10px;
      color: $highlight-color;
      border: 1px solid $highlight-color;
    }
    input[type=file]{
      z-index: 2;
      opacity: 0;
      margin: 0 5px;
      max-width: 135px;
      cursor: pointer;
    }
    input[type=file]::-webkit-file-upload-button{
      visibility: hidden;
    }
  }

  label {
    font-family: $font2;
    padding: 0;
    margin: 0;
    cursor: default;
  }

  .data {
    .top {
      margin: 20px 0 0;
      display: grid;
      grid-template-columns: 3fr 1fr;
      grid-column-gap: 20px;
    }

    .boxes {
      margin: 20px 0 0;
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1.2fr 1.2fr 1.2fr 2fr;
    }
  }

  .links {
    .create {
      margin: 27px 0 0;
      padding: 0 0 20px;
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 3fr 1fr;
      border-bottom: $box-border1;
    }

    .link {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 3fr 1fr;
      padding: 15px 0 0;
      align-items: center;

      .link-d {
        color: $highlight-color;
      }

      .link-l {
        padding-left: 10px;
      }
    }

    .button {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      max-width: 100px;
    }
  }

  .files {
    .create {
      margin: 27px 0 0;
      padding: 0 0 20px;
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 1fr 3fr 1fr;
      border-bottom: $box-border1;
    }

    .file {
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 3fr 1fr 1fr;
      padding: 15px 0 0;
      align-items: center;

      .file-d {
        color: $highlight-color;
      }
    }
    .button {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      max-width: 100px;
    }
  }
}
</style>
