<template lang="pug">
v-layout( align-center justify-center )
  v-snackbar(
    :timeout="snackbar.timeout"
    :success="snackbar.context === 'success'"
    :info="snackbar.context === 'info'"
    :warning="snackbar.context === 'warning'"
    :error="snackbar.context === 'error'"
    :primary="snackbar.context === 'primary'"
    :secondary="snackbar.context === 'secondary'"
    :multi-line="snackbar.mode === 'multi-line'"
    :vertical="snackbar.mode === 'vertical'"
    :top="true"
    v-model="loading" )
      h6(class="grey--text text--lighten-4 mb-0") {{ snackbar.text }}
      v-icon autorenew

  v-snackbar( :timeout="$store.state.notificaciones.Timeout"
              :success="$store.state.notificaciones.Context === 'success'"
              :info="$store.state.notificaciones.Context === 'info'"
              :warning="$store.state.notificaciones.Context === 'warning'"
              :error="$store.state.notificaciones.Context === 'error'"
              :primary="$store.state.notificaciones.Context === 'primary'"
              :secondary="$store.state.notificaciones.Context === 'secondary'"
              :multi-line="$store.state.notificaciones.Mode === 'multi-line'"
              :vertical="$store.state.notificaciones.Mode === 'vertical'"
              :top="true"
              v-model="$store.state.notificaciones.State" )
      h6(class="grey--text text--lighten-4 mb-0") {{ $store.state.notificaciones.Msg }}
      v-icon {{ $store.state.notificaciones.Icon }}

  v-flex( xs12 mt-3 md8 lg6 )
    v-card
      v-layout(row wrap pt-3 light-blue)
        v-flex( xs12 )
          h5(class="grey--text text--lighten-4 text-xs-center bold")
            v-icon(ma) attach_money
            |  Recargas
      v-card-text
        v-layout(row wrap)
          v-flex(xs12)
            v-select(v-bind:items="ItemsUsuario"
                     v-model="Usuario"
                     label="Usuario"
                     item-text="Buscar"
                     :rules="[rules.required]"
                     autocomplete
                     return-object
                     dark)
              template(slot="selection" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="data.item.Nombre + ' ' + data.item.Apellido")
              template(slot="item" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="(data.item.Nombre ? data.item.Nombre : 'no data available') + ' ' + (data.item.Apellido ? data.item.Apellido: '')")

            v-money(label="Saldo"
                    maskType="currency"
                    v-model="Saldo"
                    readonly
                    dark)

            v-money(label="Recarga"
                     maskType="currency"
                     :rules="[rules.required]"
                     v-model="Recarga"
                     dark)

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="Guardar" :disabled="!Completo") Guardar

</template>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute
</style>

<script>
import USUARIOS from '~/queries/Usuarios.gql'
import CUENTAS from '~/queries/Cuentas.gql'
import CREATE_CUENTA from '~/queries/CreateCuenta.gql'
import UPDATE_CUENTA from '~/queries/UpdateCuenta.gql'
import CREATE_HISTORIAL from '~/queries/CreateHistorial.gql'

import VMoney from '~/components/MonetaryInput.vue'
import axios from 'axios'

