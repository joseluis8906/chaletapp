<template lang="pug">
v-container(pt-0 pr-0 pb-0 pl-0 mt-0 mb-0)
  page(v-bind:size="page.Size" v-bind:layout="page.Layout" v-for="(page, i) in pages" :key="i")
    table(style="width: 100%; height: auto; margin-bottom: 3mm")
      thead
      tbody
        tr
          th(rowspan="2" style="width: 7.5%; text-align: center")
            img(src="/football-player.svg" style="width: 100%")
          th(colspan=3 style="width: 14%;") Fecha Expedición
          th(rowspan="2" style="text-align: center; width: 65%") INFORME DE APARTADOS
        tr
          td(style="text-align: center") {{ Expedicion.AAAA }}
          td(style="text-align: center") {{ Expedicion.MM }}
          td(style="text-align: center") {{ Expedicion.DD }}

    table(style="width: 100%; height: auto" class="table-kardex" )
      thead
        tr(class="green lighten-3")
          th Cedula
          th Apellido
          th Nombre
          th Escenario
          th HoraInicial
          th HoraFinal
          th Tiempo
          th Precio
          th Estado
          th Fecha
      tbody
        tr(v-for="(item, j) in items" :key="j")
          td(style="text-align: right") {{ item.Usuario.Cedula }}
          td(style="text-align: right") {{ item.Usuario.Apellido }}
          td(style="text-align: right") {{ item.Usuario.Nombre }}
          td(style="text-align: right") {{ item.Escenario.Nombre }}
          td(style="text-align: right") {{ item.HoraInicial }}
          td(style="text-align: right") {{ item.HoraFinal }}
          td(style="text-align: right") {{ item.Tiempo }} hr(s)
          td(style="text-align: right") $ {{ item.Precio }}
          td(style="text-align: right") {{ item.Estado }}
          td(style="text-align: right") {{ item.Fecha }}

</template>

<script>

import { mapMutations } from 'vuex'
import COMPRAS from '~/queries/Compras.gql'


export default {
  data () {
    return {
      pages: [
        {Size: 'Letter', Layout: 'Landscape'}
      ],
      Expedicion: {
        AAAA: null,
        MM: null,
        DD: null
      },
      items: []
    }
  },
  computed: {
    Fecha () {
      return this.$store.state.informe.Fecha
    }
  },
  layout: 'report',
  fetch ({ store }) {
    store.commit('reports/changeTitle', 'Informe de Apartados')
  },
  apollo: {
    Compras:{
      query: COMPRAS,
      variables () {
        return {
          Fecha: this.Fecha
        }
      },
      loadingKey: "loading",
      update (data) {
        //console.log(data)
        this.Expedicion.AAAA = data.Compras[0].Fecha.split('-')[0]
        this.Expedicion.MM = data.Compras[0].Fecha.split('-')[1]
        this.Expedicion.DD = data.Compras[0].Fecha.split('-')[2]

        this.items = []

        for (let i=0; i<data.Compras.length; i++) {

          let tmp = {
            Usuario: {
              Cedula: data.Compras[i].Usuario.Cedula,
              Apellido: data.Compras[i].Usuario.Apellido,
              Nombre: data.Compras[i].Usuario.Nombre,
            },
            Escenario: {
              Nombre: data.Compras[i].Escenario.Nombre
            },
            HoraInicial: data.Compras[i].HoraInicial,
            HoraFinal: data.Compras[i].HoraFinal,
            Tiempo: data.Compras[i].Tiempo,
            Precio: data.Compras[i].Precio,
            Estado: data.Compras[i].Estado,
            Fecha: data.Compras[i].Fecha
          }
          this.items.push(tmp)
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@page
  size letter portraid
  margin 0mm
  padding 0mm

table
  font-size: 9pt
  border-spacing 0px
  border-collapse collapse

th, td
  border 1px solid black

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
