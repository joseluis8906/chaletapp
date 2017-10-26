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
            v-icon(ma) assessment
            |  Historial
      v-card-text
        v-layout(row wrap)
          v-flex(xs12)

            v-select(v-bind:items="ItemsTipo"
                   v-model="Tipo"
                   label="Tipo"
                   @change="Reset2"
                   :rules="[rules.required]"
                   dark)

            v-menu( v-show="Tipo==='Por Fecha' || Tipo==='Por Empleado Y Fecha' || Tipo==='Por Cliente Y Fecha' "
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


            v-select(v-show="Tipo==='Por Cliente' || Tipo==='Por Cliente Y Fecha' || Tipo==='Por Empleado Y Cliente'"
                      v-bind:items="ItemsCliente"
                      v-model="ClienteId"
                      label="Cliente"
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


            v-select(v-show="Tipo==='Por Empleado' || Tipo==='Por Empleado Y Fecha' || Tipo==='Por Empleado Y Cliente'"
                     v-bind:items="ItemsEmpleado"
                     v-model="EmpleadoId"
                     label="Empleado"
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
                        :items="ItemsHistorial"
                        hide-actions
                        class="elevation-5 grey lighten-1 grey--text text--darken-4" )

              template(slot="headers" scope="props")
                th(v-for="header in props.headers" :key="header"
                  class="text-xs-center") {{ header.text }}

              template(slot="items" scope="props")
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Empleado.length*12)+'px'}") {{ props.item.Empleado }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.DocumentoEmpleado.length*12)+'px'}") {{ props.item.DocumentoEmpleado }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Tipo.length*12)+'px'}") {{ props.item.Tipo }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Monto.length*12)+'px'}") {{ props.item.Monto | currency("$", 0) }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Empleado.length*12)+'px'}") {{ props.item.Cliente }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.DocumentoEmpleado.length*12)+'px'}") {{ props.item.DocumentoCliente }}
                td(class="text-xs-center" :style="{minWidth: ''+(props.item.Fecha.length*12)+'px'}") {{ props.item.Fecha }}
                td(class="text-xs-center") {{ props.item.Hora }}

      v-card-actions
        v-spacer
        v-btn(warning dark @click.native="Reset" ) Limpiar

</template>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute
</style>

