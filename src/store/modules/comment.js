import { eventBus } from '@/main'

const state = {
  rootComments: null,
  commentMap: null,
  dataLineSelection: null,
  dataCourseDataId: null, // selected one
  dataMaxLine: 0,
  dataLinesMap: null
}

const mutations = {
  setCom: (state, payload) => {
    state.rootComments = payload.rootComments
    state.commentMap = payload.commentMap
  },
  dataLnSet: (state, payload) => {
    state.dataLineSelection = payload
  },
  dataLnMax: (state, payload) => {
    state.dataMaxLine = payload
  },
  dataCDISet: (state, payload) => {
    state.dataCourseDataId = payload
  },
  dataSetMap: (state, payload) => {
    state.dataLinesMap = payload
  },
  remCom: state => {
    state.rootComments = null
    state.commentMap = null
  },
  comAdd: (state, payload) => {
    if (payload.rootId === null) {
      state.rootComments.push(payload)
    } else {
      let com = state.commentMap.get(payload.rootId)
      if(com)
        com.push(payload)
      else
        state.commentMap.set(payload.rootId, [payload])

    }
    eventBus.$emit('force-comment-update')
  }
}

const actions = {
  setComments: ({ commit }, payload) => {
    commit('setCom', payload)
  },
  dataLineSet: ({ commit }, payload) => {
    commit('dataLnSet', payload)
  },
  dataLineMaxSet: ({ commit }, payload) => {
    commit('dataLnMax', payload)
  },
  dataLinesMapSet: ({ commit }, payload) => {
    commit('dataSetMap', payload)
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
  dataLineMaxGet (state) { return state.dataMaxLine },
  dataGetDataLines: (state) => (key) => { return state.dataLinesMap.get(key) },
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
    const result = state.rootComments.find(el => el.id === commentId)
    if (result !== undefined) { return result }

    const iterator = state.commentMap.values()
    let keyItem = { done: false }
    while (keyItem.done === false) {
      keyItem = iterator.next()
      for (let i = 0; i < keyItem.value.length; i++) {
        const item = keyItem.value[i]
        if (item.id === commentId) { return item }
      }
    }

    return undefined
  },
  commentIsSelectedGet () { return state.dataCourseDataId !== null }
}

export default {
  state,
  mutations,
  actions,
  getters
}
