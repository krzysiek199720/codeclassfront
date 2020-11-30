<template>
  <div class="code-field">
    <div class="code">
      <template v-for="line in data.courseDataLineList">
        <div class="line" :key="line.id" @click="selectLine(line.order)">
          <pre v-for="n in line.indent" :key="line.id + '_' + n">  </pre>
          <data-element :data="line.courseDataElementList.sort(sortElements)" :index="0"></data-element>
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
    }
  }
}

</script>

<style scoped lang="scss">

.line{
  padding: 8px;
  display: flex;
  flex-direction: row;
}

.line+.line{

  border-top:1px darkcyan solid;
}

pre{
  margin:0
}
</style>
