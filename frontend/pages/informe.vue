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
            v-icon(ma) description
            |  Informe
      v-card-text
        v-layout(row wrap)
          v-flex(xs12)

            v-select(v-bind:items="ItemsTipo"
                   v-model="Tipo"
                   label="Tipo"
                   @change="Reset2"
                   :rules="[rules.required]"
                   dark)

            v-menu( v-show="Tipo==='Por Fecha' || Tipo==='Por Usuario Y Fecha'"
                    lazy
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
                            :rules="[rules.required]"
                            readonly
                            dark )

              v-date-picker( :months="months"
                             :days="days"
                             first-day-of-week="D"
                             :header-date-format="({ monthName, year }) => { return `${monthName} ${year}` }"
                             v-model="Fecha"
                             no-title
                             autosave
                             :rules="[rules.required]"
                             dark )
               template( scope="{ save, cancel }" )
                 v-card-actions
                   v-btn( dark warning @click.native="Fecha=null" ) Limpiar

            v-select(v-show="Tipo==='Por Usuario' || Tipo==='Por Usuario Y Fecha'"
                     v-bind:items="ItemsUsuario"
                     v-model="UsuarioId"
                     label="Usuario"
                     item-text="Buscar"
                     item-value="Id"
                     autocomplete
                     :rules="[rules.required]"
                     dark)
              template(slot="selection" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="data.item.Nombre + ' ' + data.item.Apellido")
              template(slot="item" scope="data")
                v-list-tile-content(style="font-size: 12pt")
                  v-list-tile-title(v-html="(data.item.Nombre ? data.item.Nombre : 'no data available') + ' ' + (data.item.Apellido ? data.item.Apellido: '')")


            v-data-table(v-bind:headers="headers"
                        :items="itemsCompra"
                        hide-actions
                        class="elevation-5 grey lighten-1 grey--text text--darken-4" )

              template(slot="headers" scope="props")
                th(v-for="header in props.headers" :key="header"
                  class="text-xs-center") {{ header.text }}

              template(slot="items" scope="props")
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Nombre.length*12)+'px'}") {{ props.item.Nombre }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Documento.length*12)+'px'}") {{ props.item.Documento }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Escenario.length*12)+'px'}") {{ props.item.Escenario }}
                td(class="text-xs-center") {{ props.item.HoraInicial }}
                td(class="text-xs-center") {{ props.item.HoraFinal }}
                td(class="text-xs-center") {{ props.item.Tiempo }} hr
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Abono.length*12)+'px'}") {{ props.item.Abono | currency("$", 0) }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Saldo.length*12)+'px'}") {{ props.item.Saldo | currency("$", 0) }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Estado.length*10)+'px'}") {{ props.item.Estado }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Fecha.length*12)+'px'}") {{ props.item.Fecha }}
                td(class="text-xs-center") {{ props.item.Hora }}
                td(class="text-xs-center")
                  v-btn(fab small class="teal" dark @click.native="Pagar(props.item)" :disabled="props.item.Saldo === 0")
                    v-icon check

      v-card-actions
        v-spacer
        v-btn(warning dark @click.native="Reset" ) Limpiar
        v-btn(primary dark @click.native="Generar" :disabled="itemsCompra.length===0") Generar

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
import UPDATE_COMPRA from '~/queries/UpdateCompra.gql'

export default {
  data: () => ({
    snackbar: {
      context: 'primary',
      mode: '',
      timeout: 3000,
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
      {text: 'Tiempo', value: 'Tiempo'},
      {text: 'Abono', value: 'Abono'},
      {text: 'Saldo', value: 'Saldo'},
      {text: 'Estado', value: 'Estado'},
      {text: 'Fecha', value: 'Fecha'},
      {text: 'Hora', value: 'Hora'},
      {text: 'Pago', value: 'Pago'},
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
    ItemsTipo: [
      'Por Fecha',
      'Por Usuario',
      'Por Usuario Y Fecha'
    ],
    Tipo: null,
    loading: 0,
    rules: {
      required: (value) => !!value || 'Obligatorio.',
      email: (value) => {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Correo Inválido.'
      }
    }
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
    }
  },
  watch: {
    UsuarioId () {
      this.Consultar()
    },
    Fecha () {
      this.Consultar()
    }
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreUsuario':
          this.StoreUsuario(Obj)
          break;
        case 'StoreCompra':
          this.StoreCompra(Obj)
          break;
      }
    }
  },
  methods: {
    Pagar (item) {
      const Compra = {
        Id: item.Id,
        Abono: (item.Abono+item.Saldo),
        Saldo: 0,
        Estado: "Pagado"
      }

      this.$apollo.mutate ({
        mutation: UPDATE_COMPRA,
        variables: {
          Id: Compra.Id,
          Abono: Compra.Abono,
          Saldo: Compra.Saldo,
          Estado: "Pagado"
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          //console.log(res.UpdateCompra)
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreCompra', Obj: res.UpdateCompra}))
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

    },
    Consultar() {
      let variables = {}
      if (this.Tipo==='Por Fecha'){
         variables = {
           Fecha: this.Fecha
         }
      }else if(this.Tipo==='Por Usuario'){
        variables = {
          UsuarioId: this.UsuarioId
        }
      }else if(this.Tipo==='Por Usuario Y Fecha'){
        variables = {
          Fecha: this.Fecha,
          UsuarioId: this.UsuarioId
        }
      }

      if(this.Tipo !== null){
        this.$apollo.query({
          query: COMPRAS,
          loadingKey: 'loading',
          variables: variables
        }).then( res => {
          this.LoadUi(res.data.Compras)
        });
      }
    },
    Generar () {
      var Ahora = new Date(Date.now())
      var FechaHoy = `${Ahora.getFullYear()}-${(Ahora.getMonth() + 1) < 10 ? '0' + (Ahora.getMonth() + 1) : Ahora.getMonth() + 1}-${Ahora.getDate()}`
      this.$store.commit('informe/changeExpedicion', FechaHoy)
      this.$store.commit('informe/changeFecha', this.Fecha)
      this.$store.commit('informe/changeUsuarioId', this.UsuarioId)
      this.$store.commit('reports/changeVolver', '/informe')
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
      this.Consultar()
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
          Id: Compras[i].Id,
          Nombre: `${Compras[i].Usuario.Nombre} ${Compras[i].Usuario.Apellido}`,
          Documento: Compras[i].Usuario.Cedula,
          Escenario: Compras[i].Escenario.Nombre,
          HoraInicial: Compras[i].HoraInicial,
          HoraFinal: Compras[i].HoraFinal,
          Tiempo: Compras[i].Tiempo,
          Abono: Compras[i].Abono,
          Saldo: Compras[i].Saldo,
          Estado: Compras[i].Estado,
          Fecha: Compras[i].Fecha,
          Hora: Compras[i].Hora
        }
        this.itemsCompra.push(tmp)
      }
    },
    Reset () {
      this.Id = null
      this.Tipo = null,
      this.UsuarioId = null
      this.Fecha = null
      this.itemsCompra = []
    },
    Reset2 () {
      this.Id = null
      this.UsuarioId = null
      this.Fecha = null
      this.itemsCompra = []
    }
  },
  components: {
  }
};


</script>
