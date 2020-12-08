<template>
  <p class="text-data">{{data.courseDataLineList[0].courseDataElementList[0].data}}</p>
</template>

<script>
export default {
  name: 'dataText',
  props: ['data']
}
</script>

<style scoped lang="scss">

p{
  white-space: pre-wrap;
}

</style>
