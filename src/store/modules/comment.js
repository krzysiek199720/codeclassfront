const state = {
  rootComments: null,
  commentMap: null,
  dataLineSelection: null
}

const mutations = {
  setCom: (state, payload) => {
    state.rootComments = payload.rootComments
    state.commentMap = payload.commentMap
  },
  dataLnSet: (state, payload) => {
    state.dataLineSelection = payload
  },
  remCom: state => {
    state.rootComments = null
    state.commentMap = null
  }
}

const actions = {
  setComments: ({ commit }, payload) => {
    commit('setCom', payload)
  },
  dataLineSet: ({ commit }, payload) => {
    commit('dataLnSet', payload)
  },
  removeComments: ({ commit }) => {
    commit('remCom')
  }
}

const getters = {
  getRootComments (state) { return state.rootComments },
  getCommentMap (state) { return state.commentMap },
  dataLineGet (state) { return state.dataLineSelection },
  getRoot: (state) => (commentId) => { return state.rootComments.find(el => el.id === commentId) },
  getChildren: (state) => (commentId) => { return state.commentMap.get(commentId) },
  getCommentsByCodeLine: (state) => (courseDataId) => { // courseDataId
    console.log('comment')
    console.log(courseDataId)
    console.log(state.dataLineSelection)
    const result = { roots: [], commentMap: state.commentMap }
    if (state.rootComments === null) { return result }
    if (state.dataLineSelection === null) { return result }
    result.roots = state.rootComments.filter(el => {
      // el.linesFrom >= state.dataLineSelection && el.linesTo <= state.dataLineSelection)
      const goodcourseDataId = el.courseDataId === courseDataId
      const goodlinesFrom = state.dataLineSelection >= el.linesFrom
      const goodlinesTo = state.dataLineSelection <= el.linesTo

      console.log('truths')
      console.log(goodcourseDataId)
      console.log(goodlinesFrom)
      console.log(goodlinesTo)
      console.log('end truths')

      return goodcourseDataId && goodlinesFrom && goodlinesTo
    })
    console.log(result)
    return result
  },
  commentIsLoaded (state) { return state.rootComments !== null }
}

export default {
  state,
  mutations,
  actions,
  getters
}
