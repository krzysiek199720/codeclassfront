<template>
  <div :class="{'course-data': showComments}" v-if="loaded">
    <div class="data-section">
      <component
        v-for="(fordata, index) in data"
        :is="fordata.type === 'CODE' ? 'dataCode' : fordata.type === 'TEXT' ? 'dataText' : 'dataImage'"
        :data="data[index]"></component>
    </div>
    <div>
      <div class="code-comments" v-if="showComments">
        <dataComment></dataComment>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios/axios'

import dataText from '@/components/course/data/dataText'
import dataCode from '@/components/course/data/code/dataCode'
import dataImage from '@/components/course/data/dataImage'
import dataComment from '@/components/course/data/dataComment'

export default {
  name: 'CourseData',
  data () {
    return {
      data: null,
      loaded: false
    }
  },
  props: {
    showComments: {
      type: Boolean,
      default: true
    },
    usePropsData: {
      type: Boolean,
      default: false
    },
    propsData: {
      default: null
    }
  }, // maybe add comments to show there on click, dunno yet
  watch: {
    propsData (value) {
      this.data = value
    }
  },
  components: {
    dataText,
    dataCode,
    dataImage,
    dataComment
  },
  created () {
    if (this.usePropsData) {
      this.data = this.propsData
      this.loaded = true
      return
    }

    axios.get('/course/' + this.$route.params.id + '/data')
      .then(res => {
        this.data = res.data.sort((first, second) => { if (first.order < second.order) return -1; if (first.order > second.order) return 1; return 0 })

        // data lines map
        // dataLinesMapSet
        const map = new Map()
        this.data.forEach(e => {
          if (e.type === 'CODE') {
            map.set(e.id, e.linesPlain)
          }
        })
        this.$store.dispatch('dataLinesMapSet', map)

        this.loaded = true
      })
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.data-section{
  display: flex;
  flex-direction: column;
}

.course-data{
  display: grid;
  grid-template-columns: 3fr 2fr;
  padding: 20px 0 0;

  .code-comments{
    padding-left: 20px;
    margin-left: 20px;
    border-left: $box-border1;
  }
}

</style>
