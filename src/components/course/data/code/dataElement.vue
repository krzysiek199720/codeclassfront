<template>
  <div class="filler">
    <div class="element" @mouseover.stop.self="onHover" @mouseleave.stop.self="hovering = false" :class="{hovered: hovering}">
      <div class="desc-tooltip" v-if="elem.description !== null">
        <div class="shadow">
          {{elem.description}}
        </div>
      </div>
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
  text-shadow: $text-shadow1;
}

.hovered > .desc-tooltip {
  opacity: 1;
  visibility: visible;
}

.desc-tooltip {
  visibility: hidden;
  opacity: 0;
  transition-delay: 150ms;
  transition-duration: 200ms;
  background-color: $box-bg-color3;
  box-shadow: $box-shadow2;
  font-family: $font3;
  color: $highlight-color;
  padding: 5px 6px;
  position: absolute;
  z-index: 1;
  font-size: 14.3px;
  transform: translate(0, -100%);
  top: 0;
  left: 0;
  right: 0;
  text-shadow: none;
  &:before {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    transform: translate(0, -100%);
    background: linear-gradient(transparent, rgba($highlight-color,0.05));
    content: '';
  }
  &:after {
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    transform: translate(0, 100%);
    background: linear-gradient(rgba($highlight-color,0.05), transparent);
    content: '';
  }
}

.element{
  display: inline-block;
  cursor: default;

}

</style>
