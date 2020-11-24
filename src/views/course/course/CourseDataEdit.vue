<template>
  <div id="quizEdit" v-if="loaded">
    <router-link tag="button" :to="{name:'courseEdit', params: {id: this.$route.params.id}}">Back to course edit</router-link>
    <button class="save" @click="save">Save</button>
    <button class="save" @click="preview">Preview</button>
    <div class="edit-container">
      <div class="editor">
<!--        just put string for now / make a editor component later-->
        <textarea name="dataraw" id="dataraw" cols="30" rows="20" v-model="dataRaw" accept-charset="utf-8"></textarea>
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
      console.log(this.dataRaw)
      axios.post('/course/data/check', { data: this.dataRaw })
        .then(res => {
          this.data = res.data
        })
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
  }
}
</script>

<style scoped>

</style>
