import TileLayer from "ol/layer/Tile"
import TileArcGISRest from 'ol/source/TileArcGISRest'
import OSM from "ol/source/OSM"
import XYZ from 'ol/source/XYZ'

let maptype = 2        //0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务

var streetmap = function () {
    var maplayer = null;
    switch (maptype) {
        case 0:
            maplayer = new TileLayer({
                source: new XYZ({
                    url: 'http://127.0.0.1:7080/streetmap/shenzhen/{z}/{x}/{y}.jpg'
                })
            })
            break;
        case 1:
            maplayer = new TileLayer({
                source: new OSM()
            })
            break;
        case 2:
            maplayer = new TileLayer({
                source: new TileArcGISRest({
                    url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
                })
            })
            break;
        case 3:
            maplayer = new TileLayer({
                source: new XYZ({
                    projection: "EPSG:4326",
                    tileSize: 512,
                    url: 'https://smartum.sz.gov.cn/szcg/SZMAP_BLACK/raster_{z}_{x}_{y}'
                }),
                name: '天地图路网'
            })
            break;
    }
    return [maplayer];
}

var mapconfig = {
    x: 113.991538,    //中心点经度和纬度
    y: 22.571418,
    zoom: 10,          //地图缩放级别
    streetmap: streetmap,
    resolutions: [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
        0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 0.0006866455078125, 0.00034332275390625,
        0.000171661376953125, 8.58306884765629e-5, 4.29153442382814e-5,
        2.1457672119140625e-5, 1.07288360595703e-5, 5.36441802978515e-6,
    ]
};

export default mapconfig
