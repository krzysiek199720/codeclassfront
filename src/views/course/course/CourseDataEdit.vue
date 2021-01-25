<template>
  <div id="course-data-edit" v-if="loaded">
    <div class="section">
      <div class="title-container">
        <div class="title">Edit data</div>
        <div class="buttons">
          <router-link tag="button" :to="{name:'courseEdit', params: {id: this.$route.params.id}}">Back to course edit</router-link>
          <button class="save" @click="save">Save</button>
          <button class="save" @click="preview">Preview</button>
        </div>
      </div>
      <div class="image-settings">
        <div class="title-container">
          <div class="title">Images</div>
        </div>
        <div class="new-image">
          <div class="input-container">
            <label for="file-create-d">ID</label>
            <input type="text" id="file-create-d" v-model="newImage.localId">
          </div>
          <div class="input-container">
            <label for="file-create-l-text">File</label>
            <input type="text" id="file-create-l-text" v-model="fileName" disabled>
            <div class="hover">
              <input type="file" id="file-create-l" ref="file" @change="OnFileChange()">
              <div class="file-button">Choose file</div>
            </div>
          </div>
          <div class="button-container">
            <button class="save" @click="addImage()">Add image</button>
          </div>
        </div>
        <div class="image-container">
          <template v-for="i in images">
            <div class="bottom-section" :key="i.localId">
              <div class="text-container">
                <span class="image-name">{{i.localId}}</span>
              </div>
              <div class="button-container">
                <button class="remove" @click="removeImage(i)">Delete image</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="title-container">
        <div class="title">Code</div>
      </div>
      <div class="edit-container">
        <div class="editor">
          <div class="multimedia">
            <button class="insert" @click="insertCode()">&lt;code&gt;</button>
            <button class="insert" @click="insertLine()">&lt;line&gt;</button>
            <button class="insert" @click="insertElement()">&lt;element&gt;</button>
            <button class="insert" @click="insertImage()">&lt;image&gt;</button>
          </div>
          <span class="error">{{errorMessage}}</span>
          <div class="editor-text-container">
            <div class="editor-text">
              <div class="left">
                <div class="rowCell" v-for="x in rows" :class="{'error-row': errorRow === x}">{{x}}</div>
              </div>
              <textarea name="dataraw" id="dataraw" :rows="rows" v-model="dataRaw" ref="dataraw" @input="resizeIt" @keydown.tab="tabInsert" accept-charset="utf-8"></textarea>
            </div>
          </div>
        </div>
        <div class="result">
          <courseData class="coursedata" v-if="showPreview" :showComments="false" :usePropsData="true" :propsData="data"></courseData>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import CourseData from '@/components/course/CourseData'
import store from '@/store/store'
import { eventBus } from '@/main'

