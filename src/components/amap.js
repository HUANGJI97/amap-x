//@ts-check
/**
 * 自定义标记类拓展
 */
/**
 * 类型声明区域
 */
export class CustomMarker extends AMap.Marker {
  constructor(options) {
    super();
    this.options = options;
    this.setPosition(new AMap.LngLat(options.lng, options.lat));
    this.setContent(this.generateContentHtml(options.title));
    this.setOffset(new AMap.Pixel(-66, -73));
    this.setExtData(options);
    this.setTitle(options.title);
    this.infoWindow = new AMap.InfoWindow({
      isCustom: true,
      content: `<div class="custom-info-window">这里是${options.title}的自定义窗体</div>`,
      offset: new AMap.Pixel(0, -111),
      position: new AMap.LngLat(options.lng, options.lat),
    });

    this.actived = false;
    // 生成唯一标识
    this.key = btoa(encodeURIComponent(options.title));
    this.on("click", (e) => {
      console.log("标记点击", e);
      if (this.clickListener instanceof Function) {
        this.clickListener(this);
      }
    });
  }
  /**
   * 生成 marker 内容 html字符串
   */
  generateContentHtml(title, actived = false) {
    return `<div class="custom-marker ${this.options.color || "green"} ${
      actived ? "actived" : ""
    }" >
              <div class="custom-marker-title">${title}</div>
              <div class="custom-marker-pointer"></div>
            </div>`;
  }
  /**
   * 标记点击事件监听设置
   * @param {(target:CustomMarker,context:any)=>void} callback
   */
  onClick(callback) {
    if (callback instanceof Function) this.clickListener = callback;
  }
  /**
   * 设置激活状态
   */
  setActived(isActived = false) {
    this.actived = isActived;
    if (isActived) {
      this.setOffset(new AMap.Pixel(-66, -111));
      this.setzIndex(101);
      this.infoWindow.open(this.getMap());
    } else {
      this.setOffset(new AMap.Pixel(-66, -73));
      this.setzIndex(100);
      this.infoWindow.close();
    }
    /** 更新content */
    this.setContent(this.generateContentHtml(this.options.title, isActived));
  }
}

/**
 * 自定义高德地图拓展
 */
export class CustomMap {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options || {};
    this.activedMarkerIndex = 0;
  }
  /**
   * 获取当前地图上所有标记点
   */
  getMarkers() {
    return this.getAllOverlays().filter((item) => item instanceof CustomMarker);
  }
  /**
   * 标记点点击事件
   */
  onMarkerClick(target) {
    console.log("标记点击事件", target);
    const otherMarkers = this.getMarkers().filter(
      (item) => item.key !== target.key
    );
    otherMarkers.forEach((item) => {
      item.setActived(false);
    });
    target.setActived(true);
  }
  /**
   * 添加标记点
   */
  addMarker(options) {
    const marker = new CustomMarker(options);
    marker.onClick((target) => this.onMarkerClick(target));
    this.add(marker);
  }

  /**
   * 定时轮播标记点
   */
  carouselMarker(interval = 2000) {
    // const marker
    console.log("标记点轮播", this.markers);
    setInterval(() => {
      this.activedMarkerIndex++;
      this.onMarkerClick(this.markers[this.activedMarkerIndex]);
    }, interval);
  }
  /**
   * 初始化行政区块地图
   */
  async initDistrictMap(city = "淳安县") {
    // 区块数据查询
    const { boundaries, center, ...res } = await this.searchDistrict(city);
    console.log("[CustomMap]:区块数据查询", boundaries, center);
    const mask = boundaries.map((item, index) => [item]);
    const mapInstance = new AMap.Map(this.container, {
      mask: mask,
      center: this.options.center,
      disableSocket: true,
      viewMode: "3D",
      zoom: this.options.zoom || 10,
    });
    console.log("地图实例", mapInstance);
    mapInstance.setCenter(center);

    this.mergeInstance(mapInstance);
    this.setImageLayer(boundaries, mapInstance);
    // this = Object.assign(mapInstance, this);
  }
  /**
   * 设置贴图图层
   * @param bounds 行政区块边缘坐标集
   * @param mapInstance 地图实例
   */
  setImageLayer(bounds, mapInstance) {
    /**地图矢量区域*/
    const mapArea = new AMap.Polygon({
      /** 坐标路径坐标集 */
      path: bounds[0],
      /** 描边颜色 */
      strokeColor: "green",
      borderWeight: 2,
      fillColor: "green",
      fillOpacity: 0.2,
      draggable: true,
    });
    /** 获取矢量区域的bounds  */
    const imgLayerBound = mapArea.getBounds();
    /** 创建贴图层 */
    let imageLayer = new AMap.ImageLayer({
      url: "https://jsc.qiandaohu.cc/zyqd/map.png",
      opacity: 1,
      bounds: imgLayerBound,
      zooms: [0, 18],
    });
    console.log("图片层", imageLayer);
    /** 将贴图层射入地图实例 */
    imageLayer.setMap(mapInstance);
  }
  /**
   * 合并AMap.Map 实例到当前实例
   * @param {AMap.Map} instance
   */
  mergeInstance(instance) {
    for (let key in instance) {
      // console.log("实例合并", key);
      this[key] = instance[key];
    }
  }
  /**
   * 搜索行政区域数据
   * @param {string} city 行政区域名称
   */
  searchDistrict(city) {
    return new Promise((resolve, reject) => {
      AMap.plugin("AMap.DistrictSearch", () => {
        //创建区块搜索器
        const districtSearcher = new AMap.DistrictSearch({
          subdistrict: 0,
          extensions: "all",
          level: "city",
        });
        districtSearcher.search(city, (status, result) => {
          console.log("status", status);
          if (status === "complete" && result.info === "OK") {
            resolve(result.districtList[0]);
          } else {
            reject(result);
          }
        });
      });
    });
  }
  get markers() {
    return this.getMarkers();
  }
}
