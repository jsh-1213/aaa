<template>
  <div id="map" ref="rootmap">
    <div class="btn">
      <span
        class="btn_item"
        @click="btnClick(item)"
        v-for="(item, index) in btnData"
        :key="index"
        >{{ item.name }}</span
      >
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import mapconfig from "../config/mapconfig";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { Vector as VectorSource, Cluster } from "ol/source";
import { Style, Stroke, Fill, Icon } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
export default {
  data() {
    return {
      map: null,
      btnData: [
        { name: "画点", isActive: false },
        { name: "画线", isActive: false },
        { name: "画面", isActive: false },
      ],
      lnglats: [
        [113.98381483007813, 22.624044683105474],
        [114.07136213232423, 22.643270757324224],
        [114.02467023779298, 22.598295476562505],
        [114.08475171972657, 22.591772344238287],
      ],
      //多边形坐标
      dataArr: [
        [114.06625114734103, 22.582559905338663],
        [114.10435997302463, 22.581186614323038],
        [114.11431633288791, 22.54994424371757],
        [114.06487785632541, 22.549600920963663],
      ],
      lineData: [
        [114.24268488163307, 22.647685415661332],
        [114.19152509619141, 22.601557042724615],
        [114.14277326513673, 22.581301000244146],
        [114.16611921240235, 22.496500280029302],
      ],
      Data1: null,
      Data2: null,
      Data3: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      var mapcontainer = this.$refs.rootmap;
      this.map = new Map({
        target: mapcontainer,
        projection: "EPSG:4326",
        layers: mapconfig.streetmap(),
        view: new View({
          projection: "EPSG:4326", //使用这个坐标系
          center: [mapconfig.x, mapconfig.y], //深圳
          zoom: mapconfig.zoom,
          resolutions: mapconfig.resolutions,
        }),
      });
      this.map.on(
        "click",
        function (evt) {
          alert(evt.coordinate[0] + "," + evt.coordinate[1]);
        },
        mapcontainer
      );
    },
    //画多边形
    renderArea(data) {
      // 创建要素
      const features = [
        new Feature({
          geometry: new Polygon([data]), // 使用多边形类型
        }),
      ];
      // 创建矢量数据源
      const source = new VectorSource({
        features,
      });
      // 创建样式
      const style = new Style({
        stroke: new Stroke({
          color: "#4C99F8",
          width: 3,
          lineDash: [5],
        }),
        fill: new Fill({
          color: "rgba(100,149,237,0.3)",
        }),
      });
      // 创建矢量图层
      const areaLayer = new VectorLayer({
        source,
        style,
        zIndex: 1,
      });
      // 添加到地图实例
      this.Data3 = areaLayer;
      this.map.addLayer(areaLayer);
    },
    //撒点
    addMaker(lnglats) {
      // 创建Feature对象集合
      var features = new Array();
      for (var i = 0; i < lnglats.length; i++) {
        features.push(
          new Feature({
            geometry: new Point(lnglats[i]),
          })
        );
      }
      // 矢量要素数据源
      var source = new VectorSource({
        features: features,
      });
      // 聚合标注数据源
      var clusterSource = new Cluster({
        distance: 0, //这个是通过 distance 来控制两个点聚合的间距
        source: source,
      });
      // 加载聚合标注的矢量图层
      var styleCache = {}; //用于保存特定数量的聚合群的要素样式
      var clusters = new VectorLayer({
        source: clusterSource,
        style: function (feature) {
          var size = feature.get("features").length; //获取该要素所在聚合群的要素数量
          var style = styleCache[size];
          var icon = require("../assets/renyuan_icon.png");
          if (!style) {
            style = [
              new Style({
                image: new Icon({
                  src: icon,
                }),
              }),
            ];
          }
          return style;
        },
        zIndex: 999,
      });
      this.Data1 = clusters;
      this.map.addLayer(clusters);
    },
    //画线
    drawLine(pointsList) {
      //将由离散gps信号点生成的线路添加到地图上
      var roadLine = new LineString(pointsList);
      var roadLineSource = new VectorSource({
        features: [new Feature(roadLine)],
      });
      var roadLineLayer = new VectorLayer({
        source: roadLineSource,
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 3,
          }),
        }),
      });
      this.Data2 = roadLineLayer;
      this.map.addLayer(roadLineLayer);
    },
    //清理图层
    removeLayer(removeData) {
      this.map.removeLayer(removeData);
    },
    trackPlay() {},
    btnClick(val) {
      val.isActive = !val.isActive;
      console.log(val.isActive);
      if (val.name == "画面") {
        if (val.isActive) {
          this.renderArea(this.dataArr);
        } else {
          this.removeLayer(this.Data3);
        }
      } else if (val.name == "画线") {
        if (val.isActive) {
          this.drawLine(this.lineData);
        } else {
          this.removeLayer(this.Data2);
        }
      } else if (val.name == "画点") {
        if (val.isActive) {
          this.addMaker(this.lnglats);
        } else {
          this.removeLayer(this.Data1);
        }
      }
    },
  },
};
</script>

<style>
.btn {
  display: flex;
  flex-direction: row;
  width: 300px;
  height: 40px;
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translateX(-50%);
  z-index: 100;
  align-items: center;
}
.btn_item {
  color: brown;
  font-size: 20px;
  /* line-height: 40px; */
  box-sizing: border-box;
  padding: 6px;
  background: cornflowerblue;
  cursor: pointer;
  margin-right: 10px;
}
#map {
  height: 100%;
  position: relative;
}
/*隐藏ol的一些自带元素*/
.ol-attribution,
.ol-zoom {
  display: none;
}
</style>