export default {
  name: 'CourseDataEdit',
  data () {
    return {
      fileName: '',
      loadD: false,
      loadDR: false,
      dataRaw: null,
      data: null,
      rowsMin: 20,
      rows: 1,
      showPreview: true,
      newImage: {},
      images: [],
      errorRow: null,
      errorMessage: ''
    }
  },
  computed: {
    loaded () { return this.loadD && this.loadDR }
  },
  methods: {
    OnFileChange () {
      this.newImage.file = this.$refs.file.files[0]
      this.fileName = this.newImage.file.name
    },
    addImage () {
      const formData = new FormData()
      formData.append('image', this.newImage.localId)
      formData.append('file', this.newImage.file)

      axios.post('/course/' + this.$route.params.id + '/data/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.images.push(res.data)
          this.newImage = {}
        }).catch(_ => {
          console.log('failed to save image')
        })
    },
    removeImage (image) {
      axios.delete('/course/' + this.$route.params.id + '/data/image/' + image.localId)
        .then(res => {
          const index = this.images.indexOf(image)
          this.images.splice(index, 1)
        })
    },
    save () {
      axios.post('/course/' + this.$route.params.id + '/data', { data: this.dataRaw })
        .then(res => {
          this.$router.push({ name: 'courseEdit', props: { id: this.$route.params.id } })
        })
        .catch(_ => {})
    },
    preview () {
      this.showPreview = false
      axios.post('/course/data/check', { data: this.dataRaw })
        .then(res => {
          this.data = res.data
          this.showPreview = true
          this.errorRow = null
          this.errorMessage = ''
        })
        .catch(err => {
          console.log(err.response)
          this.errorMessage = err.response.data.error
          if (err.response.data.errorPlace) {
            let characters = 0
            const lines = this.dataRaw.split('\n')
            for (let i = 0; i < lines.length; ++i) {
              characters += lines[i].length
              if (characters >= err.response.data.errorPlace) {
                this.errorRow = i
                return
              }
            }
            this.errorRow = null
          }
        })
    },
    insertCode () {
      this.insertBlock('<code>', '</code>')
    },
    insertLine () {
      this.insertBlock('<line indent="">', '</line>')
    },
    insertElement () {
      this.insertBlock('<element desc="">', '</element>')
    },
    insertImage () {
      this.insertBlock('<image id="">', '')
    },
    insertBlock (insertHead, insertTail) {
      // insert head and tail on cursor
      // if a selection - contain it between
      const ta = this.$refs.dataraw
      let startPos = ta.selectionStart
      let endPos = ta.selectionEnd

      if (startPos === endPos) {
        this.insert(startPos, insertHead + insertTail)
        startPos += (insertHead + insertTail).length
        endPos += (insertHead + insertTail).length
      } else {
        this.insert(startPos, insertHead)
        startPos += insertHead.length
        endPos += insertHead.length
        this.insert(endPos, insertTail)
      }
      ta.selectionStart = startPos
      ta.selectionEnd = endPos
      ta.focus()
    },
    insert (pos, text) {
      console.log('insert')
      const ta = this.$refs.dataraw
      const taval = ta.value
      ta.value = taval.slice(0, pos) + text + taval.slice(pos)
    },
    resizeIt () {
      let linecount = 0
      this.dataRaw.split('\n').forEach(function (l) {
        linecount += 1
      })
      this.rows = Math.max(this.rowsMin, linecount + 1)
    },
    tabInsert (event) {
      event.preventDefault()
      console.log('tabinser')
      const ta = this.$refs.dataraw
      const startPos = ta.selectionStart
      const endPos = ta.selectionEnd

      const tabReplacement = '  '

      let newData = this.dataRaw.substr(0, startPos)
      const newDataEnd = this.dataRaw.substr(endPos)
      newData += tabReplacement + newDataEnd
      this.dataRaw = newData

      ta.selectionStart = startPos + tabReplacement.length
      ta.selectionEnd = startPos + tabReplacement.length
      ta.focus()
    }
  },
  components: {
    CourseData
  },
  created () {
    axios.get('/course/' + this.$route.params.id + '/data')
      .then(res => {
        this.data = res.data
        this.loadD = true
      })
      .catch(_ => {
        this.loadD = true
      })
    axios.get('/course/' + this.$route.params.id + '/data/raw')
      .then(res => {
        this.dataRaw = res.data
        console.log('sssssss')
        this.resizeIt()
        this.loadDR = true
      })
      .catch(_ => {
        this.loadDR = true
      })
    axios.get('/course/' + this.$route.params.id + '/data/image')
      .then(res => {
        this.images = res.data
      })
  },
  beforeRouteEnter: (to, from, next) => {
    next(store.getters.authHasPermission('save_course_data'))
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#course-data-edit {
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
  .image-settings{
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  .image-container{
    display: flex;
    flex-direction: column;
    .bottom-section{
      margin-top: 20px;
      display: grid;
      grid-column-gap: 20px;
      grid-template-columns: 2fr 4fr 3fr;
    }
    .bottom-section + .bottom-section{
      margin-top: 10px;
    }
  }

  .new-image{
    padding: 0;
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 2fr 4fr 3fr;
    margin: 20px 0 0;
    .button-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      max-width: 100px;
    }
  }

  .insert{
    width: 100px;
    height: 20px;
    color: $save-color;
    border-color: $save-color;
  }
  .insert:hover{
    color: $box-bg-color1;
    background-color: $save-color;
  }

  .edit-container{
    margin-top: 20px;
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 3fr 2fr;
  }

  .editor{
    display: flex;
    flex-direction: column;
    .error {
      color: $error-color;
      margin: 5px 0 -15px;
    }
  }

  .multimedia{
    display: flex;
    flex-direction: row;
    justify-content: center;

    button+button{
      margin-left: 10px;
    }
  }

  #insert{
    width: 100%;
  }

  #dataraw{
    resize: none;
    outline: 0;

    font-family: 'JetBrains Mono';
    width: 100%;
    background-color: $box-bg-color2;
    border: 0;
    color: $text-color;
    overflow-x: scroll;
    white-space: nowrap;
    word-break: keep-all;
    overflow-wrap: unset;
  }

  .editor-text{
    font-family: 'JetBrains Mono';
    font-size: 13.3333px;
    display: flex;
    flex-direction: row;
    .left{
      background-color: $box-bg-color3;
      display: flex;
      flex-direction: column;
      width: 1.7em;
      padding: 2px 0.1em;
      .rowCell{

      }
      .error-row{
        background-color: $error-color!important;
        margin-left: -10px;
        margin-right: -0.1em;

      }
    }
  }

  .editor-text-container{
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
}
</style>
