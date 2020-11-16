<template>
  <div class="filler">
    <div class="element" :v-if="isDepthBigger"> <!-- @mouseover.stop="hovering = !hovering" :class="{klasaHover: hovering}" -->
      <span class="desc-tooltip" v-if="elem.description !== null">{{elem.description}}</span>
      <template>{{elem.data}}</template>
      <dataElement v-if="(index + 1) < data.length" :data="data" :index="index+1"></dataElement>
    </div>
    <template v-if="!isDepthBigger">{{elem.data}}</template>
  </div>
</template>

<script>
export default {
  name: 'dataElement',
  props: ['data', 'index'],
  data () {
    return {
      hovering: false
    }
  },
  computed: {
    elem () {
      return this.data[this.index]
    },
    isDepthBigger () {
      if (this.index === 0) { return true }
      return this.data[this.index - 1].depth < this.data[this.index].depth
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

.element{
  display: flex;
}

.desc-tooltip {
  color: cyan
}

</style>
