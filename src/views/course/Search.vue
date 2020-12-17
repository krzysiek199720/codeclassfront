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
        <router-link tag="div" :to="{name:'courseGroup', params:{id: item.courseGroupId}}" class="result" v-for="item in result" :key="item.courseGroupId">
          <div class="data">
            <span tag="span" class="title">{{item.courseGroupName}}</span>
            <span class="author">{{item.authorFirstName}} {{item.authorLastName}}</span>
          </div>
          <div class="moreinfo">
              <div class="complexity">
                <template>{{item.minComplexity}}<template v-if="item.minComplexity !== item.maxComplexity"> - {{item.maxComplexity}}</template></template>
              </div>
              <div class="updated">Last updated: {{item.lastAddedDate | formatDateOrEmpty}}</div>
          </div>
          <div class="evenmoreinfo">
            <div class="infotype">
              <span>Language: {{item.languageName}}</span>
            </div>
            <div class="infotype">
              <span>Category: {{item.categoryName}}</span>
            </div>
            <div class="infotype">
              <span>Comments: {{item.commentCount}}</span>
            </div>
          </div>
        </router-link>
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
  max-width: 1400px;
  width: calc(100% - 40px);
  margin: 100px auto auto auto;

  .controls{
    display: flex;
    flex-direction: column;
    background-color: $box-bg-color1;
    margin-bottom: 20px;
    padding: 30px 30px 20px;

    box-shadow: $box-shadow1;

    .complexities-check{
      display: flex;
      flex-direction: row;
      padding-top: 10px;
      font-family: $font2;
    }
  }

  label{
    padding: 4px 4px 4px 26px;
  }

  form{
    display: flex;
    flex-direction: column;
  }

  input{
    height: 30px;
    color: $input-color;
    border: 0;
    border-bottom: 1px solid $input-color;
    background-color: transparent;
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
    color: $box-bg-color1;
    background-color: $highlight-color;
  }

  .result-empty{
    color: $text-color;
    padding: 20px 30px;
  }

  .row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .search-results{
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60vh;
    margin-bottom: 35px;
    box-shadow: $box-shadow1;
    background-color: $box-bg-color1;
    color: #000000;
  }

  .result{
    width: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    padding: 20px 30px;
    cursor: pointer;
    border-bottom: $box-border1;
    &:hover{
      background-color: $box-bg-color2;
    }
    .data{
      color: $highlight-color;
      display: flex;
      flex-direction: column;
      align-self: center;
      width: 60%;
      margin-left: 10px;
      .title{
        font-size: 24px;
        font-family: $font2;
      }
      .author{
        font-size: 18px;
        font-family: $font2;
      }
    }
    .moreinfo{
      padding: 0 10px;
      border-left: $box-border1;
      display: flex;
      flex-direction: column;
      width: 20%;
      font-size: 15px;
      justify-content: center;
    }
    .evenmoreinfo{
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      width: 15%;
      font-size: 15px;
    }
  }

  .infotype{
    display: flex;
  }

  .moreinfo div+div{
    margin-top: 10px;
  }

  .evenmoreinfo div+div{
    margin-top: 5px;
  }

  .complexities-check{
    /* Hide the browser's default checkbox */
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
      position: absolute;
      top: 5px;
      left: 5px;
      height: 16px;
      width: 16px;
      background-color: $highlight-color;
    }
    ///* On mouse-over, add a grey background color */
    //&:hover input ~ .checkmark {
    //  background-color: $text-color;
    //}

    /* When the checkbox is checked, add a blue background */
    input:checked ~ .checkmark {
      background-color: $highlight-color;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    /* Show the checkmark when checked */
    input:checked ~ .checkmark:after {
      display: block;
    }

    /* Style the checkmark/indicator */
    .checkmark:after {
      left: 5px;
      top: 2px;
      width: 3px;
      height: 7px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}

</style>
