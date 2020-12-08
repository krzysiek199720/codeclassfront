<template>
  <div id="course-data-edit" v-if="loaded">
    <div class="section controls">
      <router-link tag="button" :to="{name:'courseEdit', params: {id: this.$route.params.id}}">Back to course edit</router-link>
      <button class="save" @click="save">Save</button>
      <button class="save" @click="preview">Preview</button>
    </div>
    <div class="section edit-container">
      <div class="editor">
        <div class="buttons">
          <button class="insert" @click="insertCode()">&lt;code&gt;</button>
          <button class="insert" @click="insertLine()">&lt;line&gt;</button>
          <button class="insert" @click="insertElement()">&lt;element&gt;</button>
        </div>
        <textarea name="dataraw" id="dataraw" :cols="cols" :rows="rows" v-model="dataRaw" ref="dataraw" @input="resizeIt" @keydown.tab="tabInsert" accept-charset="utf-8"></textarea>
      </div>
      <div class="result">
        <courseData class="coursedata" v-if="showPreview" :showComments="false" :usePropsData="true" :propsData="data"></courseData>
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
      loadD: false,
      loadDR: false,
      dataRaw: null,
      data: null,
      rowsMin: 20,
      rows: 1,
      cols: 100,
      showPreview: true
    }
  },
  computed: {
    loaded () { return this.loadD && this.loadDR }
  },
  methods: {
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
      const cols = this.cols

      let linecount = 0
      this.dataRaw.split('\n').forEach(function (l) {
        if (l.length === 0) {
          linecount += 1
          return
        }
        linecount += Math.ceil(l.length / (cols - 1)) // Take into account long lines
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
  },
  beforeRouteEnter: (to, from, next) => {
    next(store.getters.authHasPermission('save_course_data'))
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#course-data-edit {
  width: 1600px;

  margin: 120px auto auto auto;
  color: $text-color;

  display: flex;
  flex-direction: column;
  justify-content: center;

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

  .controls{

    button+button{
      margin-left:10px;
    }
  }

  .insert{
    width: 100px;
    height: 20px;
    color: $save-color;
    border-color: $save-color;
  }
  .insert:hover{
    color: $header-bg-color;
    background-color: $save-color;
  }

  .section{
    background-color: $header-bg-color;
    padding: 30px;
    border-radius: 5px;

    &>div{
      padding:10px;
    }
  }
  .section+.section{
    margin-top: 10px;
  }

  .edit-container{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .buttons{
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
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

    background-color: rgba($secondary-color, 0.4);
    border: 0;
    color: $text-color;
  }
}
</style>
