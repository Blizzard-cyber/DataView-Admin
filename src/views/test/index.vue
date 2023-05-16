<template>
  <div class="iframe_box" v-loading="loading">
    <!-- <div
      class="load"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
    ></div> -->
    <iframe
      :src="`dataview/index.html`" 
      frameborder="0"
      scrolling="no"
      width="100%"
      height="100%"
      ref="iframeDom"
    ></iframe>
  </div>
</template>

<script>
import {getClassByDateApi} from "../../network/api/dataApi"
export default {
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.getData();
    this.iframeLoad();
    // this.$nextTick(() => {
    //   this.$refs.iframeDom.onload = () => {
    //     this.loading = false;
    //   };
    // });
  },
  methods: {
   
    async getData() {
      this.loading = true;
      let date='2023-05-12 00:00:00'
      let paramGroup='1,2,3,4'
      let res=await getClassByDateApi(paramGroup,date);
      console.log(res)
      this.$refs.iframeDom.contentWindow.postMessage(res, "*");
    },
    iframeLoad() {
      this.$refs.iframeDom.onload = () => {
        this.loading = false;
      };
    },

  },
}

</script>
<style>
.iframe_box {
  transform: scale(1);
  width: 100%;
  height: 858px;
  position: relative;
}
</style>