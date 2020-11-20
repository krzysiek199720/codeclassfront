<template>
  <div class="course-data" v-if="loaded">
    <div class="data-section" >
      <component
        v-for="(fordata, index) in data"
        :key="fordata.id"
        :is="fordata.type === 'CODE' ? 'dataCode' : 'dataText'"
        :data="data[index]"></component>
    </div>
    <div class="code-comments">
      <dataComment></dataComment>
    </div>
  </div>
</template>

<script>
import axios from '../../axios/axios'

import dataText from '@/components/course/data/dataText'
import dataCode from '@/components/course/data/code/dataCode'
import dataComment from '@/components/course/data/dataComment'

export default {
  name: 'CourseData',
  data () {
    return {
      data: null,
      loaded: false
    }
  },
  props: ['courseId'], // maybe add comments to show there on click, dunno yet
  components: {
    dataText,
    dataCode,
    dataComment
  },
  created () {
    axios.get('/course/' + this.courseId + '/data')
      .then(res => {
        this.data = res.data.sort((first, second) => { if (first.order < second.order) return -1; if (first.order > second.order) return 1; return 0 })
        this.loaded = true
      })
  }
}
</script>

<style scoped>

</style>
