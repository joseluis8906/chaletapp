ESCENARIOS<template lang="pug">
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

  v-flex( xs12 mt-3 md8 lg6 )
    v-card
      v-layout(row wrap pt-3 light-blue)
        v-flex( xs12 )
          h5(class="grey--text text--lighten-4 text-xs-center bold")
            v-icon(ma) group
            |  Escenario
      v-card-text
        v-layout( row wrap)
          v-flex( xs12 )

            v-select(
              v-bind:items="ItemsTipo"
              v-model="Tipo"
              label="Tipo"
              autocomplete
              bottom )

            v-text-field( label="Codigo" v-model="Codigo" dark )

            v-money(label="Precio" v-model="Precio" maskType="currency")

            v-select(
              v-bind:items="ItemsActivo"
              v-model="Activo"
              label="Activo"
              autocomplete
              bottom )

      v-card-actions
        v-spacer
        v-btn( dark @click.native="Reset" ) Cancelar
        v-btn( dark primary @click.native="CreateOrUpdate" ) Guardar
</template>

<script>

import ESCENARIOS from '~/queries/Escenarios.gql'
import CREATE_ESCENARIO from '~/queries/CreateEscenario.gql'
import UPDATE_ESCENARIO from '~/queries/UpdateEscenario.gql'

import VMoney from '~/components/MonetaryInput.vue'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    Id: null,
    Codigo: null,
    Tipo: null,
    Codigo: null,
    Precio: null,
    Activo: null,
    ItemsTipo: [
      'Cancha'
    ],
    ItemsActivo: [
      'Si',
      'No'
    ],
    loading: 0
  }),
  beforeMount () {
    if (sessionStorage.getItem('x-access-token') === null || sessionStorage.getItem('x-access-token') === null) {
      this.$router.push('/')
    } else {
      var Roles = JSON.parse(sessionStorage.getItem('x-access-roles'))
      this.$store.commit('security/AddRoles', Roles);
    }
  },
  apollo: {
    Escenarios: {
      query: ESCENARIOS,
      variables () {
        return {
          Tipo: this.Tipo,
          Codigo: this.Codigo
        }
      },
      loadingKey: 'loading',
      update (data) {
        //console.log(data)
        this.LoadUi(data.Escenarios)
      }
    },
  },
  methods: {
    CreateOrUpdate () {
      if (this.Id === null) {
        this.Create();
      }else{
        this.Update();
      }
    },
    Create () {
      const Escenario = {
        Tipo: this.Tipo,
        Codigo: this.Codigo,
        Precio: this.Precio,
        Activo: this.Activo
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: CREATE_ESCENARIO,
        variables: {
          Tipo: Escenario.Tipo,
          Codigo: Escenario.Codigo,
          Precio: Escenario.Precio,
          Activo: Escenario.Activo
      },
      loadingKey: 'loading',
      update: (store, { data: res }) => {
        //console.log(Ente);
        try{
          var data = store.readQuery({
            query: ESCENARIOS,
            variables: {
              Tipo: res.CreateEscenario.Tipo,
              Codigo: res.CreateEscenario.Codigo,
            }
          })

          data.Escenarios.push(res.CreateEscenario)

          store.writeQuery({
            query: ESCENARIOS,
            variables: {
              Tipo: res.CreateEscenario.Tipo,
              Codigo: res.CreateEscenario.Codigo,
            },
            data: data
          })

        } catch (Err) {

          var data = {Escenarios: []}

          data.Escenarios.push(res.CreateEscenario)

          store.writeQuery({
            query: ESCENARIOS,
            variables: {
              Tipo: res.CreateEscenario.Tipo,
              Codigo: res.CreateEscenario.Codigo,
            },
            data: data
          })

        }

      },
      }).then( data => {
        //console.log(data)
      }).catch( Err => {
        //console.log(Err)
      })
    },
    Update () {
      //console.log(this.Password)
      const Escenario = {
        Id: this.Id,
        Tipo: this.Tipo,
        Codigo: this.Codigo,
        Precio: this.Precio,
        Activo: this.Activo
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: UPDATE_ESCENARIO,
        variables: {
          Id: Escenario.Id,
          Tipo: Escenario.Tipo,
          Codigo: Escenario.Codigo,
          Precio: Escenario.Precio,
          Activo: Escenario.Activo
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          //console.log(Ente);
          try {
            var data = store.readQuery({
              query: ESCENARIOS,
              variables: {
                Tipo: res.UpdateEscenario.Tipo,
                Codigo: res.UpdateEscenario.Codigo,
              }
            })

            for (let i=0; i<data.Escenarios.length; i++) {
              if (data.Escenarios[i].Id === res.UpdateEscenario.Id) {
                data.Escenarios[i] = res.UpdateEscenario
              }
            }

            store.writeQuery({
              query: ESCENARIOS,
              variables: {
                Tipo: res.UpdateEscenario.Tipo,
                Codigo: res.UpdateEscenario.Codigo,
              },
              data: data
            })

          } catch (Err) {

            var data = {Escenarios: []}

            data.Escenarios.push(res.UpdateEscenario)

            store.writeQuery({
              query: ESCENARIOS,
              variables: {
                Tipo: res.UpdateEscenario.Tipo,
                Codigo: res.UpdateEscenario.Codigo,
              },
              data: data
            })

          }

        },
      }).then( data => {
        //console.log(data)
      }).catch( Err => {
        //console.log(Err)
      })
    },
    Reset () {
      this.Id = null
      this.Tipo = null
      this.Codigo = null
      this.Precio = null
      this.Activo = null
    },
    LoadUi (Escenarios) {
      if( Escenarios.length === 0 ) {
        this.Id = null
      }

      for (let i=0; i<Escenarios.length; i++) {
        if ( this.Codigo === Escenarios[i].Codigo ) {
          this.Id = Escenarios[i].Id
          this.Tipo = Escenarios[i].Tipo
          this.Codigo = Escenarios[i].Codigo
          this.Precio = Escenarios[i].Precio
          this.Activo = Escenarios[i].Activo
          break
        }else{
          this.Id = null
        }
      }
    }
  },
  components: {
    VMoney
  }
};


</script>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute

</style>
