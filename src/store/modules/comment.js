const state = {
  rootComments: null,
  commentMap: null,
  dataLineSelection: null,
  dataCourseDataId: null
}

const mutations = {
  setCom: (state, payload) => {
    state.rootComments = payload.rootComments
    state.commentMap = payload.commentMap
  },
  dataLnSet: (state, payload) => {
    state.dataLineSelection = payload
  },
  dataCDISet: (state, payload) => {
    state.dataCourseDataId = payload
  },
  remCom: state => {
    state.rootComments = null
    state.commentMap = null
  },
  comAdd: (state, payload) => {
    if (payload.rootId === null) {
      state.rootComments.push(payload)
    } else {
      state.commentMap.get(payload.rootId).push(payload)
    }
  }
}

const actions = {
  setComments: ({ commit }, payload) => {
    commit('setCom', payload)
  },
  dataLineSet: ({ commit }, payload) => {
    commit('dataLnSet', payload)
  },
  dataCourseDataIdSet: ({ commit }, payload) => {
    commit('dataCDISet', payload)
  },
  removeComments: ({ commit }) => {
    commit('remCom')
  },
  addComment: ({ commit }, payload) => {
    commit('comAdd', payload)
  }
}

const getters = {
  getRootComments (state) { return state.rootComments },
  getCommentMap (state) { return state.commentMap },
  dataLineGet (state) { return state.dataLineSelection },
  dataCourseDataId (state) { return state.dataCourseDataId },
  getRoot: (state) => (commentId) => { return state.rootComments.find(el => el.id === commentId) },
  getChildren: (state) => (commentId) => { return state.commentMap.get(commentId) },
  getCommentsByCodeLine (state) { // courseDataId
    const result = { roots: [], commentMap: state.commentMap }
    if (state.rootComments === null) { return result }
    if (state.dataLineSelection === null) { return result }
    result.roots = state.rootComments.filter(el => {
      const goodcourseDataId = el.courseDataId === state.dataCourseDataId
      const goodlinesFrom = state.dataLineSelection >= el.linesFrom
      const goodlinesTo = state.dataLineSelection <= el.linesTo

      return goodcourseDataId && goodlinesFrom && goodlinesTo
    })
    return result
  },
  commentIsLoaded (state) { return state.rootComments !== null },
  commentGet: (state) => (commentId) => {
    const result = this.getRoot(commentId)
    if (result !== undefined) { return result }
    return state.commentMap.values().find(el => el.id === commentId)
  },
  commentIsSelectedGet () { return state.dataCourseDataId !== null }
}

export default {
  state,
  mutations,
  actions,
  getters
}
