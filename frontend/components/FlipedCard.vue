<template lang="pug">
v-flex(xs12 sm4 md4 lg3 class="g-card-container")
  v-dialog(v-model="aviso" persistent)
      v-card
        v-card-title(class="title error") Términos Y Condiciones
        v-card-text(class="text-xs-justify") Tenga en cuenta que al realizar esta operación, se cobrará desde el saldo de cuenta el 10% del valor del servicio. Si desea continuar haga click en ACEPTAR de lo contrario haga click en CANCELAR.
        v-card-actions
          v-spacer
          v-btn(error @click.native="aviso=false") CANCELAR
          v-btn(success @click.native="Guardar") ACEPTAR

  v-card(class="g-card" v-bind:class="{ flipped: over }" light)
    div(class="front" v-on:click="over=true")
      div(:style="{backgroundImage: `url(${src || 'default.png'}?random=${Math.random(100)})`, backgroundSize:'cover', height:'180px', width: '100%', verticalAlign:'bottom'}" class="g-card-img")
        h3(class="text-xs-left title white--text ml-2" style="text-shadow: 2px 2px rgba(40,40,40,0.75); margin-top: 140px; display: inline-block") {{ title }}

      div(class="pl-2 pt-2" style="height:235px; border-bottom: 1px solid rgb(180,180,180)")
        p(class="subheading text-xs-left") Especificaciones:
        ul
          li {{ esp1 }}
          li {{ esp2 }}
          li Precio Diurno: {{ precioDiurno | currency('$', 0) }}/hr
          li Precio Nocturno: {{ precioNocturno | currency('$', 0) }}/hr

      v-layout(row wrap grey lighten-2 pt-2 pb-2)
        v-flex(xs12 text-xs-right pr-3 blue--text mt-1)
          <span style="vertical-align: bottom"> {{ likes }} </span>
          v-icon(fa class="blue--text") thumbs-up


    div( class="back")
      v-container
        v-layout(justify-space-around)
          v-flex(xs12)
            h6(class="title text-xs-center pt-2") {{ title }}

            v-menu( lazy
                    :close-on-content-click="true"
                    v-model="menu1"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-left="40"
                    max-width="290px"
                    dark )

              v-text-field( slot="activator"
                            label="Fecha"
                            v-model="Fecha"
                            readonly
                            prepend-icon="event"
                            light )

              v-date-picker( :months="months"
                             :days="days"
                             first-day-of-week="D"
                             :header-date-format="({ monthName, year }) => { return `${monthName} ${year}` }"
                             v-model="Fecha"
                             :allowed-dates="allowedDates"
                             no-title
                             dark
                             autosave)

               template( scope="{ save, cancel }" light)
                 v-card-actions
                   v-btn( dark warning @click.native="Fecha=null" ) Limpiar

            v-dialog(persistent
                     v-model="modal1"
                     style="width: 100%"
                     lazy)
              v-text-field(slot="activator"
                         label="Hora Inicial"
                         v-model="horaInicial"
                         prepend-icon="access_time"
                         readonly
                         light)
              v-time-picker(v-model="horaInicial"
                            :allowed-hours="horarioPermitidoInicial.horas"
                            :allowed-minutes="horarioPermitidoInicial.minutos"
                            autosave)

            v-dialog(persistent
                     v-model="modal2"
                     style="width: 100%"
                     lazy)
              v-text-field(slot="activator"
                         label="Hora Final"
                         v-model="horaFinal"
                         prepend-icon="access_time"
                         readonly
                         light)
              v-time-picker(v-model="horaFinal"
                            :allowed-hours="horarioPermitidoFinal.horas"
                            :allowed-minutes="horarioPermitidoFinal.minutos"
                            autosave)

            v-money(label="Total"
                    v-model="total"
                    readonly
                    prepend-icon="attach_money"
                    maskType="currency"
                    light)

            v-btn(light primary class="blue white--text" @click.native="aviso=true") APARTAR
            v-btn(light error class="white--text" v-on:click.native="reset") CANCELAR


</template>

<style lang="stylus" scoped>

ul li
  text-align left
  line-height 2

.g-card-container
  perspective 800px

.g-card
  transform-style preserve-3d
  transition transform 1s
  border-radius 5px
  position relative
  height 460px
  box-shadow 0px 0px 10px rgb(230,230,230)
  margin-bottom 64px

.front
  width 100%
  height 460px
  position absolute
  backface-visibility hidden
  border-radius 5px
  overflow hidden

.back
  transform rotateY( 180deg )
  width 100%
  height 460px
  backface-visibility hidden
  border-radius 5px
  overflow hidden

