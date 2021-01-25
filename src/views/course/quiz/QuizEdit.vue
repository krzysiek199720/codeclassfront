<template>
  <div id="quizEdit" v-if="loaded">
    <div class="section">
      <div class="title-container">
        <div class="title">Edit quiz</div>
        <div>
          <router-link tag="button" :to="{name: 'courseEdit', params: { id: this.$route.params.id}}">Return to course edit</router-link>
          <button class="save" @click="saveQuiz">Save quiz</button>
          <button class="delete" v-if="quizExists" @click="deleteQuiz">Delete quiz</button>
        </div>
      </div>
      <div class="new">
        <div class="new-question">
          <label for="question">New Question</label>
          <input type="text" id="question" v-model="newQuestion.question">
        </div>
        <div class="answers-box">
          <div class="answer">
            <input type="radio" id="answer0" v-model="newQuestion.answer" value="1">
            <input type="text" v-model="newQuestion.answer0">
          </div>
          <div class="answer">
            <input type="radio" id="answer1" class="answer" v-model="newQuestion.answer" value="2">
            <input type="text" v-model="newQuestion.answer1">
          </div>
          <div class="answer">
            <input type="radio" id="answer2" class="answer" v-model="newQuestion.answer" value="3">
            <input type="text" v-model="newQuestion.answer2">
          </div>
          <div class="answer">
            <input type="radio" id="answer3" class="answer" v-model="newQuestion.answer" value="4">
            <input type="text" v-model="newQuestion.answer3">
          </div>
        </div>
        <div class="button-container">
          <button @click="addQuestion">Add question</button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="title-container">
        <div class="title">Quiz questions</div>
      </div>
      <div class="questions">
        <div class="question" v-for="q in questions" :key="q.question">
          <span class="question-text">{{q.question}}</span>
          <span class="correct">{{q['answer' + (q.answer - 1)]}}</span>
          <span class="answer">{{q.answer0}}</span>
          <span class="answer">{{q.answer1}}</span>
          <span class="answer">{{q.answer2}}</span>
          <span class="answer">{{q.answer3}}</span>
          <div class="remove-button">
            <button class="remove" @click="removeQuestion(q)">Remove</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios'
import store from '@/store/store'

export default {
  name: 'QuizEdit',
  data () {
    return {
      questions: [],
      quizExists: false,
      loaded: false,
      newQuestion: {
        answer: 1,
        answer0: '',
        answer1: '',
        answer2: '',
        answer3: '',
        question: ''
      }
    }
  },
  methods: {
    addQuestion () {
      const isDuplicate = this.questions.find(e => { return e.question === this.newQuestion.question })
      if (isDuplicate) { return }
      this.questions.push(this.newQuestion)
      this.newQuestion = {
        answer: 1,
        answer0: '',
        answer1: '',
        answer2: '',
        answer3: '',
        question: ''
      }
    },
    removeQuestion (q) {
      const index = this.questions.indexOf(q)
      this.questions.splice(index, 1)
    },
    saveQuiz () {
      const data = {
        maxScore: this.questions.length,
        questionApiList: this.questions
      }

      axios.post('/course/' + this.$route.params.id + '/quiz', data)
        .then(res => {
          this.quizExists = true
        })
    },
    deleteQuiz () {
      axios.delete('/course/' + this.$route.params.id + '/quiz')
        .then(res => {
          this.$router.push({ name: 'courseEdit', params: { id: this.$route.params.id } })
        })
    }
  },
  created () {
    axios.get('/course/' + this.$route.params.id + '/quiz')
      .then(res => {
        this.questions = res.data.questions
        this.quizExists = true
        this.loaded = true
      })
      .catch(_ => {
        this.loaded = true
      })
  },
  beforeRouteEnter: (to, from, next) => {
    next(store.getters.authHasPermissionAny(['save_quiz', 'delete_quiz']))
  }
}
</script>

