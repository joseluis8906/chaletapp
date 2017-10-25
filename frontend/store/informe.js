export const state = {
  Expedicion: null,
  Fecha: null,
  UsuarioId: null
}

export const mutations = {
  changeExpedicion (state, Expedicion) {
    state.Expedicion = Expedicion
  },
  changeFecha (state, Fecha) {
    state.Fecha = Fecha
  },
  changeUsuarioId (state, UsuarioId) {
    state.UsuarioId = UsuarioId
  }
}
