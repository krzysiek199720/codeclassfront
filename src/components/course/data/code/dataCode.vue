<template>
  <div class="code-field">
    <div class="code">
      <template v-for="line in data.courseDataLineList">
        <div class="line" :key="line.id" @click="selectLine(line.order)">
          <pre v-for="n in line.indent" :key="line.id + '_' + n">  </pre>
          <data-element v-for="list in getElementLists(line)" :data="list.list" :key="list.order"></data-element>
        </div>
      </template>
    </div>
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
    },
    selectLine (line) {
      if (this.$store.getters.dataCourseDataId === this.data.id) {
        if (this.$store.getters.dataLineGet === line) {
          this.$store.dispatch('dataLineSet', null)
          this.$store.dispatch('dataCourseDataIdSet', null)
          return
        }
      }
      this.$store.dispatch('dataLineSet', line)
      this.$store.dispatch('dataCourseDataIdSet', this.data.id)
      this.$store.dispatch('dataLineMaxSet', this.data.courseDataLineList.length)
    },
    getElementLists (line) {
      line.courseDataElementList.sort(this.sortElements)
      const list = line.courseDataElementList

      const result = []

      const initialDepth = list[0].depth
      let start = 0
      let i = 1
      for (; i < list.length; i++) {
        if (list[i].depth === initialDepth) {
          result.push({
            list: list.slice(start, i),
            order: list[start].order
          })
          start = i
        }
      }
      if (start !== i) {
        result.push({
          list: list.slice(start, i),
          order: list[start].order
        })
      }

      return result
    }
  }
}

</script>

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

.code-field{
  background-color: $code-bg-color;
  font-family: 'JetBrains Mono';
  color: $text-color
}

.line{
  padding: 8px;
  display: flex;
  flex-direction: row;
}

pre{
  margin:0
}

</style>