.flipped
  transform: rotateY( 180deg )

.g-card-img
  height 180px

.g-text-small
  font-family "Archivo Black", sans-serif
</style>

<script>
import USUARIOS from '~/queries/Usuarios.gql'
import COMPRAS from '~/queries/Compras.gql'
import CREATE_COMPRA from '~/queries/CreateCompra.gql'
import CUENTAS from '~/queries/Cuentas.gql'
import UPDATE_CUENTA from '~/queries/UpdateCuenta.gql'
import UPDATE_ESCENARIO from '~/queries/UpdateEscenario.gql'
import VMoney from '~/components/MonetaryInput.vue'

export default {
  data () {
    return {
      aviso: false,
      over: false,
      menu1: false,
      Fecha: null,
      UsuarioId: null,
      Cedula: null,
      NombreCliente: null,
      ApellidoCliente: null,
      Cuenta: null,
      horaInicial: '8:00am',
      horaFinal: '8:00am',
      tiempo: null,
      total: null,
      modal1: false,
      modal2: false,
      horarioPermitidoInicial: {
        horas: [8,9,10,11],
        minutos: {min: '00', max: '00'}
      },
      horarioPermitidoFinal: {
        horas: [9,10,11],
        minutos: {min: '00', max: '00'}
      },
      allowedDates: {
        min: '2017-10-25',
        max: '2017-11-01'
      },
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
      horasAm: [8,9,10,11],
      horasPm: [12,1,2,3,4,5,6,7,8,9,10],
      StoreCompraReady: false,
      StoreCuentaReady: false
    }
  },
  props: {
    Id: Number,
    src: String,
    title: String,
    esp1: String,
    esp2: String,
    esp3: String,
    likes: Number,
    precioDiurno: Number,
    precioNocturno: Number
  },
  mounted () {
    this.$nextTick(() => {
      this.$mqtt.subscribe('chaletapp/apollo/mutation')
      this.CalcularFechasPermitidas()
    })
  },
  apollo: {
    Usuarios: {
      query: USUARIOS,
      variables () {
        return {
          Cedula: this.$store.state.security.UserName
        }
      },
      loadingKey: 'loading',
      update (data) {
        for (let i = 0; i < data.Usuarios.length; i++) {
          this.UsuarioId = data.Usuarios[i].Id
          this.NombreCliente = data.Usuarios[i].Nombre
          this.ApellidoCliente = data.Usuarios[i].Apellido
        }
      }
    },
    Cuentas: {
      query: CUENTAS,
      loadingKey: 'loading',
      variables () {
        return {
          UsuarioId: this.UsuarioId
        }
      },
      update (data) {
        for(let i=0; i<data.Cuentas.length; i++){
          this.Cuenta = data.Cuentas[i]
          this.calcularPrecio()
        }
      }
    },
    Compras: {
      query: COMPRAS,
      loadingKey: 'loading',
      variables () {
        return {
          EscenarioId : this.Id,
          Fecha: this.Fecha
        }
      },
      update (data) {
        this.FiltrarHorarios(data.Compras)
      }
    }
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt FlipedCard')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        //case 'StoreUsuario': this.StoreUsuario(Obj)
        case 'StoreCuenta':
          this.StoreCuenta(Obj)
          break;
        case 'StoreCompra':
          this.StoreCompra(Obj)
          break;
      }
    }
  },
  watch: {
    horaInicial (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitidoInicial.horas = (ampm === 'am') ? this.horasAm : this.horasPm.slice(0,-2)
      this.calcularPrecio()
    },
    horaFinal (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitidoFinal.horas = (ampm === 'am') ? this.horasAm.slice(1) : this.horasPm
      this.calcularPrecio()
    }
  },
  methods: {
    FiltrarHorarios(Compras) {
      //console.log(Compras)
      for(let i=0; i<Compras.length; i++){
        let horaTmp = Number(Compras[i].HoraInicial.split(':')[0])
        if(horaTmp < 12){
          this.horasAm.splice(this.horasAm.indexOf(horaTmp), Compras[i].Tiempo)
        }else if(horaTmp >= 12){
          if(horaTmp===12){

          }else{
            horaTmp = horaTmp-12
          }

          this.horasPm.splice(this.horasPm.indexOf(horaTmp), Compras[i].Tiempo)

        }
      }
      let amPmInicial = this.horaInicial.split(':')[1].substr(2,2)
      this.horarioPermitidoInicial.horas = (amPmInicial === 'am') ? this.horasAm : this.horasPm.slice(0,-2)

      let amPmFinal = this.horaFinal.split(':')[1].substr(2,2)
      this.horarioPermitidoFinal.horas = (amPmFinal === 'am') ? this.horasAm.slice(1) : this.horasPm
    },
    CalcularFechasPermitidas (){
      let hoy = new Date((Date.now()+(1000*60*60*24)))
      this.allowedDates.min = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`
      let dentroDeUnMes = new Date((Date.now()+(1000*60*60*24*21)))
      this.allowedDates.max = `${dentroDeUnMes.getFullYear()}-${dentroDeUnMes.getMonth()+1}-${dentroDeUnMes.getDate()}`
      let hoy2 = new Date(Date.now())
      this.Fecha = `${hoy2.getFullYear()}-${hoy2.getMonth()+1}-${hoy2.getDate()}`
    },
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
      this.Cuenta = Cuenta

    },
    StoreCompra (Compra) {
      //console.log(Compra)
      var store = this.$apollo.provider.defaultClient

      try {
        var data = store.readQuery({
          query: COMPRAS,
          variables: {
            EscenarioId: Compra.EscenarioId,
            Fecha: Compra.Fecha
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
            EscenarioId: Compra.EscenarioId,
            Fecha: Compra.Fecha
          },
          data: data
        })

        data.compras ? this.FiltrarHorarios(data.Compras) : null;

      } catch (Err) {

        var data = {Compras: []}

        data.Compras.push(Compra)

        store.writeQuery({
          query: COMPRAS,
          variables: {
            EscenarioId: Compra.EscenarioId,
            Fecha: Compra.Fecha
          },
          data: data
        })

        data.compras ? this.FiltrarHorarios(data.Compras) : null;
      }


    },
    calcularPrecio () {
      let inicial = Number(this.horaInicial.split(':')[0])
      let final = Number(this.horaFinal.split(':')[0])
      if(this.horaInicial.endsWith('pm') && this.horaFinal.endsWith('am')){
        this.tiempo=0;
      }else if(this.horaInicial.endsWith('am') && this.horaFinal.endsWith('am') && inicial > final){
        this.tiempo=0;
      }else if(this.horaInicial.endsWith('pm') && this.horaFinal.endsWith('pm') && inicial > final && inicial !== 12){
        this.tiempo=0;
      }else if(this.horaInicial.endsWith('pm') && this.horaFinal.endsWith('pm') && final === 12){
        this.tiempo=0;
      }else if(this.horaInicial.endsWith('am') && (this.horaFinal.endsWith('am') || final === 12)){
        this.tiempo = final-inicial
      }else if(this.horaInicial.endsWith('am') && this.horaFinal.endsWith('pm') && final !== 12){
        this.tiempo = (final+12) - inicial
      }else if(inicial === 12 && this.horaFinal.endsWith('pm') && final !== 12){
        this.tiempo = (final+12)-inicial
      }else{
        this.tiempo = final-inicial
      }
      let precioDiurno = Number(this.precioDiurno)
      let precioNocturno = Number(this.precioNocturno)

      if(this.tiempo > 0){
        if(this.horaInicial.endsWith('am') && this.horaFinal.endsWith('am')){
          this.total = this.tiempo * precioDiurno
        }else if (this.horaInicial.endsWith('am') && this.horaFinal.endsWith('pm')){
          if (final === 12 || final <= 6){
            this.total = this.tiempo * precioDiurno
          }else{
            let phr = ((inicial-18)*(-1)*(precioDiurno))
            this.total = phr < 1 ? (phr*(-1)) + ((final-6) * precioNocturno) : phr + ((final-6) * precioNocturno)
          }
        }else if (this.horaInicial.endsWith('pm') && this.horaFinal.endsWith('pm')){
          if((inicial === 12 || inicial <= 6) && final <= 6){
            this.total = this.tiempo * precioDiurno
          }else if((inicial === 12 || inicial <= 6) && final > 6 ){
            let phr = ((inicial-6)*(-1)*(precioDiurno))
            this.total = phr < 1 ? (phr*(-1)) + ((final-6) * precioNocturno) : phr + ((final-6) * precioNocturno)
          }else {
            this.total = this.tiempo * precioNocturno
          }
        }
      }else {
        this.total = 0
      }

    },
    Recibo () {
      this.$store.commit('notificaciones/changeContext', 'success')
      this.$store.commit('notificaciones/changeIcon', 'done_all')
      this.$store.commit('notificaciones/changeMsg', 'Transacción Exitosa')
      this.$store.commit('notificaciones/changeState', 1)

      setTimeout(()=>{
        if(this.StoreCompraReady && this.StoreCuentaReady){
          this.StoreCompraReady = false
          this.StoreCuentaReady = false
          this.$store.commit('reports/changeVolver', '/apartar')
          this.$router.push('/reporte/factura')
        }else{
          console.log('esperando store compra y store cuenta')
        }
      }, 4000);
    },
    Guardar () {
      this.aviso=false

      if(!this.Cuenta || !(this.Cuenta.Saldo >= (this.total*0.20))){
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Fondos Insuficientes')
        this.$store.commit('notificaciones/changeState', 1)
        return null
      }

      if(this.tiempo === null || this.tiempo === undefined || this.tiempo === 0){
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Error de horario')
        this.$store.commit('notificaciones/changeState', 1)
        return null
      }

      var Ahora = new Date(Date.now())
      var FechaHoy = `${Ahora.getFullYear()}-${(Ahora.getMonth() + 1) < 10 ? '0' + (Ahora.getMonth() + 1) : Ahora.getMonth() + 1}-${Ahora.getDate()}`

      var Hora = Ahora.getHours() > 12 ? Ahora.getHours() - 12 : Ahora.getHours();
      var AmPm = Ahora.getHours() >= 12 ? "pm" : "am";
      Hora = Hora < 10 ? "0" + Hora : Hora;
      var Minutos = Ahora.getMinutes() < 10 ? "0" + Ahora.getMinutes() : Ahora.getMinutes();
      Hora = Hora + ":" + Minutos + AmPm;

      const Compra = {
        UsuarioId: this.UsuarioId,
        EscenarioId: this.Id,
        HoraInicial: this.horaInicial,
        HoraFinal: this.horaFinal,
        Tiempo: this.tiempo,
        Abono: this.total*0.20,
        Saldo: this.total*0.80,
        Estado: "Apartado",
        Fecha: this.Fecha,
        Expedicion: FechaHoy,
        Hora: Hora
      }

      this.$store.commit('compra/changeExpedicion', Compra.Expedicion)
      this.$store.commit('compra/changeCedula', this.$store.state.security.UserName)
      this.$store.commit('compra/changeApellido', this.ApellidoCliente)
      this.$store.commit('compra/changeNombre', this.NombreCliente)
      this.$store.commit('compra/changeEscenario', this.title)
      this.$store.commit('compra/changeFecha', Compra.Fecha)
      this.$store.commit('compra/changeHoraInicial', Compra.HoraInicial)
      this.$store.commit('compra/changeHoraFinal', Compra.HoraFinal)
      this.$store.commit('compra/changeTiempo', Compra.Tiempo)
      this.$store.commit('compra/changeAbono', Compra.Abono)
      this.$store.commit('compra/changeSaldo', Compra.Saldo)


      let NuevoSaldo = this.Cuenta.Saldo - this.total*0.20

      const Cuenta = {
        Id: this.Cuenta.Id,
        UsuarioId: this.UsuarioId,
        Saldo: NuevoSaldo
      };

      const Escenario = {
        Id: this.Id,
        Likes: this.likes + 1
      };

      this.reset ()

      this.$apollo.mutate ({
        mutation: CREATE_COMPRA,
        variables: {
          UsuarioId: Compra.UsuarioId,
          EscenarioId: Compra.EscenarioId,
          HoraInicial: Compra.HoraInicial,
          HoraFinal: Compra.HoraFinal,
          Tiempo: Compra.Tiempo,
          Abono: Compra.Abono,
          Saldo: Compra.Saldo,
          Estado: Compra.Estado,
          Fecha: Compra.Fecha,
          Expedicion: Compra.Expedicion,
          Hora: Compra.Hora
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreCompra', Obj: res.CreateCompra}))
        }
      }).then(() => {
        this.StoreCompraReady = true
        this.Recibo()

      }).catch(() => {
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
        this.$store.commit('notificaciones/changeState', 1)
      })

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
      }).then(()=>{
        this.StoreCuentaReady = true
        this.Recibo()
      }).catch(() => {
        this.$store.commit('notificaciones/changeContext', 'error')
        this.$store.commit('notificaciones/changeIcon', 'error_outline')
        this.$store.commit('notificaciones/changeMsg', 'Error en Transacción')
        this.$store.commit('notificaciones/changeState', 1)
      })

      this.$apollo.mutate ({
        mutation: UPDATE_ESCENARIO,
        variables: {
          Id: Escenario.Id,
          Likes: Escenario.Likes
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreEscenario', Obj: res.UpdateEscenario}))
        }
      })

    },
    reset () {
      this.over = false
      this.horaInicial = '8:00am'
      this.horaFinal = '8:00am'
      this.total = null
      this.tiempo = null
      this.calcularPrecio()
    }
  },
  components: {
    VMoney
  }
}
</script>
