<template lang="pug">
v-container(pt-0 pr-0 pb-0 pl-0 mt-0 mb-0)
  page(v-bind:size="page.Size" v-bind:layout="page.Layout" v-for="(page, i) in pages" :key="i")
    table(style="width: 100%; height: auto; border: none; margin-bottom: 3mm")
      thead
      tbody
        tr
          th(style="width: 30%; text-align: center")
            img(src="/football-player.svg" style="width: 10mm")
          th Factura de Compra

        tr
          td Expedido
          td(class="text-xs-right") {{ Expedicion }}

        tr
          td Cédula
          td(class="text-xs-right") {{ Cedula }}

        tr
          td Apellido
          td(class="text-xs-right") {{ Apellido }}

        tr
          td Nombre
          td(class="text-xs-right") {{ Nombre }}

        tr
          td Escenario
          td(class="text-xs-right") {{ Escenario }}

        tr
          td Fecha
          td(class="text-xs-right") {{ Fecha }}

        tr
          td HoraInicial
          td(class="text-xs-right") {{ HoraInicial }}

        tr
          td HoraFinal
          td(class="text-xs-right") {{ HoraFinal }}

        tr
          td Tiempo
          td(class="text-xs-right") {{ Tiempo }} hr(s)

        tr
          td Abono
          td(class="text-xs-right") {{ Abono | currency('$', 0) }}

        tr
          td Saldo
          td(class="text-xs-right") {{ Saldo | currency('$', 0) }}


</template>

<script>

import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      pages: [
        {Size: 'A8', Layout: 'Portrait'}
      ],
      items: []
    }
  },
  computed: {
    Expedicion () {
      return this.$store.state.compra.Expedicion
    },
    Cedula () {
      return this.$store.state.compra.Cedula
    },
    Nombre () {
      return this.$store.state.compra.Nombre
    },
    Apellido () {
      return this.$store.state.compra.Apellido
    },
    Escenario () {
      return this.$store.state.compra.Escenario
    },
    HoraInicial () {
      return this.$store.state.compra.HoraInicial
    },
    HoraFinal () {
      return this.$store.state.compra.HoraFinal
    },
    Tiempo () {
      return this.$store.state.compra.Tiempo
    },
    Abono () {
      return this.$store.state.compra.Abono
    },
    Saldo () {
      return this.$store.state.compra.Saldo
    },
    Fecha () {
      return this.$store.state.compra.Fecha
    }
  },
  layout: 'report',
  fetch ({ store }) {
    store.commit('reports/changeTitle', 'Factura de Compra')
  }
}
</script>

<style lang="stylus" scoped>

@page
  size A8 Portrait
  margin 0mm
  padding 0mm

table
  font-size: 9pt
  border-spacing 0px
  border-collapse collapse

th, td
  border none

th
  height 9mm
  line-height 10pt

td
  height 5mm
  padding-left: 1mm
  padding-right: 1mm

.lado
  height 4mm
  font-size 8pt
  padding 0
</style>
