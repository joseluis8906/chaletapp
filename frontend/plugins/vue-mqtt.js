import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

Vue.use(VueMqtt, "ws://149.56.109.238:9001", {username: 'web', password: '56784321', clientId: 'chaletApp_' + Math.random().toString(16).substr(2, 8)})
