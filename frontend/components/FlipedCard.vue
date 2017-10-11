<template lang="pug">
v-flex(xs12 md6 lg4 mb-5 class="g-card-container")
  v-card(class="g-card" v-bind:class="{ flipped: over }" light)
    div(class="front" v-on:click="over=true")
      div(:style="{backgroundImage:'url('+src+')', backgroundSize:'cover', height:'180px', display:'table-cell', width: '360px', verticalAlign:'bottom'}" class="g-card-img")
        h3(class="text-xs-left title white--text ml-2 mb-3" style="text-shadow: 2px 2px rgba(40,40,40,0.75);") {{ title }}

      p(class="subheading text-xs-left pl-2 pt-2") Especificaciones:
      ul(class="ml-3 mb-5")
        li {{ esp1 }}
        li {{ esp2 }}
        li {{ esp3 }}

      v-layout(row wrap grey lighten-2 pt-2 pb-2)
        v-flex(xs6 pl-3 grey--text text--darken-1 mt-1)
          | ${{ precio }}/hr
        v-flex(xs6 text-xs-right pr-3 blue--text mt-1)
          <span style="vertical-align: bottom"> 10 </span>
          v-icon(fa class="blue--text") thumbs-up


    div( class="back")
      h6(class="title text-xs-center pt-2") {{ title }}
      v-layout(row pr-2 pl-2)
        v-flex()
          v-menu(lazy
                 :close-on-content-click="false"
                 v-model="menu1"
                 transition="scale-transition"
                 offset-y
                 :nudge-left="40"
                 light)
            v-text-field(slot="activator"
                       label="Hora Inicial"
                       v-model="horaInicial"
                       prepend-icon="access_time"
                       readonly
                       light)
            v-time-picker(v-model="horaInicial"
                          :allowed-hours="horarioPermitido.horas"
                          :allowed-minutes="horarioPermitido.minutos"
                          autosave light)

          v-menu(lazy
                 :close-on-content-click="false"
                 v-model="menu2"
                 transition="scale-transition"
                 offset-y
                 :nudge-left="40"
                 light)
            v-text-field(slot="activator"
                       label="Hora Final"
                       v-model="horaFinal"
                       prepend-icon="access_time"
                       readonly
                       light)
            v-time-picker(v-model="horaFinal"
                          :allowed-hours="horarioPermitido.horas"
                          :allowed-minutes="horarioPermitido.minutos"
                          autosave light)


          v-text-field(label="Total"
                       v-model="total"
                       readonly
                       prepend-icon="attach_money"
                       style="width: 90%"
                       light)

          v-btn(light primary class="blue white--text") APARTAR
          v-btn(light error class="white--text" v-on:click.native="reset()") CANCELAR


</template>

<style lang="stylus" scoped>

ul li
  text-align left

.g-card-container
  perspective 512px
  height 380px

.g-card
  transform-style preserve-3d
  transition transform 1s
  position relative
  border-radius 5px
  height 380px
  box-shadow 0px 0px 10px rgb(230,230,230)


.front
  width 100%
  height 380px
  backface-visibility hidden
  position absolute
  border-radius 5px
  overflow hidden

.back
  transform rotateY( 180deg )
  height 380px
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
export default {
  data () {
    return {
      over: false,
      horaInicial: '8:00am',
      horaFinal: '8:00am',
      total: 0,
      menu1: false,
      menu2: false,
      horarioPermitido: {
        horas: [8,9,10,11],
        minutos: {min: '00', max: '00'}
      }
    }
  },
  props: {
    src: String,
    title: String,
    esp1: String,
    esp2: String,
    esp3: String,
    precio: String
  },
  watch: {
    horaInicial (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitido.horas = (ampm === 'am') ? [8,9,10,11] : [12,1,2,3,4,5,6,7,8]
      this.calcularPrecio()
    },
    horaFinal (value) {
      let ampm = value.split(':')[1].substr(2,2)
      this.horarioPermitido.horas = (ampm === 'am') ? [8,9,10,11] : [12,1,2,3,4,5,6,7,8]
      this.calcularPrecio()
    }
  },
  methods: {
    calcularPrecio () {
      let inicial = Number(this.horaInicial.split(':')[0])
      let final = Number(this.horaFinal.split(':')[0])
      let precio = Number(this.precio)
      this.total = (final-inicial) * precio
    },
    reset () {
      this.over = false
      this.horaInicial = '8:00am'
      this.horaFinal = '8:00am'
      this.total = 0
    }
  }
}
</script>
