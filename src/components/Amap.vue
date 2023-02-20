<template>
  <div
    id="container"
    style="display: block; width: 100vw; height: 100vh; background: #eee"
  ></div>
</template>

<script>
import { CustomMap, CustomMarker } from "./amap";

const points = [
  {
    ENTITY_NAME: "桂花岛",
    TOUR_NUM: 3,
    TOTAL_NUM: 383,
    COMFORT_TYPE_NAME: "空闲",
    CAPACITY_NUM: 1189,
    lng: "119.153287",
    lat: "29.497717",
  },
  {
    ENTITY_NAME: "梅峰岛",
    TOUR_NUM: -356,
    TOTAL_NUM: 1863,
    COMFORT_TYPE_NAME: "舒适",
    CAPACITY_NUM: 2454,
    lng: "118.928574",
    lat: "29.592394",
  },
  {
    ENTITY_NAME: "渔乐岛",
    TOUR_NUM: 485,
    TOTAL_NUM: 792,
    COMFORT_TYPE_NAME: "拥挤",
    CAPACITY_NUM: 3503,
    lng: "118.951155",
    lat: "29.581731",
  },
  {
    ENTITY_NAME: "龙山岛",
    TOUR_NUM: -1318,
    TOTAL_NUM: 287,
    COMFORT_TYPE_NAME: "爆满",
    CAPACITY_NUM: 4784,
    lng: "118.986813",
    lat: "29.611735",
  },
  {
    ENTITY_NAME: "月光岛",
    TOUR_NUM: 489,
    TOTAL_NUM: 758,
    COMFORT_TYPE_NAME: "空闲",
    CAPACITY_NUM: 2786,
    lng: "119.015670",
    lat: "29.621397",
  },
  {
    ENTITY_NAME: "黄山尖",
    TOUR_NUM: 142,
    TOTAL_NUM: 342,
    COMFORT_TYPE_NAME: "空闲",
    CAPACITY_NUM: 2000,
    lng: "119.113485",
    lat: "29.574244",
  },
  {
    ENTITY_NAME: "天池岛",
    TOUR_NUM: -34,
    TOTAL_NUM: 44,
    COMFORT_TYPE_NAME: "空闲",
    CAPACITY_NUM: 6959,
    lng: "119.150901",
    lat: "29.539745",
  },
];
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      map: null,
    };
  },
  methods: {
    async initMap() {
      nmsl()
      this.map = new CustomMap("container", {
        disableSocket: true,
        viewMode: "3D",
        zoom: 9.5,
      });
      await this.map.initDistrictMap("淳安县");
      new CustomMarker({
        lat,
      });
      const MARKER_COLOR_DICT = {
        空闲: "green",
        舒适: "blue",
        拥挤: "yellow",
        爆满: "red",
      };
      points.forEach((item) => {
        this.map.addMarker({
          lng: item.lng,
          lat: item.lat,
          title: item.ENTITY_NAME,
          color: MARKER_COLOR_DICT[item.COMFORT_TYPE_NAME],
          extData: item,
        });
      });
      //开启轮播
      // this.map.carouselMarker(3000);
    },
  },

  mounted() {
    this.initMap();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "./map.css";
</style>
