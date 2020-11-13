const state = {
  token: null,
  expires: null,
  userId: null,
  email: null,
  firstName: null,
  lastName: null,
  roleId: null,
  roleName: null
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
  }
}

const actions = {
  authSet: ({ commit }, loginData) => {
    localStorage.setItem('auth', JSON.stringify(loginData))
    commit('authSet', loginData)
  },
  tryLogin: ({ commit }) => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    const date = new Date()
    if (date >= auth.expires) { return }
    commit('authSet', auth)
  },
  authLogout: ({ commit }) => {
    commit('authRem')
  }
}

const getters = {
  authToken: state => state.token,
  authExpires: state => state.expires,
  authUserId: state => state.userId,
  authEmail: state => state.email,
  authFirstName: state => state.firstName,
  authLastName: state => state.lastName,
  authRoleId: state => state.roleId,
  authRoleName: state => state.roleName,
  authIsAuthenticated: state => state.token !== null
}

export default {
  state,
  mutations,
  actions,
  getters
}
