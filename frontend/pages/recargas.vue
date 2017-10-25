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
                     item-value="Id"
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
                    readonly)

            v-money(label="Recarga"
                     maskType="currency"
                     v-model="Recarga")

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="Guardar" ) Guardar

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

import VMoney from '~/components/MonetaryInput.vue'
import axios from 'axios'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    ItemsUsuario: [],
    Id: null,
    Usuario:{
      Id: null,
      Cedula: null,
      Nombre: null,
      Apellido: null
    },
    Saldo: null,
    Recarga: null,
    loading: 0
  }),
  beforeMount () {
    if (sessionStorage.getItem('x-access-token') === null || sessionStorage.getItem('x-access-token') === null) {
      this.$router.push('/')
    } else {
      var Roles = JSON.parse(sessionStorage.getItem('x-access-roles'))
      this.$store.commit('security/AddRoles', Roles);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$mqtt.subscribe('chaletapp/apollo/mutation')
    })
  },
  apollo: {
    Usuarios: {
      query: USUARIOS,
      loadingKey: 'loading',
      update (data) {
        this.CargarClientes (data.Usuarios)
      }
    },
    Cuentas: {
      query: CUENTAS,
      loadingKey: 'loading',
      variables () {
        return {
          UsuarioId: this.Usuario.Id
        }
      },
      update (data) {
        this.LoadUi(data.Cuentas)
      }
    }
  },
  watch: {
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

      this.$store.commit('reports/changeVolver', '/recargas')
      this.$router.push('/reporte/recibo')

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

      this.CargarClientes(data.Usuarios)

    },
    CargarClientes (Usuarios) {
      this.ItemsUsuario = []
      for(let j = 0; j < Usuarios.length; j++){
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

      if(this.Id === null){

        let NuevoSaldo = this.Saldo ? this.Saldo + this.Recarga : this.Recarga

        const Cuenta = {
          UsuarioId: this.Usuario.Id,
          Saldo: NuevoSaldo
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
        })
      }else{

        let NuevoSaldo = this.Saldo ? this.Saldo + this.Recarga : this.Recarga

        const Cuenta = {
          Id: this.Id,
          UsuarioId: this.Usuario.Id,
          Saldo: NuevoSaldo
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
        })

      }

    },
    Reset () {
      this.Id = null
      this.Usuario = {
        Id: null,
        Nombre: null,
        Apellido: null,
        Cedula: null
      }
      this.Saldo = null
      this.Recarga = null
    }
  },
  components: {
    VMoney
  }
};


</script>
