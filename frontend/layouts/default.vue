<template lang="pug">
doctype html
v-app(id="sandbox" :dark="dark" :light="!dark" standalone)
  v-navigation-drawer(v-model="drawer.model"
                      :persistent="drawer.type === 'persistent'"
                      :temporary="drawer.type === 'temporary'" )
    v-list(dense)
      template(v-for="(item, i) in items")
        v-list-tile( :key="i"
                     nuxt link :to="item.to"
                     v-if="EvaluarRoles(item.Roles)"
                     @click.native.stop="drawer.type==='temporary' ? drawer.model = !drawer.model : ''")
          v-list-tile-action
            v-icon {{ item.icon }}

          v-list-tile-content
            v-list-tile-title {{ item.text }}

      v-list-tile(@click.native="logout")
        v-list-tile-action
          v-icon exit_to_app

        v-list-tile-content
          v-list-tile-title Salir

  v-toolbar(fixed)
    v-toolbar-side-icon(  @click.native.stop="drawer.model = !drawer.model" )
    v-toolbar-title {{ title }}

  main
    v-container(fluid mb-5 pt-0)
      nuxt

  v-footer(fixed)
    <span> © {{ new Date().getFullYear() }} </span> Airton & Jorge

</template>

<script>
  export default {
    data: () => {
      return {
        dark: true,
        drawer: {
          model: true,
          type: 'persistent',
        },
        footer: {
          fixed: true
        },
        items: [
          { icon: 'person', text: 'Usuario', to: '/usuario', Roles: ["Administrador"] },
          { icon: 'group', text: 'Grupo', to: '/grupo', Roles: ["Administrador"] },
          { icon: 'account_balance', text: 'Escenario', to: '/escenario', Roles: ["Administrador"] },
          { icon: 'attach_money', text: 'Recargas', to: '/recargas', Roles: ["Administrador"] },
          { icon: 'assignment', text: 'Apartar', to: '/apartar', Roles: ["Administrador"] },
        ],
        title: 'Chalet Escenarios Deportivos',
        StoreRoles: []
      }
    },
    methods: {
      handleResize () {
        if (process.BROWSER_BUILD) {
          if (window.screen.width < 768) {
            this.drawer.type = "temporary"
          } else if (window.screen.width >= 768) {
            this.drawer.type = "persistent"
          }
        }
      },
      logout () {
        sessionStorage.removeItem("x-access-token")
        sessionStorage.removeItem("x-access-roles")
        this.$router.push('/')
      },
      EvaluarRoles (Roles) {
        if (this.$store.state.security.Roles !== null) {
          for (let i=0;i<Roles.length; i++) {
            if(this.$store.state.security.Roles.indexOf(Roles[i]) !== -1) {return true}
          }
        }
        return false;
      }
    },
    created () {
      if (process.BROWSER_BUILD) {
        window.addEventListener('resize', this.handleResize)
      }
    },
    destroyed () {
      if (process.BROWSER_BUILD) {
        window.removeEventListener('resize', this.handleResize)
      }
    }
  }
</script>

<style lang="stylus" scoped>

#sandbox
  border 1px solid rgba(0, 0, 0, .25)
  overflow hidden

</style>
