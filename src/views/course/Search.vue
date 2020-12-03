<template>
  <div id="search" class="search-container">
    <div class="controls">
      <form>
        <input type="text" v-model="searchQuery" placeholder="Searched text">
        <div class="row">
          <div class="complexities-check">
            <label for="BEGINNER"><input type="checkbox" id="BEGINNER" value="BEGINNER" v-model="complexities">Beginner<span class="checkmark"></span></label>
            <label for="INTERMEDIATE"><input type="checkbox" id="INTERMEDIATE" value="INTERMEDIATE" v-model="complexities">Intermediate<span class="checkmark"></span></label>
            <label for="ADVANCED"><input type="checkbox" id="ADVANCED" value="ADVANCED" v-model="complexities">Advanced<span class="checkmark"></span></label>
          </div>
          <button @click.prevent.stop="search">Search</button>
        </div>
      </form>
    </div>
    <div class="search-results">
      <template v-if="result.length > 0">
        <div class="result" v-for="item in result" :key="item.courseGroupId">
          <router-link tag="div" :to="{name:'courseGroup', params:{id: item.courseGroupId}}" class="data">
            <span tag="span" class="title">{{item.courseGroupName}}</span>
            <span class="author">{{item.authorFirstName}} {{item.authorLastName}}</span>
          </router-link>
          <div class="moreinfo">
            <div class="important">
              <div class="complexity">
                <template>{{item.minComplexity}}<template v-if="item.minComplexity !== item.maxComplexity"> - {{item.maxComplexity}}</template></template>
              </div>
              <div class="lancat">
                <span class="language">{{item.languageName}}</span>
                <span class="category">{{item.categoryName}}</span>
              </div>
            </div>
            <div class="info-rest">
              <span class="updated">Last updated: {{item.lastAddedDate | formatDateOrEmpty}}</span>
              <span class="comment-count">Comments: {{item.commentCount}}</span>
            </div>
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

<style scoped lang="scss">

@import 'src/assets/css/variables.scss';

#search{
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 1200px;
  margin: 120px auto auto auto;

  .controls{
    display: flex;
    flex-direction: column;
    background-color: $header-bg-color;
    width: calc(100%-60px);
    margin-bottom: 20px;
    padding: 30px 30px;
    border-radius: 5px;
    .complexities-check{
      display: flex;
      flex-direction: row;
      padding-top: 10px;
    }
  }

  label{
    padding-right: 10px;
  }

  input{
    width: 100%;
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
    margin: 0 auto;
  }

  input::placeholder{
    color: $input-placeholder-color;
  }

  input:focus, input:active, input:hover{
    border: 0;
    border-bottom: 1px solid $highlight-color;
    outline: 0;
  }

  button{
    margin-top: 10px;
    height: 30px;
    width: 150px;
    color: $highlight-color;
    border-color: $highlight-color;
    outline: none;
  }

  button:hover{
    color: $header-bg-color;
    background-color: $highlight-color;
  }

  .result-empty{
    color: $text-color;
  }

  .row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .search-results{
    width: calc(100%-60px);
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 60vh;

    padding: 30px 30px;
    background-color: $header-bg-color;

    color: $text-color;
  }

  .result{
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    .data{
      color: $highlight-color;
      display: flex;
      flex-direction: column;
      align-self: center;
      width: 60%;
      cursor: pointer;
      margin-left: 10px;
      .title{
        font-size: 20px;
      }
      .author{
        font-size: 15px;
      }
    }
    .moreinfo{
      padding-left: 10px;
      border-left: $text-color 1px solid;
      display: flex;
      flex-direction: column;
      width: 40%;
      font-size: 15px;
    }
  }
  .result+.result{
    border-top: $text-color 1px solid;
  }

  .moreinfo .important{
    display: grid;
    grid-template-columns: 2fr 1fr;
  }

  .moreinfo .complexity {
    align-self: center;
  }

  .moreinfo .lancat{
    display: flex;
    flex-direction: column;
    justify-self: center;
  }

  .moreinfo .info-rest{
    display: grid;
    grid-template-columns: 2fr 1fr;
    &>*{
      align-self: center;
    }
    .comment-count{
      justify-self: center;
    }
  }

  .moreinfo div+div{
    margin-top: 5px;
  }
}

</style>
