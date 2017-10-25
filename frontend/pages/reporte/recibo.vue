<template lang="pug">
v-container(pt-0 pr-0 pb-0 pl-0 mt-0 mb-0)
  page(v-bind:size="page.Size" v-bind:layout="page.Layout" v-for="(page, i) in pages" :key="i")
    table(style="width: 100%; height: auto; border: none; margin-bottom: 3mm")
      thead
      tbody
        tr
          th(style="width: 30%; text-align: center")
            img(src="/football-player.svg" style="width: 10mm")
          th Recibo de Recarga

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
          td Saldo Anterior
          td(class="text-xs-right") {{ Saldo }}

        tr
          td Recarga
          td(class="text-xs-right") {{ Recarga }}

        tr
          td Total
          td(class="text-xs-right") {{ Total }}


</template>

<script>

import { mapMutations } from 'vuex'
//import REMISIONS from '~/queries/Remisions.gql'


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
      return this.$store.state.recarga.Expedicion
    },
    Cedula () {
      return this.$store.state.recarga.Cedula
    },
    Nombre () {
      return this.$store.state.recarga.Nombre
    },
    Apellido () {
      return this.$store.state.recarga.Apellido
    },
    Saldo () {
      return this.$store.state.recarga.Saldo
    },
    Recarga () {
      return this.$store.state.recarga.Recarga
    },
    Total () {
      return this.$store.state.recarga.Total
    }
  },
  layout: 'report',
  fetch ({ store }) {
    store.commit('reports/changeTitle', 'Recibo de Recarga')
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
