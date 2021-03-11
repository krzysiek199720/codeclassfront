<template>
<!--  <p class="text-data">{{data.courseDataLineList[0].courseDataElementList[0].data}}</p>-->
  <viewer :options="startingOptions" :images="imageSrc" class="viewer" @inited="inited">
    <template slot-scope="scope">
      <div class="image">
        <img v-for="src in scope.images" :src="src" :key="src">
      </div>
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
      "button": true,
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
      },
      imageSrc: [],
      tempSrc: ''
    }
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer
    },
    show () {
      this.$viewer.show()
    }
  },
  created () {
    const src = axios.defaults.baseURL + '/course/' + this.$route.params.id + '/data/image/' + this.data.courseDataLineList[0].courseDataElementList[0].data
    axios.get(src, {responseType: 'blob'})
      .then(response => {
        let imgUrl = URL.createObjectURL(response.data)
        this.imageSrc.push(imgUrl)
      })
  }
}
</script>

<style scoped lang="scss">

  @import 'src/assets/css/variables.scss';

  .image{
    position: relative;
    display: flex;
    flex-direction: column;
    width: 80%;
    transition-duration: 100ms;
    img{
      max-height: 100px;
      object-fit: COVER;
      object-position: 40% 20%;
    }
  }

</style>
