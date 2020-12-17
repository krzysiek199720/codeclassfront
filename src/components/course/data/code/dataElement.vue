<template>
  <div class="filler">
    <div class="element" @mouseover.stop.self="onHover" @mouseleave.stop.self="hovering = false" :class="{hovered: hovering}">
      <span class="desc-tooltip" v-if="elem.description !== null">{{elem.description}}</span>
      <template>{{elem.data}}</template>
      <dataElement v-if="deepeerElem !== null" :data="deepeerElem.list" @hov="hovering = false"></dataElement>
    </div>
    <dataElement v-for="elem in list" :data="elem.list" :key="elem.order" @hov="hovering = false"></dataElement>
  </div>
</template>

<script>
export default {
  name: 'dataElement',
  props: ['data'],
  data () {
    return {
      hovering: false,
      list: [],
      deepeerElem: null
    }
  },
  computed: {
    elem () {
      return this.data[0]
    }
  },
  methods: {
    onHover () {
      this.hovering = true
      this.$emit('hov')
    }
  },
  created () {
    const list = this.data

    const result = []

    const initialDepth = list[0].depth
    let start = 1
    let i = 2
    for (; i < list.length; i++) {
      if (list[i].depth === initialDepth) {
        result.push({
          list: list.slice(start, i),
          ord: list[start].order,
          dep: list[start].depth
        })
        start = i
      }
    }
    if (start !== i) {
      result.push({
        list: list.slice(start, i),
        order: list[start].order,
        dep: list[start].depth
      })
    }

    console.log()

    if (result[0].dep > initialDepth) {
      this.deepeerElem = result[0]
      result.splice(0, 1)
    }

    this.list = result
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
  background-color: $header-bg-color;
  box-shadow: $box-shadow1;
  font-family: $font3;
  color: $box-bg-color1;
  text-align: center;
  padding: 5px 5px;
  border-radius: 5px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  max-width: 300px;
  min-width: 150px;
  z-index: 1;

  transform: translate(0, -100%);
  top: -5px;
}

.element{
  position: relative;
  display: inline-block;

  cursor: default;

}

</style>
