import Vue from 'vue'
import VueMqtt from 'vue-mqtt'

//mqtt users
/*
android 12345678
desktop 87654321
web 56784321
*/

Vue.use(VueMqtt, "ws://149.56.109.238:9001/mqtt", {username: 'web', password: '56784321', clientId: 'chaletApp_' + Math.random().toString(16).substr(2, 8)})
