export const state = {
  title: 'Default',
  volver: '/'
}

export const mutations = {
  changeTitle (state, title) {
    state.title = title
  },
  changeVolver (state, volver) {
    state.volver = volver
  }
}
