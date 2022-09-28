import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Vector as VectorSource } from 'ol/source'
import { Style, Stroke, Fill } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'

// data为多边形每个点的经纬度坐标数组，[[120.11997452699472, 30.314227730637967],[120.11997452699472, 30.314227730637967],...]
function renderArea (data) {
    // 创建要素
    const features = [
        new Feature({
            geometry: new Polygon([data])// 使用多边形类型
        })
    ]
    // 创建矢量数据源
    const source = new VectorSource({
        features
    })
    // 创建样式
    const style = new Style({
        stroke: new Stroke({
            color: '#4C99F8',
            width: 3,
            lineDash: [5]
        }),
        fill: new Fill({
            color: 'rgba(255,255,255,0.1)'
        })
    })
    // 创建矢量图层
    const areaLayer = new VectorLayer({
        source,
        style,
        zIndex: 1
    })
    // 添加到地图实例
    map.addLayer(areaLayer)
}