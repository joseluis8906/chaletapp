<template lang="pug">
v-flex(xs12 sm4 md4 lg3 class="g-card-container")
  v-card(class="g-card" v-bind:class="{ flipped: over }" light)
    div(class="front" v-on:click="over=true")
      div(:style="{backgroundImage:'url('+src+')', backgroundSize:'cover', height:'180px', width: '100%', verticalAlign:'bottom'}" class="g-card-img")
        h3(class="text-xs-left title white--text ml-2" style="text-shadow: 2px 2px rgba(40,40,40,0.75); margin-top: 140px; display: inline-block") {{ title }}

      div(class="pl-2 pt-2" style="height:165px; border-bottom: 1px solid rgb(180,180,180)")
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
                            :allowed-hours="horarioPermitido.horas"
                            :allowed-minutes="horarioPermitido.minutos"
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
                            :allowed-hours="horarioPermitido.horas"
                            :allowed-minutes="horarioPermitido.minutos"
                            autosave)

            v-money(label="Total"
                    v-model="total"
                    readonly
                    prepend-icon="attach_money"
                    maskType="currency"
                    light)

            v-btn(light primary class="blue white--text" @click.native="Guardar()") APARTAR
            v-btn(light error class="white--text" v-on:click.native="reset()") CANCELAR


</template>

<style lang="stylus" scoped>

ul li
  text-align left

.g-card-container
  perspective 800px

.g-card
  transform-style preserve-3d
  transition transform 1s
  border-radius 5px
  position relative
  height 390px
  box-shadow 0px 0px 10px rgb(230,230,230)

.front
  width 100%
  height 390px
  position absolute
  backface-visibility hidden
  border-radius 5px
  overflow hidden

.back
  transform rotateY( 180deg )
  width 100%
  height 390px
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
import CREATE_COMPRA from '~/queries/CreateCompra.gql'
import VMoney from '~/components/MonetaryInput.vue'

export default {
  data () {
    return {
      over: false,
      UsuarioId: null,
      horaInicial: '8:00am',
      horaFinal: '8:00am',
      tiempo: null,
      total: 0,
      modal1: false,
      modal2: false,
      horarioPermitido: {
        horas: [8,9,10,11],
        minutos: {min: '00', max: '00'}
      }
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
    })
  },
  apollo: {
    Usuarios: {
      query: USUARIOS,
      variables () {
        return {
          UserName: this.$store.state.security.UserName
        }
      },
      loadingKey: 'loading',
      update (data) {
        for (let i = 0; i < data.Usuarios.length; i++) {
          this.UsuarioId = data.Usuarios[i].Id
        }
      }
    },
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        //case 'StoreUsuario': this.StoreUsuario(Obj)
        //case 'StoreCuenta': this.StoreCuenta(Obj)
      }
    }
  },
  watch: {
    horaInicial (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitido.horas = (ampm === 'am') ? [8,9,10,11] : [12,1,2,3,4,5,6,7,8]
      this.calcularPrecio()
    },
    horaFinal (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitido.horas = (ampm === 'am') ? [8,9,10,11] : [12,1,2,3,4,5,6,7,8,9,10]
      this.calcularPrecio()
    }
  },
  methods: {
    calcularPrecio () {
      let inicial = Number(this.horaInicial.split(':')[0])
      let final = Number(this.horaFinal.split(':')[0])
      if(this.horaInicial.endsWith('am') && (this.horaFinal.endsWith('am') || final === 12)){
        this.tiempo = final-inicial
      }else if(this.horaInicial.endsWith('am') && this.horaFinal.endsWith('pm') && final !== 12){
        this.tiempo = (final+12) - inicial
      }else if(inicial === 12 && this.horaFinal.endsWith('pm')){
        this.tiempo = (final+12)-inicial
      }else{
        this.tiempo = final-inicial
      }
      let precioDiurno = Number(this.precioDiurno)
      let precioNocturno = Number(this.precioNocturno)

      console.log('el tiempo fue de: '+this.tiempo + 'hrs')

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
    Guardar () {
      var Ahora = new Date(Date.now())
      var Fecha = `${Ahora.getFullYear()}-${(Ahora.getMonth() + 1) < 10 ? '0' + (Ahora.getMonth() + 1) : Ahora.getMonth() + 1}-${Ahora.getDate()}`

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
        Precio: this.total,
        Estado: "Completado",
        Fecha: Fecha,
        Hora: Hora
      }

      this.reset ()

      this.$apollo.mutate ({
        mutation: CREATE_COMPRA,
        variables: {
          UsuarioId: Compra.UsuarioId,
          EscenarioId: Compra.EscenarioId,
          HoraInicial: Compra.HoraInicial,
          HoraFinal: Compra.HoraFinal,
          Tiempo: Compra.Tiempo,
          Precio: Compra.Precio,
          Estado: Compra.Estado,
          Fecha: Compra.Fecha,
          Hora: Compra.Hora
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreCompra', Obj: res.CreateCompra}))
        }
      })

    },
    reset () {
      this.over = false
      this.horaInicial = '8:00am'
      this.horaFinal = '8:00am'
      this.total = 0
      this.tiempo = null
    }
  },
  components: {
    VMoney
  }
}
</script>
