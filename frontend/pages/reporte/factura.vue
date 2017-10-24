<template lang="pug">
v-container(pt-0 pr-0 pb-0 pl-0 mt-0 mb-0)
  page(v-bind:size="page.Size" v-bind:layout="page.Layout" style="width: 57mm; min-height: 74mm; padding: 2mm" v-for="(page, i) in pages" :key="i")
    table(style="width: 100%; height: auto; border: none; margin-bottom: 3mm")
      thead
      tbody
        tr
          th(style="width: 30%; text-align: center")
            img(src="/football-player.svg" style="width: 10mm")
          th Factura de Compra

        tr
          td Expedición
          td {{ Fecha }}

        tr
          td Cédula
          td {{ Cedula }}

        tr
          td Apellido
          td {{ ApellidoCliente }}

        tr
          td Nombre
          td {{ NombreCliente }}

        tr
          td Escenario
          td {{ NombreEscenario }}

        tr
          td Fecha
          td {{ Fecha }}

        tr
          td HoraInicial
          td {{ HoraInicial }}

        tr
          td HoraFinal
          td {{ HoraFinal }}

        tr
          td Tiempo
          td {{ Tiempo }}

        tr
          td Precio
          td {{ Precio }}


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
      Fecha: null,
      Cedula: null,
      NombreCliente: null,
      ApellidoCliente: null,
      NombreEscenario: null,
      HoraInicial: null,
      HoraFinal: null,
      Precio: null,
      Tiempo: null,
      Fecha: null,
      items: []
    }
  },
  computed: {
    Numero () {
      return this.$store.state.remision.Numero
    }
  },
  layout: 'report',
  fetch ({ store }) {
    store.commit('reports/changeTitle', 'Factura')
  },
  apollo: {
    /*Remisions:{
      query: REMISIONS,
      variables () {
        return {
          Numero: this.Numero
        }
      },
      loadingKey: "loading",
      update (data) {
        //console.log(data)

        if (data.Remisions.length > 0) {

          this.Fecha.AAAA = data.Remisions[0].Fecha.split('-')[0]
          this.Fecha.MM = data.Remisions[0].Fecha.split('-')[1]
          this.Fecha.DD = data.Remisions[0].Fecha.split('-')[2]
          this.Cliente = data.Remisions[0].Ente

          this.items = []

          for (let i=0; i<data.Remisions.length; i++) {

            let tmp = {
              Produccion: {
                Cantidad: data.Remisions[i].Produccion.Cantidad,
                FechaFabricacion: data.Remisions[i].Produccion.FechaFabricacion,
                FechaVencimiento: data.Remisions[i].Produccion.FechaVencimiento,
                Lote: data.Remisions[i].Produccion.Lote,
                Envase: {
                  Numero: data.Remisions[i].Produccion.Envase.Numero
                },
                Producto: {
                  Nombre: data.Remisions[i].Produccion.Producto.Nombre,
                  UnidadDeMedida: data.Remisions[i].Produccion.Producto.UnidadDeMedida
                }
              },
              Envase: {
                Numero: data.Remisions[i].Envase.Numero
              },
              Total: data.Remisions[i].Total
            }

            this.items.push(tmp)

          }

          if (this.items.length<12) {
            this.pages[0] = {Size: 'MidLetter', Layout: 'Landscape'}

            for (let i=this.items.length; i<12; i++)
            {
              let tmp = {
                Produccion: {
                  Cantidad: null,
                  FechaFabricacion: null,
                  FechaVencimiento: null,
                  Lote: null,
                  Envase: {
                    Numero: null
                  },
                  Producto: {
                    Nombre: null,
                    UnidadDeMedida: null
                  }
                },
                Envase: {
                  Numero: null
                },
                Total: null
              }

              this.items.push(tmp)

            }

            console.log(this.items)

          } else if (this.items.length>=12 && this.items.length<40) {

            for (let i=this.items.length; i<40; i++)
            {
              let tmp = {
                Produccion: {
                  Cantidad: null,
                  FechaFabricacion: null,
                  FechaVencimiento: null,
                  Lote: null,
                  Envase: {
                    Numero: null
                  },
                  Producto: {
                    Nombre: null,
                    UnidadDeMedida: null
                  }
                },
                Envase: {
                  Numero: null
                },
                Total: null
              }

              this.items.push(tmp)

            }

          }


        } else {

          console.log('error')

        }
      }
    }*/
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
