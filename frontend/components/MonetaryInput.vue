<template lang="pug">
  v-text-field( v-model="displayValue"
                :label="label"
                :readonly="readonly"
                :prepend-icon="prependIcon"
                :light="light"
                @blur="handleInputState"
                @focus="handleInputState" )
</template>

<script>

const masks = {
  currency: {
    mask (value) {
      return (value !== null ? '$' + value.toLocaleString() : null)
    },
    unmask (value) {
      value = parseFloat(value.replace(/[^\d\.]/g, ""))
      return isNaN(value) ? null : value
    },
  },
}

export default {
  props: {
    value: null,
    maskType: String,
    focused: false,
    label: String,
    readonly: Boolean,
    prependIcon: String,
    light: Boolean,

  },
  data: function() {
    return {
      inputFocused: false
    }
  },
  watch: {
    focused (value) {
      this.inputFocused = value
    }
  },
  methods: {
    handleInputState (event) {
      this.inputFocused = event.type === 'focus'
    },
    unmask (value) {
      return masks[this.maskType].unmask(value)
    },
    mask (value) {
      return masks[this.maskType].mask(value)
    },
  },
  computed: {
    displayValue: {
      get: function() {
        if (this.inputFocused) {
          return (this.value !== null ? this.value.toLocaleString() : ''.toLocaleString())
        } else {
          return this.mask(this.value)
        }
      },
      set: function(modifiedValue) {
        this.$emit('input', this.unmask(modifiedValue))
      }
    }
  }
}
</script>

<style lang="stylus" scope>
</style>
