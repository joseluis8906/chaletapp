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
            v-icon(ma) description
            |  Informe
      v-card-text
        v-layout(row wrap)
          v-flex(xs12)
            //- v-select(v-bind:items="ItemsUsuario"
                     v-model="UsuarioId"
                     label="Usuario"
                     item-text="Buscar"
                     item-value="Id"
                     autocomplete
                     dark)
              template(slot="selection" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="data.item.Nombre + ' ' + data.item.Apellido")
              template(slot="item" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="(data.item.Nombre ? data.item.Nombre : 'no data available') + ' ' + (data.item.Apellido ? data.item.Apellido: '')")


            v-menu( lazy
                    :close-on-content-click="true"
                    v-model="menu1"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px" )

              v-text-field( slot="activator"
                            label="Fecha"
                            v-model="Fecha"
                            readonly )

              v-date-picker( :months="months"
                             :days="days"
                             first-day-of-week="D"
                             :header-date-format="({ monthName, year }) => { return `${monthName} ${year}` }"
                             v-model="Fecha"
                             no-title
                             autosave
                             dark )
               template( scope="{ save, cancel }" )
                 v-card-actions
                   v-btn( dark warning @click.native="Fecha=null" ) Limpiar

            v-data-table(v-bind:headers="headers"
                        :items="itemsCompra"
                        hide-actions
                        class="elevation-5 grey lighten-1 grey--text text--darken-4" )

              template(slot="headers" scope="props")
                th(v-for="header in props.headers" :key="header"
                  class="text-xs-center") {{ header.text }}

              template(slot="items" scope="props")
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Nombre.length*10)+'px'}") {{ props.item.Nombre }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Documento.length*10)+'px'}") {{ props.item.Documento }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Escenario.length*10)+'px'}") {{ props.item.Escenario }}
                td(class="text-xs-center") {{ props.item.HoraInicial }}
                td(class="text-xs-center") {{ props.item.HoraFinal }}
                td(class="text-xs-center") {{ props.item.Tiempo }}
                td(class="text-xs-center") {{ props.item.Precio }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Estado.length*10)+'px'}") {{ props.item.Estado }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Fecha.length*12)+'px'}") {{ props.item.Fecha }}
                td(class="text-xs-center") {{ props.item.Hora }}

      v-card-actions
        v-spacer
        v-btn(warning dark @click.native="Reset" ) Limpiar
        v-btn(primary dark @click.native="Generar" ) Generar

</template>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute
</style>

<script>
import USUARIOS from '~/queries/Usuarios.gql'
import COMPRAS from '~/queries/Compras.gql'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    menu1: false,
    Fecha: null,
    ItemsUsuario: [],
    headers: [
      {text: 'Nombre', value: 'Nombre'},
      {text: 'Documento',       value: 'Documento'},
      {text: 'Escenario', value: 'Escenario'},
      {text: 'Hora Inicial', value: 'HoraInicial'},
      {text: 'Hora Final', value: 'HoraFinal'},
      {text: 'Tiempo (hr)', value: 'Tiempo'},
      {text: 'Precio', value: 'Precio'},
      {text: 'Estado', value: 'Estado'},
      {text: 'Fecha', value: 'Fecha'},
      {text: 'Hora', value: 'Hora'}
    ],
    itemsCompra: [],

    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'],
    days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    UsuarioId: null,
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
    Compras: {
      query: COMPRAS,
      loadingKey: 'loading',
      variables () {
        return {
          Fecha: this.Fecha
        }
      },
      update (data) {
        this.LoadUi(data.Compras)
      }
    }
  },
  watch: {
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreUsuario': this.StoreUsuario(Obj)
        case 'StoreCompra': this.StoreCompra(Obj)
      }
    }
  },
  methods: {
    Generar () {
      this.$store.commit('informe/changeFecha', this.Fecha)
      this.$router.push('/reporte/informe')
    },
    /*PubMsg () {
      //console.log('enviando: ' + this.Msg)
      this.$mqtt.publish('chaletapp/apollo/mutation', this.Msg)
    },*/
    StoreCompra (Compra) {
      var store = this.$apollo.provider.defaultClient

      try {
        var data = store.readQuery({
          query: COMPRAS,
          variables: {
            UsuarioId: Compra.UsuarioId
          }
        })

        var Existe = false

        for (let i=0; i<data.Compras.length; i++) {
          if (data.Compras[i].Id === Compra.Id) {
            Existe = true
            data.Compras[i] = Compra
          }
        }

        (!Existe) ? data.Compras.push(Compra) : null;

        store.writeQuery({
          query: COMPRAS,
          variables: {
            UsuarioId: Compra.UsuarioId
          },
          data: data
        })

      } catch (Err) {

        var data = {Compras: []}

        data.Compras.push(Compra)

        store.writeQuery({
          query: COMPRAS,
          variables: {
            UsuarioId: Compra.UsuarioId
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

      this.CargarClientes(data.Usuarios)

    },
    CargarClientes (Usuarios) {
      this.ItemsUsuario = []
      for(let j = 0; j < Usuarios.length; j++){
        for (let i=0; i < Usuarios[j].Grupos.length; i++){
          if (Usuarios[j].Grupos[i].Nombre === 'Cliente') {
            var tmp = Object.assign({}, Usuarios[j])
            tmp.Buscar = tmp.Nombre + " " +tmp.Apellido + " " + tmp.Cedula
            this.ItemsUsuario.push(tmp)
          }
        }
      }
    },
    LoadUi (Compras) {
      this.itemsCompra = []
      for (let i=0; i<Compras.length; i++){
        var tmp = {
          Nombre: `${Compras[i].Usuario.Nombre} ${Compras[i].Usuario.Apellido}`,
          Documento: Compras[i].Usuario.Cedula,
          Escenario: Compras[i].Escenario.Nombre,
          HoraInicial: Compras[i].HoraInicial,
          HoraFinal: Compras[i].HoraFinal,
          Tiempo: Compras[i].Tiempo,
          Precio: Compras[i].Precio,
          Estado: Compras[i].Estado,
          Fecha: Compras[i].Fecha,
          Hora: Compras[i].Hora
        }
        this.itemsCompra.push(tmp)
      }
    },
    Guardar () {
      if(this.Id === null){

        let NuevoSaldo = this.Saldo ? this.Saldo + this.Recarga : this.Recarga

        const Cuenta = {
          UsuarioId: this.UsuarioId,
          Saldo: NuevoSaldo
        };

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
          UsuarioId: this.UsuarioId,
          Saldo: NuevoSaldo
        };

        console.log(Cuenta)

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
      this.UsuarioId = null
      this.Saldo = null
      this.Recarga = null
    }
  },
  components: {
  }
};


</script>
