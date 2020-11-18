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
    <div class="code-comments">
      <dataComment :courseDataId="data.id"></dataComment>
    </div>
  </div>
</template>

<script>
import dataElement from '@/components/course/data/code/dataElement'
import dataComment from '@/components/course/data/dataComment'

export default {
  name: 'dataCode',
  props: ['data'],
  computed: {
    isLoaded () {
      return this.$store.getters.commentIsLoaded
    }
  },
  components: {
    dataElement,
    dataComment
  },
  methods: {
    sortElements (first, second) {
      if (first.order < second.order) return -1
      if (first.order > second.order) return 1
      return 0
    },
    selectLine (line) {
      this.$store.dispatch('dataLineSet', line)
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

pre{
  margin:0
}
</style>