<style scoped lang="scss">

  @import 'src/assets/css/variables.scss';

  #quizEdit {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1400px;
    width: calc(100% - 40px);
    margin: 100px auto 20px auto;

    button {
      color: $highlight-color;
      border-color: $highlight-color;
      height: 30px;

      &.unfollow {
        color: $unfollow-color;
        border-color: $unfollow-color;
      }
    }

    button:hover {
      color: $box-bg-color1;
      background-color: $highlight-color;

      &.unfollow {
        color: $box-bg-color1;
        background-color: $unfollow-color;
      }
    }

    .section {
      position: relative;
      background-color: $box-bg-color1;
      box-shadow: $box-shadow1;
      padding: 30px;
    }
    .section+.section{
      margin-top: 20px;
    }

    .title-container {
      display: flex;
      justify-content: space-between;

      .title {
        font-family: $font2;
        color: $text-color2;
        font-size: 20px;
      }
      button+button {
        margin-left: 10px;
      }
    }

    .new {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }

    .new-question{
      display: flex;
      flex-direction: column;
    }

    label {
      padding: 0;
      margin: 0;
    }
    .answers-box{
      display: flex;
      flex-direction: column;
      margin: 10px 0 0;
      .answer{
        display: flex;
        input[type=text]{
          width: 400px;
        }
        input+input{
          margin-left: 10px;
        }
      }
      .answer+.answer{
        margin-top: 10px;
      }
    }

    .button-container {
      position: absolute;
      bottom: 30px;
      right: 30px;
    }

    .questions {
      display: flex;
      flex-direction: column;
    }

    .question {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }

    .remove-button {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .question-text{
      font-size: 18px;
      font-family: $font2;
      color: $highlight-color;
      margin-bottom: 10px;
    }

    .correct {
      color: $highlight-color;
      margin-bottom: 10px;
    }

    input {
      height: 30px;
      color: $input-color;
      border: 0;
      border-bottom: 1px solid $input-color;
      background-color: transparent;
    }

    input::placeholder {
      color: $input-placeholder-color;
    }

    input:focus, input:active, input:hover {
      border: 0;
      border-bottom: 1px solid $highlight-color;
      outline: 0;
    }

    input[type='radio'] {
      --disabled: #F6F8FF;
      --disabled-inner: #E1E6F9;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 21px;
      outline: none;
      display: inline-block;
      vertical-align: top;
      position: relative;
      top: 6.5px;
      margin: 0;
      cursor: pointer;
      border: 1px solid rgba($highlight-color, 0.3);
      background: $box-bg-color2;
      transition: background .3s, border-color .3s, box-shadow .2s;
      &:after {
        content: '';
        display: block;
        left: 0;
        top: 0;
        position: absolute;
        transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
      }
      &:checked {
        background: $highlight-color;
        border-color: $highlight-color;
        --d-o: .3s;
        --d-t: .6s;
        --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
      }
      &:disabled {
        --b: var(--disabled);
        cursor: not-allowed;
        opacity: .9;
        &:checked {
          --b: var(--disabled-inner);
          border-color: $highlight-color;
        }
        & + label {
          cursor: not-allowed;
        }
      }
      &:hover {
        &:not(:checked) {
          &:not(:disabled) {
            border-color: $highlight-color;
          }
        }
      }
      &:focus {
        box-shadow: 0 0 0 2px rgba($highlight-color, .3);
      }
      &:not(.switch) {
        width: 21px;
        &:after {
          opacity: var(--o, 0);
        }
        &:checked {
          --o: 1;
        }
      }
      & + label {
        font-size: 16px;
        line-height: 21px;
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
        margin-left: 0px;
        padding-left: 10px;
      }
    }
    input[type='radio'] {
      border-radius: 50%;
      &:after {
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background: $box-bg-color1;;
        opacity: 0;
        transform: scale(var(--s, .7));
      }
      &:checked {
        --s: .5;
      }
    }
  }

</style>
