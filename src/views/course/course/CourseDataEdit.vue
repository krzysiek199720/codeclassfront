<template>
  <div id="quizEdit" v-if="loaded">
    sdjkgbjisdfbgasdfji
    <router-link tag="button" :to="{name:'courseEdit', params: {id: this.$route.params.id}}">Back to course edit</router-link>
    <button class="save" @click="save">Save</button>
    <button class="save" @click="preview">Preview</button>
    <div class="edit-container">
      <div class="editor">
<!--        just put string for now / make a editor component later-->
        <button class="insert" @click="insertCode()">&lt;code&gt;</button>
        <button class="insert" @click="insertLine()">&lt;line&gt;</button>
        <button class="insert" @click="insertElement()">&lt;element&gt;</button>
        <textarea name="dataraw" id="dataraw" cols="30" rows="20" v-model="dataRaw" ref="dataraw" accept-charset="utf-8"></textarea>
      </div>
      <div class="result">
        <courseData class="coursedata" :showComments="false" :usePropsData="false" :propsData="data"></courseData>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import CourseData from '@/components/course/CourseData'
import store from '@/store/store'

export default {
  name: 'CourseDataEdit',
  data () {
    return {
      loadD: false,
      loadDR: false,
      dataRaw: null,
      data: null
    }
  },
  computed: {
    loaded () { return this.loadD && this.loadDR }
  },
  methods: {
    save () {
      axios.post('/course/' + this.$route.params.id + '/data', this.dataRaw)
        .then(res => {
          this.$router.push({ name: 'courseEdit', props: { id: this.$route.params.id } })
        })
        .catch(_ => {})
    },
    preview () {
      axios.post('/course/data/check', { data: this.dataRaw })
        .then(res => {
          this.data = res.data
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
      console.log(pos, text)
      const ta = this.$refs.dataraw
      const taval = ta.value
      ta.value = taval.slice(0, pos) + text + taval.slice(pos)
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

<style scoped>

</style>
