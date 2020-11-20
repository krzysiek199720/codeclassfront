<template>
  <div id="search" class="search-container">
    <div class="controls">
      <input type="text" v-model="searchQuery">
      <div class="complexities-check">
        <label for="BEGINNER"><input type="checkbox" id="BEGINNER" value="BEGINNER" v-model="complexities">Beginner</label>
        <label for="INTERMEDIATE"><input type="checkbox" id="INTERMEDIATE" value="INTERMEDIATE" v-model="complexities">Intermediate</label>
        <label for="ADVANCED"><input type="checkbox" id="ADVANCED" value="ADVANCED" v-model="complexities">Advanced</label>
      </div>
      <button @click="search">Search</button>
    </div>
    <div class="search-results">
      <template v-if="result.length > 0">
        <div class="result" v-for="item in result" :key="item.courseGroupId">
          <div class="data">
            <router-link tag="span" :to="{name:'courseGroup', params:{id: item.courseGroupId}}" class="title">{{item.courseGroupName}}</router-link>
            <span class="author">{{item.authorFirstName}} {{item.authorLastName}}</span>
          </div>
          <div class="moreinfo">
            <div class="complexity">
              <template>{{item.minComplexity}}<template v-if="item.minComplexity !== item.maxComplexity"> {{item.maxComplexity}}</template></template>
            </div>
            <span class="language">{{item.languageName}}</span>
            <span class="category">{{item.categoryName}}</span>
            <span class="updated">{{item.lastAddedDate}}</span>
            <span class="comment-count">{{item.commentCount}}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="result-empty">No results</div>
      </template>
    </div>
  </div>
</template>

<script>
import qs from 'qs'

import axios from '../../axios/axios'

export default {
  name: 'Search',
  data () {
    return {
      searchQuery: '',
      complexities: [],
      result: []
    }
  },
  methods: {
    search () {
      const params = {
        searchQuery: this.searchQuery === '' ? undefined : this.searchQuery,
        complexities: this.complexities === [] ? undefined : this.complexities
      }

      axios.get('/search', {
        params: params,
        paramsSerializer: params => {
          const res = qs.stringify(params, { indices: false })
          return res
        }
      })
        .then(res => {
          this.result = res.data
          this.$router.replace({
            name: 'search',
            query: params
          })
        })
    }
  },
  created () {
    if (this.$route.query.searchQuery === undefined &&
      this.$route.query.complexities === undefined) { return }

    if (this.$route.query.searchQuery !== undefined) { this.searchQuery = this.$route.query.searchQuery }
    if (this.$route.query.complexities !== undefined) { this.complexities = this.$route.query.complexities }

    this.search()
  }
}
</script>

<style scoped>

</style>
