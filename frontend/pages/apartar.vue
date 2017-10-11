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

  v-flex( xs12 md10 lg8 mt-5 )
    v-layout(row wrap justify-space-around class="g-layout")
      v-fliped-card( title="Cancha de futbol 01"
                     src="/cancha01.jpeg"
                     esp1="60x18 m"
                     esp2="Grava sintética"
                     esp3="Cubierta anti-lluvia"
                     precio="20.000" )

</template>

<style lang="stylus" scoped>

h5.bold
  font-weight boldoverflow hidden

.alert-especial
  position absolute

</style>

<script>

import ESCENARIOS from '~/queries/Escenarios.gql'
import CREATE_ESCENARIO from '~/queries/CreateEscenario.gql'
import UPDATE_ESCENARIO from '~/queries/UpdateEscenario.gql'

import VFlipedCard from '~/components/FlipedCard.vue'

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
    over1: false,
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
        //console.log(data)overflow hidden
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
    VFlipedCard
  }
};


</script>
