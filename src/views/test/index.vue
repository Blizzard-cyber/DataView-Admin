<template>
  <div class="iframe_box">
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

<style>
.iframe_box {
  transform: scale(1);
  width: 100%;
  height: 858px;
  position: relative;
}
</style>