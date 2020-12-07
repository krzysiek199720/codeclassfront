<template>
  <div class="filler">
    <div class="element" :v-if="isDepthBigger" @mouseover.stop.self="onHover" @mouseleave.stop.self="hovering = false" :class="{hovered: hovering}">
      <span class="desc-tooltip" v-if="elem.description !== null">{{elem.description}}</span>
      <template>{{elem.data}}</template>
      <dataElement v-if="(index + 1) < data.length" :data="data" :index="index+1" @hov="hovering = false"></dataElement>
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
  methods: {
    onHover () {
      this.hovering = true
      this.$emit('hov')
    }
  }
}
</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.filler, .element{
  display: inline;
}

.hovered{
  background-color: $hover-bg-color;
}

.hovered>.desc-tooltip {
  visibility: visible;
}

.desc-tooltip {
  visibility: hidden;
  background-color: rgba(black, 0.8);
  color: $text-color;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  max-width: 300px;
  min-width: 150px;
  z-index: 1;

  top: -250%;
}

.element{
  position: relative;
  display: inline-block;

  cursor: default;

}

</style>
