<template>
  <span>{{ displayNumber }}</span>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: 'AnimatedNumber',
  data () {
    return {
      displayNumber: 0,
      interval: false
    }
  },
  created() {
    this.displayNumber = this.number ? this.number : 0;
  },
  watch:{
    number: function(){
      clearInterval(this.interval);

      if (this.number === this.displayNumber){
        return;
      }

      this.interval = window.setInterval(function(){
        if (this.displayNumber !== this.number){
          let change = (this.number - this.displayNumber) / 10;
          change = change >= 0 ? Math.ceil(change) : Math.floor(change);
          this.displayNumber = this.displayNumber + change;
        }
      }.bind(this), 75);
    }
  },
  computed: mapGetters({
    number: 'totalItems'
  })
}
</script>