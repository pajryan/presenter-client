<template>
  <div class="coverflow" v-coverflow>
    <img
      v-for="(coverItem, index) of coverList"
      :src="coverItem.cover"
      :key="index">
  </div>
</template>

<script>
import coverflow from './coverflow'

export default {
  name: 'coverflow',
  data () {
    return {
      coverIndex: 0
    }
  },
  mounted () {
  },
  props: {
    coverList: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      default: 980
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    index: {
      type: Number,
      default: 0
    },
    coverWidth: {
      type: Number,
      default: 100
    },
    coverHeight: {
      type: Number,
      default: 0
    },
    coverSpace: {
      type: Number,
      default: 50
    },
    coverShadow: {
      type: Boolean,
      default: false
    },
    coverFlat: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange (index) {
      this.coverIndex = index
      this.$emit('change', index)
    },
    selected (index) {
      this.$emit('selected', index);
    }
  },
  directives: {
    coverflow
  }
}
</script>