<script>
import USUARIOS from '~/queries/Usuarios.gql'
import HISTORIALES from '~/queries/Historiales.gql'

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
    ItemsCliente: [],
    ItemsEmpleado: [],
    headers: [
      {text: 'Empleado', value: 'Empleado'},
      {text: 'Cédula', value: 'DocumentoEmpleado'},
      {text: 'Tipo', value: 'Tipo'},
      {text: 'Monto', value: 'Monto'},
      {text: 'Cliente', value: 'Cliente'},
      {text: 'Cédula', value: 'DocumentoCliente'},
      {text: 'Fecha', value: 'Fecha'},
      {text: 'Hora', value: 'Hora'}
    ],
    ItemsHistorial: [],
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
    ClienteId: null,
    EmpleadoId: null,
    ItemsTipo: [
      'Por Fecha',
      'Por Empleado',
      'Por Cliente',
      'Por Empleado Y Fecha',
      'Por Cliente Y Fecha',
      'Por Empleado Y Cliente'
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
      let Seguir = false
      for(let i=0; i<Roles.length; i++){
        if(Roles[i]==="Administrador"){ Seguir = true }
      }
      if(!Seguir){
        this.$router.push('/inspire')
      }
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
        this.CargarUsuarios (data.Usuarios)
      }
    }
  },
  watch: {
    ClienteId () {
      this.Consultar()
    },
    EmpleadoId () {
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
        case 'StoreHistorial':
          this.StoreHistorial(Obj)
          break;
      }
    }
  },
  methods: {
    Consultar() {
      let variables = {}
      if (this.Tipo==='Por Fecha' && this.Fecha !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            Fecha: this.Fecha
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });

      }else if(this.Tipo==='Por Empleado' && this.EmpleadoId !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            EmpleadoId: this.EmpleadoId
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });

      }else if(this.Tipo==='Por Cliente' && this.ClienteId !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            ClienteId: this.ClienteId
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });

      }else if(this.Tipo==='Por Empleado Y Fecha' && this.Fecha !== null && this.EmpleadoId !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            Fecha: this.Fecha,
            EmpleadoId: this.EmpleadoId
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });

      }else if(this.Tipo==='Por Cliente Y Fecha' && this.Fecha !== null && this.ClienteId !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            Fecha: this.Fecha,
            ClienteId: this.ClienteId
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });

      }else if(this.Tipo==='Por Empleado Y Cliente' && this.ClienteId !== null && this.EmpleadoId !== null){
        this.$apollo.query({
          query: HISTORIALES,
          loadingKey: 'loading',
          variables: {
            ClienteId: this.ClienteId,
            EmpleadoId: this.EmpleadoId
          }
        }).then( res => {
          this.LoadUi(res.data.Historiales)
        });
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
    StoreHistorial (Historial) {
      var store = this.$apollo.provider.defaultClient

      //por fecha
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha
          }
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha
          },
          data: data
        })
      }


      //por cliente
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId
          }
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId
          },
          data: data
        })
      }


      //por empleado
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            EmpleadoId: Historial.EmpleadoId
          }
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })
      }


      //por fecha y cliente
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            ClienteId: Historial.ClienteId
          },
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            ClienteId: Historial.ClienteId
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            ClienteId: Historial.ClienteId
          },
          data: data
        })
      }


      //por fecha y empleado
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            EmpleadoId: Historial.EmpleadoId
          }
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            Fecha: Historial.Fecha,
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })
      }


      //por empleado y cliente
      try {
        var data = store.readQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId,
            EmpleadoId: Historial.EmpleadoId
          }
        })

        var Existe = false

        for (let i=0; i<data.Historiales.length; i++) {
          if (data.Historiales[i].Id === Historial.Id) {
            Existe = true
            data.Historiales[i] = Historial
          }
        }

        (!Existe) ? data.Historiales.push(Historial) : null;

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId,
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })

      } catch (Err) {

        var data = {Historiales: []}

        data.Historiales.push(Historial)

        store.writeQuery({
          query: HISTORIALES,
          variables: {
            ClienteId: Historial.ClienteId,
            EmpleadoId: Historial.EmpleadoId
          },
          data: data
        })
      }

      this.$store.commit('notificaciones/changeContext', 'info')
      this.$store.commit('notificaciones/changeIcon', 'info_outline')
      this.$store.commit('notificaciones/changeMsg', 'Datos Nuevos Para Mostrar')
      this.$store.commit('notificaciones/changeState', 1)

      this.Reset()

    },
    CargarUsuarios (Usuarios) {
      this.ItemsCliente = []
      this.ItemsEmpleado = []
      for(let j = 0; j < Usuarios.length; j++){
        for (let i=0; i < Usuarios[j].Grupos.length; i++){
          if (Usuarios[j].Grupos[i].Nombre === 'Cliente') {
            var tmp = Object.assign({}, Usuarios[j])
            tmp.Buscar = tmp.Nombre + " " +tmp.Apellido + " " + tmp.Cedula
            this.ItemsCliente.push(tmp)
          }
          if (Usuarios[j].Grupos[i].Nombre === 'Empleado') {
            var tmp = Object.assign({}, Usuarios[j])
            tmp.Buscar = tmp.Nombre + " " +tmp.Apellido + " " + tmp.Cedula
            this.ItemsEmpleado.push(tmp)
          }
        }
      }
    },
    LoadUi (Historiales) {
      this.ItemsHistorial = []
      for (let i=0; i<Historiales.length; i++){
        var tmp = {
          Id: Historiales[i].Id,
          Empleado: `${Historiales[i].Empleado.Nombre} ${Historiales[i].Empleado.Apellido}`,
          DocumentoEmpleado: Historiales[i].Empleado.Cedula,
          Tipo: Historiales[i].Tipo,
          Monto: Historiales[i].Monto,
          Cliente: `${Historiales[i].Cliente.Nombre} ${Historiales[i].Cliente.Apellido}`,
          DocumentoCliente: Historiales[i].Cliente.Cedula,
          Fecha: Historiales[i].Fecha,
          Hora: Historiales[i].Hora
        }
        this.ItemsHistorial.push(tmp)
      }
    },
    Reset () {
      this.Id = null
      this.Tipo = null,
      this.ClienteId = null
      this.EmpleadoId = null
      this.Fecha = null
      this.ItemsHistorial = []
    },
    Reset2 () {
      this.Id = null
      this.ClienteId = null
      this.EmpleadoId = null
      this.Fecha = null
      this.ItemsHistorial = []
    }
  },
  components: {
  }
};


</script>
