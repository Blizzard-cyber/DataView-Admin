<template>
  <div class="iframe_box" >
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
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    //...mapState(['pickDate','paramGroup']),
  },
  created() {
  },
  mounted() {
    this.getData();
    //this.iframeLoad();
    // this.$nextTick(() => {
    //   this.$refs.iframeDom.onload = () => {
    //     this.loading = false;
    //   };
    // });
  },
  methods: {
    ...mapGetters(['getpickDate','getparamGroup']),

    async getData() {
	 
      this.loading = true;
      // let date=this.pickDate;
      // let paramGroup=this.paramGroup;
      let date=this.getpickDate();
      let paramGroup=this.getparamGroup();
      let res=await getClassByDateApi(paramGroup,date);
      //console.log(res)
      if(res.type === "success"){
        this.$Message.success('数据获取成功');
         if(res.data.length==0){
          this.$Message.error('该班组当天无数据');
         }
         this.$refs.iframeDom.contentWindow.postMessage(res.data, "*");
      }
      else{
        this.$Message.error('数据获取失败');
      }
      
      //console.log(res)
      
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