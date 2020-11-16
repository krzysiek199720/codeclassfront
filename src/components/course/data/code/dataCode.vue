<template>
  <div class="code">
    <template v-for="line in data.courseDataLineList">
      <div class="line" :key="line.id" :style="{paddingLeft: line.indent + 'em'}">
        <data-element :data="line.courseDataElementList.sort(sortElements)" :index="0"></data-element>
      </div>
    </template>
  </div>
</template>

<script>
import dataElement from '@/components/course/data/code/dataElement'

export default {
  name: 'dataCode',
  props: ['data'],
  components: {
    dataElement
  },
  methods: {
    sortElements (first, second) {
      if (first.order < second.order) return -1
      if (first.order > second.order) return 1
      return 0
    }
  }
}
</script>

<style scoped lang="scss">

.line{
  margin: 20px;
  display: flex;
  flex-direction: row;
}

</style>
