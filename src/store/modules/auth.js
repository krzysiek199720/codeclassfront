import axios from '../../axios/axios'

const state = {
  token: null,
  expires: null,
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  roleId: null,
  roleName: null,
  permissions: []
}

const mutations = {
  authSet: (state, loginData) => {
    state.token = loginData.token
    state.expires = loginData.expires
    state.userId = loginData.userId
    state.email = loginData.email
    state.firstName = loginData.firstName
    state.lastName = loginData.lastName
    state.roleId = loginData.roleId
    state.roleName = loginData.roleName
    state.permissions = loginData.permissions

    if (state.token !== undefined && state.token !== null) {
      axios.defaults.headers.common.Authorization = state.token
    } else {
      axios.defaults.headers.common.Authorization = ''
    }
  },
  authRem: state => {
    state.token = null
    state.expires = null
    state.userId = null
    state.email = null
    state.firstName = null
    state.lastName = null
    state.roleId = null
    state.roleName = null
    state.permissions = []

    axios.defaults.headers.common.Authorization = ''
  }
}

const actions = {
  authSet: ({ commit }, loginData) => {
    localStorage.setItem('auth', JSON.stringify(loginData.data))
    commit('authSet', loginData.data)
  },
  tryLogin: ({ commit }) => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    if (auth === null) { return }
    const date = new Date()
    if (date >= auth.expires) { commit('authRem') }
    commit('authSet', auth)
  },
  authLogout: ({ commit }) => {
    localStorage.removeItem('auth')
    commit('authRem')
  }
}

const getters = {
  authToken: state => { return state.token },
  authExpires: state => state.expires,
  authUserId: state => state.userId,
  authEmail: state => state.email,
  authFirstName: state => state.firstName,
  authLastName: state => state.lastName,
  authRoleId: state => state.roleId,
  authRoleName: state => state.roleName,
  authIsAuthenticated: state => state.token !== null,
  authHasPermissionAny: state => (perms) => { return state.permissions.findIndex(e => perms.includes(e.name)) !== -1 }
}

export default {
  state,
  mutations,
  actions,
  getters
}
