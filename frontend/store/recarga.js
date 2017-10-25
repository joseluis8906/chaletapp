export const state = {
  Expedicion: null,
  Cedula: null,
  Apellido: null,
  Nombre: null,
  Saldo: null,
  Recarga: null,
  Total: null
}

export const mutations = {
  changeExpedicion (state, Expedicion) {
    state.Expedicion = Expedicion
  },
  changeCedula (state, Cedula) {
    state.Cedula = Cedula
  },
  changeApellido (state, Apellido) {
    state.Apellido = Apellido
  },
  changeNombre (state, Nombre) {
    state.Nombre = Nombre
  },
  changeSaldo (state, Saldo) {
    state.Saldo = Saldo
  },
  changeRecarga (state, Recarga) {
    state.Recarga = Recarga
  },
  changeTotal (state, Total) {
    state.Total = Total
  }
}
