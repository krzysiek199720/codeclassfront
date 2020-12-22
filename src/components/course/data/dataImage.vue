<template>
<!--  <p class="text-data">{{data.courseDataLineList[0].courseDataElementList[0].data}}</p>-->
  <viewer :options="startingOptions" :images="imageSrc" class="viewer" @inited="inited">
    <template slot-scope="scope">
      <img v-for="src in scope.images" :src="src" :key="src">
    </template>
  </viewer>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from "v-viewer/src/component.vue"
import axios from '@/axios/axios'

export default {
  name: 'dataImage',
  props: ['data'],
  components: {
    Viewer
  },
  data () {
    return {
    startingOptions: {
      "inline": false,
      "button": false,
      "navbar": false,
      "title": true,
      "toolbar": false,
      "tooltip": false,
      "movable": true,
      "zoomable": true,
      "rotatable": false,
      "scalable": false,
      "transition": false,
      "fullscreen": false,
      "keyboard": false
      }
    }
  },
  computed: {
    // viewerOptions () {
    //   let options = this.startingOptions
    //   options.url = axios.defaults.baseURL + '/course/' + this.$route.params.id + '/data/image/' + data.courseDataLineList[0].courseDataElementList[0].data
    //   return options
    // }
    imageSrc () {
      let result = []
      console.log('sadasdas')
      console.log(axios.defaults.baseURL)
      console.log(this.$route.params.id)
      console.log(this.data.courseDataLineList[0].courseDataElementList[0].data)
      const src = axios.defaults.baseURL + '/course/' + this.$route.params.id + '/data/image/' + this.data.courseDataLineList[0].courseDataElementList[0].data
      result.push(src)
      return result
    }
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer
    },
    show () {
      this.$viewer.show()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
