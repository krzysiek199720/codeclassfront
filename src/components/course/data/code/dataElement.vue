<template>
  <div class="filler">
    <div class="element" :v-if="depthBigger"> <!-- todo desc -->
      <span class="data">{{elem.data}}</span>
    </div>
    <span v-if="!depthBigger">{{elem.data}}</span>
  </div>
</template>

<script>
export default {
  name: 'dataElement',
  props: ['data', 'index'],
  computed: {
    elem () {
      return this.data[this.index]
    },
    depthBigger () {
      return this.data[this.index - 1].depth < this.elem.depth
    }
  }
}
</script>

<style scoped>

</style>
