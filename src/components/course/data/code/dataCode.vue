<template>
  <div class="code">
    <template v-for="line in data.courseDataLineList">
      <div class="line" :key="line.id">
        <data-element :data="line.courseDataElementList" :index="0"></data-element>
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
