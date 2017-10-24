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

  v-flex(xs12 mt-5)
    v-layout(row wrap justify-space-bettwen align-center class="g-layout")
      v-fliped-card(v-for="(item, i) in itemsEscenario" :key="i"
                    :Id="item.Id"
                    :title="item.Nombre"
                    :src="item.Imagen"
                    :esp1="item.Esp1"
                    :esp2="item.Esp2"
                    :precioDiurno="item.PrecioDiurno"
                    :precioNocturno="item.PrecioNocturno"
                    :likes="item.Likes")

</template>

<style lang="stylus" scoped>

h5.bold
  font-weight boldoverflow hidden

.alert-especial
  position absolute

</style>

<script>

import ESCENARIOS from '~/queries/Escenarios.gql'
import VFlipedCard from '~/components/FlipedCard.vue'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    itemsEscenario: null,
    loading: 0
  }),
  beforeMount () {
    if (sessionStorage.getItem('x-access-token') === null || sessionStorage.getItem('x-access-token') === undefined) {
      this.$router.push('/')
    } else {
      var Roles = JSON.parse(sessionStorage.getItem('x-access-roles'))
      var UserName = sessionStorage.getItem('x-access-username')
      this.$store.commit('security/AddRoles', Roles);
      this.$store.commit('security/SetUserName', UserName);
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$mqtt.subscribe('chaletapp/apollo/mutation')
    })
  },
  apollo: {
    Escenarios: {
      query: ESCENARIOS,
      loadingKey: 'loading',
      update (data) {
        this.CargarEscenarios(data.Escenarios)
      }
    }
  },
  mqtt: {
    'chaletapp/apollo/mutation': function (val) {
      console.log('mqtt apartar')
      var res = (JSON.parse(val))
      var Method = res.Method
      var Obj = res.Obj

      switch (Method) {
        case 'StoreEscenario': this.StoreEscenario(Obj)
      }

    }
  },
  methods: {
    StoreEscenario (Escenario) {
      var store = this.$apollo.provider.defaultClient

      try{
        var data = store.readQuery({
          query: ESCENARIOS
        })

        var Existe = false

        for (let i=0; i<data.Escenarios.length; i++) {
          if (data.Escenarios[i].Id === Escenario.Id) {
            Existe = true
            data.Escenarios[i] = Escenario
          }
        }

        (!Existe) ? data.Escenarios.push(Escenario) : null;

        store.writeQuery({
          query: ESCENARIOS,
          data: data
        })

      } catch (Err) {

        var data = {Escenarios: []}

        data.Escenarios.push(Escenario)

        store.writeQuery({
          query: ESCENARIOS,
          data: data
        })
      }

      for(let i=0;  i < this.itemsEscenario.length; i++){
        if(this.itemsEscenario[i].Nombre === Escenario.Nombre){
          var tmp = Object.assign({}, Escenario)
          this.itemsEscenario[i] = tmp
        }
      }

    },
    CargarEscenarios (Escenarios) {
      //console.log(this.$store.state.security.UserName)
      this.itemsEscenario = []
      for (let i=0; i<Escenarios.length; i++){
        var tmp = {
          Id: Escenarios[i].Id,
          Nombre: Escenarios[i].Nombre,
          Imagen: Escenarios[i].Imagen,
          Esp1: Escenarios[i].Esp1,
          Esp2: Escenarios[i].Esp2,
          PrecioDiurno: Escenarios[i].PrecioDiurno,
          PrecioNocturno: Escenarios[i].PrecioNocturno,
          Likes: Escenarios[i].Likes
        }

        this.itemsEscenario.push(tmp)
      }
    }
  },
  components: {
    VFlipedCard
  }
};


</script>
