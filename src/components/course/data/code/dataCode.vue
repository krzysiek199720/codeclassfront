<template>
  <div class="code">
    <div class="line"
         v-for="(line,index) in data.courseDataLineList"
         :key="line.id">
<!--      todo indent-->
      <data-element :data="data" :index="index"></data-element>
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
  }
}
</script>

<style scoped>

</style>
