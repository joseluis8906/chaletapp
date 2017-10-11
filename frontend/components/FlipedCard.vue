<template lang="pug">
v-flex(xs12 md6 lg4 mb-5 class="g-card-container" v-on:mouseover="over=true" v-on:mouseout="over=false")
  v-card(class="g-card" v-bind:class="{ flipped: over }" light)
    div(class="front")
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


    div( class="back" )
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

          v-btn(light primary class="blue white--text") Apartar
          v-btn(primary fab small class="blue")
            v-icon(fa class="white--text") thumbs-up


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
      horaInicial: null,
      horaFinal: null,
      total: 20000,
      menu1: false,
      menu2: false,
      horarioPermitido: {
        horas: {min: '8AM', max: '10PM'},
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
}
</script>
