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
            v-icon(ma) account_balance
            |  Escenario
      v-card-text
        v-layout( row wrap)
          v-flex( xs12 )

            v-text-field( label="Nombre" v-model="Nombre" dark )

            //- v-text-field( label="Imagen" v-model="Imagen" dark )
            v-upload-image(v-model="Imagen" label="Cambiar Imagen" :file="Imagen")

            v-text-field( label="Especificación 1" v-model="Esp1" dark )

            v-text-field( label="Especificación 2" v-model="Esp2" dark )

            //- v-text-field( label="Especificación 3" v-model="Esp3" dark )

            v-money(label="Precio" v-model="Precio" maskType="currency")

            v-text-field( label="Likes" v-model="Likes" dark )

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
import VUploadImage from '~/components/UploadImage.vue'

export default {
  data: () => ({
    snackbar: {
      context: 'secondary',
      mode: '',
      timeout: 6000,
      text: 'Cargando'
    },
    Id: null,
    Nombre: null,
    Imagen: null,
    Esp1: null,
    Esp2: null,
    //Esp3: null,
    Precio: null,
    Likes: null,
    Activo: null,
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
  mounted () {
    this.$nextTick(() => {
      this.$mqtt.subscribe('chaletapp/apollo/mutation')
    })
  },
  beforeDestroy () {
    this.$mqtt.unsubscribe('chaletapp/apollo/mutation')
  },
  apollo: {
    Escenarios: {
      query: ESCENARIOS,
      variables () {
        return {
          Nombre: this.Nombre,
        }
      },
      loadingKey: 'loading',
      update (data) {
        //console.log(data)
        this.LoadUi(data.Escenarios)
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
        case 'StoreEscenario': this.StoreEscenario(Obj)
      }

    }
  },
  methods: {
    StoreEscenario (Escenario) {
      var store = this.$apollo.provider.defaultClient

      try{
        var data = store.readQuery({
          query: ESCENARIOS,
          variables: {
            Nombre: Escenario.Nombre,
          }
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
          variables: {
            Nombre: Escenario.Nombre,
          },
          data: data
        })

      } catch (Err) {

        var data = {Escenarios: []}

        data.Escenarios.push(Escenario)

        store.writeQuery({
          query: ESCENARIOS,
          variables: {
            Nombre: Escenario.Nombre
          },
          data: data
        })
      }

      try{
        var data = store.readQuery({
          query: ESCENARIOS,
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

    },
    CreateOrUpdate () {
      if (this.Id === null) {
        this.Create();
      }else{
        this.Update();
      }
    },
    Create () {
      const Escenario = {
        Nombre: this.Nombre,
        Imagen: this.Imagen,
        Esp1: this.Esp1,
        Esp2: this.Esp2,
        //Esp3: this.Esp3,
        Precio: this.Precio,
        Likes: this.Likes,
        Activo: this.Activo
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: CREATE_ESCENARIO,
        variables: {
          Nombre: Escenario.Nombre,
          Imagen: Escenario.Imagen,
          Esp1: Escenario.Esp1,
          Esp2: Escenario.Esp2,
          //Esp3: Escenario.Esp3,
          Precio: Escenario.Precio,
          Likes: Escenario.Likes,
          Activo: Escenario.Activo
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreEscenario', Obj: res.CreateEscenario}))
        },
      })
    },
    Update () {
      //console.log(this.Password)
      const Escenario = {
        Id: this.Id,
        Nombre: this.Nombre,
        Imagen: this.Imagen,
        Esp1: this.Esp1,
        Esp2: this.Esp2,
        //Esp3: this.Esp3,
        Precio: this.Precio,
        Likes: this.Likes,
        Activo: this.Activo
      };

      this.Reset ();

      this.$apollo.mutate ({
        mutation: UPDATE_ESCENARIO,
        variables: {
          Id: Escenario.Id,
          Nombre: Escenario.Nombre,
          Imagen: Escenario.Imagen,
          Esp1: Escenario.Esp1,
          Esp2: Escenario.Esp2,
          //Esp3: Escenario.Esp3,
          Precio: Escenario.Precio,
          Likes: Escenario.Likes,
          Activo: Escenario.Activo
        },
        loadingKey: 'loading',
        update: (store, { data: res }) => {
          this.$mqtt.publish('chaletapp/apollo/mutation', JSON.stringify({Method: 'StoreEscenario', Obj: res.UpdateEscenario}))
        }
      })
    },
    Reset () {
      this.Id = null
      this.Nombre = null
      this.Imagen = null
      this.Esp1 = null
      this.Esp2 = null
      //this.Esp3 = null
      this.Precio = null
      this.Likes = null
      this.Activo = null
    },
    LoadUi (Escenarios) {
      if( Escenarios.length === 0 ) {
        this.Id = null
        //this.Nombre = null
        this.Imagen = null
        this.Esp1 = null
        this.Esp2 = null
        //this.Esp3 = null
        this.Precio = null
        this.Likes = null
        this.Activo = null
      }

      for (let i=0; i<Escenarios.length; i++) {
        if ( this.Codigo === Escenarios[i].Codigo ) {
          this.Id = Escenarios[i].Id
          this.Nombre = Escenarios[i].Nombre
          this.Imagen = Escenarios[i].Imagen
          this.Esp1 = Escenarios[i].Esp1
          this.Esp2 = Escenarios[i].Esp2
          //this.Esp3 = Escenarios[i].Esp3
          this.Precio = Escenarios[i].Precio
          this.Likes = Escenarios[i].Likes
          this.Activo = Escenarios[i].Activo
          break
        }else{
          this.Id = null
        }
      }
    }
  },
  components: {
    VMoney,
    VUploadImage,
  }
};


</script>

<style lang="stylus" scoped>
h5.bold
  font-weight bold

.alert-especial
  position absolute

</style>
