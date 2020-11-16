<template>
  <div class="course-data">
    <div class="data-section" >
      <component
        v-for="(fordata, index) in data"
        :key="fordata.id"
        :is="fordata.type === 'CODE' ? 'dataCode' : 'dataText'"
        :data="data[index]"></component>
    </div>
  </div>
</template>

<script>
import axios from '../../axios/axios'

import dataText from '@/components/course/data/dataText'
import dataCode from '@/components/course/data/code/dataCode'

export default {
  name: 'CourseData',
  data () {
    return {
      data: null
    }
  },
  props: ['courseId'], // maybe add comments to show there on click, dunno yet
  components: {
    dataText,
    dataCode
  },
  created () {
    axios.get('/course/' + this.courseId + '/data')
      .then(res => {
        this.data = res.data.sort((first, second) => { if (first.order < second.order) return -1; if (first.order > second.order) return 1; return 0 })
      })
  }
}
</script>

<style scoped>

</style>
