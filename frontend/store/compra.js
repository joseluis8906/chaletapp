export const state = {
  Expedicion: null,
  Cedula: null,
  Apellido: null,
  Nombre: null,
  Escenario: null,
  Fecha: null,
  HoraInicial: null,
  HoraFinal: null,
  Tiempo: null,
  Precio: null
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
  changeEscenario (state, Escenario) {
    state.Escenario = Escenario
  },
  changeFecha (state, Fecha) {
    state.Fecha = Fecha
  },
  changeHoraInicial (state, HoraInicial) {
    state.HoraInicial = HoraInicial
  },
  changeHoraFinal (state, HoraFinal) {
    state.HoraFinal = HoraFinal
  },
  changeTiempo (state, Tiempo) {
    state.Tiempo = Tiempo
  },
  changePrecio (state, Precio) {
    state.Precio = Precio
  },
}