export default {
  data: () => ({
    snackbar: {
      context: 'primary',
      mode: '',
      timeout: 3000,
      text: 'Cargando'
    },
    ItemsUsuario: [],
    EmpleadoId: null,
    Id: null,
    Usuario:null,
    Saldo: null,
    Recarga: null,
    loading: 0,
    Completo: false,
    rules: {
      required: (value) => !!value || 'Obligatorio.',
      email: (value) => {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Correo Inválido.'
      }
    }
  }),
  beforeCreate () { console.log('beforeCreate') },
  created () { console.log('created') },
  beforeMount () { console.log('beforeMount') },
  mounted () {
    console.log('mounted')
    this.$nextTick(() => {
      if (sessionStorage.getItem('x-access-token') === null || sessionStorage.getItem('x-access-token') === null) {
        this.$router.push('/')
      } else {
        var UserName = sessionStorage.getItem('x-access-username')
        var Roles = JSON.parse(sessionStorage.getItem('x-access-roles'))
        this.$store.commit('security/SetUserName', UserName);
        this.$store.commit('security/AddRoles', Roles);
      }

      this.$mqtt.subscribe('chaletapp/apollo/mutation')
    })
  },
  updated () { console.log('update') },
  deactivate () { console.log('deactivate') },
  beforeDestroy () { console.log('beforeDestroy') },
  destroyed(){ console.log('beforeDestroy') },
  apollo: {
    Usuarios: {
      query: USUARIOS,
      loadingKey: 'loading',
      update (data) {
        this.CargarUsuarios (data.Usuarios)
      }
    },
    Cuentas: {
      query: CUENTAS,
      loadingKey: 'loading',
      variables () {
        return {
          UsuarioId: this.Usuario ? this.Usuario.Id : null
        }
      },
      update (data) {
        this.LoadUi(data.Cuentas)
      }
    }
  },
  watch: {
    Usuario () {
      this.Validar()
    },
    Recarga () {
      this.Validar()
    }
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt recargas')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreUsuario':
          this.StoreUsuario(Obj)
          break;
        case 'StoreCuenta':
          this.StoreCuenta(Obj)
          break;
      }
    }
  },
  methods: {
    Validar () {
      if(
        this.Usuario !== null &&
        this.Recarga !== null && this.Recarga !== '' && this.Recarga >= 5000
      ){
        this.Completo = true
      }else {
        this.Completo = false
      }
    },
    /*PubMsg () {
      //console.log('enviando: ' + this.Msg)
      this.$mqtt.publish('chaletapp/apollo/mutation', this.Msg)
    },*/
    StoreCuenta (Cuenta) {
      var store = this.$apollo.provider.defaultClient

      try {
        var data = store.readQuery({
          query: CUENTAS,
          variables: {
            UsuarioId: Cuenta.UsuarioId
          }
        })

        var Existe = false

        for (let i=0; i<data.Cuentas.length; i++) {
          if (data.Cuentas[i].Id === Cuenta.Id) {
            Existe = true
            data.Cuentas[i] = Cuenta
          }
        }

        (!Existe) ? data.Cuentas.push(Cuenta) : null;

        store.writeQuery({
          query: CUENTAS,
          variables: {
            UsuarioId: Cuenta.UsuarioId
          },
          data: data
        })

      } catch (Err) {

        var data = {Cuentas: []}

        data.Cuentas.push(Cuenta)

        store.writeQuery({
          query: CUENTAS,
          variables: {
            UsuarioId: Cuenta.UsuarioId
          },
          data: data
        })
      }

    },
    StoreUsuario (Usuario) {
      var store = this.$apollo.provider.defaultClient

      try {
        var data = store.readQuery({
          query: USUARIOS
        })

        var Existe = false

        for (let i=0; i<data.Usuarios.length; i++) {
          if (data.Usuarios[i].Id === Usuario.Id) {
            Existe = true
            data.Usuarios[i] = Usuario
          }
        }

        (!Existe) ? data.Usuarios.push(Usuario) : null;

        store.writeQuery({
          query: USUARIOS,
          data: data
        })

      } catch (Err) {

        var data = {Usuarios: []}

        data.Usuarios.push(Usuario)

        store.writeQuery({
          query: USUARIOS,
          data: data
        })
      }

      this.CargarUsuarios(data.Usuarios)

    },
    CargarUsuarios (Usuarios) {
      this.ItemsUsuario = []
      var UserName = null
      while(this.UserName === null){
        UserName = this.$store.state.security.UserName
      }

      for(let j = 0; j < Usuarios.length; j++){
        if(Usuarios[j].UserName === UserName){
          this.EmpleadoId = Usuarios[j].Id
        }

        for (let i=0; i < Usuarios[j].Grupos.length; i++){
          if (Usuarios[j].Grupos[i].Nombre === 'Cliente') {
            var tmp = Object.assign({}, Usuarios[j])
            tmp.Buscar = tmp.Nombre + " " +tmp.Apellido + " " + tmp.Cedula + tmp.UserName
            this.ItemsUsuario.push(tmp)
          }
        }
      }
    },
    LoadUi (Cuentas) {
      if(Cuentas.length > 0){
        this.Id = Cuentas[0].Id
        this.Saldo = Cuentas[0].Saldo
      }else{
        this.Id = null
        this.Saldo = null
      }
    },
    Guardar () {
      var Ahora = new Date(Date.now())
      var FechaHoy = `${Ahora.getFullYear()}-${(Ahora.getMonth() + 1) < 10 ? '0' + (Ahora.getMonth() + 1) : Ahora.getMonth() + 1}-${Ahora.getDate()}`
      var Hora = `${Ahora.getHours()}:${Ahora.getMinutes()}:00`

      if(this.Id === null){

        let NuevoSaldo = this.Saldo ? this.Saldo + this.Recarga : this.Recarga

        const Cuenta = {
          UsuarioId: this.Usuario.Id,
          Saldo: NuevoSaldo
        };

        const Historial = {
          ClienteId: this.Usuario.Id,
          EmpleadoId: this.EmpleadoId,
          Tipo: 'Recarga',
          Monto: this.Recarga,
          Fecha: FechaHoy,
          Hora: Hora
        };

        this.$store.commit('recarga/changeExpedicion', FechaHoy)
        this.$store.commit('recarga/changeCedula', this.Usuario.Cedula)
        this.$store.commit('recarga/changeApellido', this.Usuario.Apellido)
        this.$store.commit('recarga/changeNombre', this.Usuario.Nombre)
        this.$store.commit('recarga/changeSaldo', this.Saldo)
        this.$store.commit('recarga/changeRecarga', this.Recarga)
        this.$store.commit('recarga/changeTotal', NuevoSaldo)

        this.Reset()

        this.$apollo.mutate ({
          mutation: CREATE_CUENTA,
          variables: {
            UsuarioId: Cuenta.UsuarioId,
            Saldo: Cuenta.Saldo
          },
          loadingKey: 'loading',
          update: (store, { data: res }) => {
            this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreCuenta', Obj: res.CreateCuenta}))
          }
        }).then(() => {
          this.$store.commit('notificaciones/changeContext', 'success')
          this.$store.commit('notificaciones/changeIcon', 'done_all')
          this.$store.commit('notificaciones/changeMsg', 'Transacción Exitosa')
          this.$store.commit('notificaciones/changeState', 1)

          setTimeout(() => {
            this.$store.commit('reports/changeVolver', '/recargas')
            this.$router.push('/reporte/recibo')
          }, 3000)

        }).catch(() => {
          this.$store.commit('notificaciones/changeContext', 'error')
          this.$store.commit('notificaciones/changeIcon', 'error_outline')
          this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
          this.$store.commit('notificaciones/changeState', 1)
        })

        this.$apollo.mutate ({
          mutation: CREATE_HISTORIAL,
          variables: {
            ClienteId: Historial.ClienteId,
            EmpleadoId: Historial.EmpleadoId,
            Tipo: Historial.Tipo,
            Monto: Historial.Monto,
            Fecha: Historial.Fecha,
            Hora: Historial.Hora
          },
          loadingKey: 'loading',
          update: (store, { data: res }) => {
            this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreHistorial', Obj: res.CreateHistorial}))
          }
        }).then(() => {
          this.$store.commit('notificaciones/changeContext', 'success')
          this.$store.commit('notificaciones/changeIcon', 'done_all')
          this.$store.commit('notificaciones/changeMsg', 'Transacción Exitosa')
          this.$store.commit('notificaciones/changeState', 1)
        }).catch(() => {
          this.$store.commit('notificaciones/changeContext', 'error')
          this.$store.commit('notificaciones/changeIcon', 'error_outline')
          this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
          this.$store.commit('notificaciones/changeState', 1)
        })

      }else{

        let NuevoSaldo = this.Saldo ? this.Saldo + this.Recarga : this.Recarga

        const Cuenta = {
          Id: this.Id,
          UsuarioId: this.Usuario.Id,
          Saldo: NuevoSaldo
        };

        const Historial = {
          ClienteId: this.Usuario.Id,
          EmpleadoId: this.EmpleadoId,
          Tipo: 'Recarga',
          Monto: this.Recarga,
          Fecha: FechaHoy,
          Hora: Hora
        };

        console.log(Historial)

        this.$store.commit('recarga/changeExpedicion', FechaHoy)
        this.$store.commit('recarga/changeCedula', this.Usuario.Cedula)
        this.$store.commit('recarga/changeApellido', this.Usuario.Apellido)
        this.$store.commit('recarga/changeNombre', this.Usuario.Nombre)
        this.$store.commit('recarga/changeSaldo', this.Saldo)
        this.$store.commit('recarga/changeRecarga', this.Recarga)
        this.$store.commit('recarga/changeTotal', NuevoSaldo)

        this.Reset()

        this.$apollo.mutate ({
          mutation: UPDATE_CUENTA,
          variables: {
            Id: Cuenta.Id,
            UsuarioId: Cuenta.UsuarioId,
            Saldo: Cuenta.Saldo
          },
          loadingKey: 'loading',
          update: (store, { data: res }) => {
            this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreCuenta', Obj: res.UpdateCuenta}))
          }
        }).then(() => {
          this.$store.commit('notificaciones/changeContext', 'success')
          this.$store.commit('notificaciones/changeIcon', 'done_all')
          this.$store.commit('notificaciones/changeMsg', 'Transacción Exitosa')
          this.$store.commit('notificaciones/changeState', 1)

          setTimeout(() => {
            this.$store.commit('reports/changeVolver', '/recargas')
            this.$router.push('/reporte/recibo')
          }, 3000)

        }).catch(() => {
          this.$store.commit('notificaciones/changeContext', 'error')
          this.$store.commit('notificaciones/changeIcon', 'error_outline')
          this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
          this.$store.commit('notificaciones/changeState', 1)
        })

        this.$apollo.mutate ({
          mutation: CREATE_HISTORIAL,
          variables: {
            ClienteId: Historial.ClienteId,
            EmpleadoId: Historial.EmpleadoId,
            Tipo: Historial.Tipo,
            Monto: Historial.Monto,
            Fecha: Historial.Fecha,
            Hora: Historial.Hora
          },
          loadingKey: 'loading',
          update: (store, { data: res }) => {
            this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreHistorial', Obj: res.CreateHistorial}))
          }
        }).then(() => {
          this.$store.commit('notificaciones/changeContext', 'success')
          this.$store.commit('notificaciones/changeIcon', 'done_all')
          this.$store.commit('notificaciones/changeMsg', 'Transacción Exitosa')
          this.$store.commit('notificaciones/changeState', 1)
        }).catch(() => {
          this.$store.commit('notificaciones/changeContext', 'error')
          this.$store.commit('notificaciones/changeIcon', 'error_outline')
          this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
          this.$store.commit('notificaciones/changeState', 1)
        })

      }

    },
    Reset () {
      this.Id = null
      this.Usuario = null
      this.Saldo = null
      this.Recarga = null
    }
  },
  components: {
    VMoney
  }
};


</script>
