# 埃及国家文明博物馆 · 独立中文导览

单景点公开版，保留现有导览的外观、室内章节、10 条主题解读、两张楼层图、独立外观模型与离线下载。不是馆方官网，也不声称完整馆藏目录或现行导航。

不含旅行日期、旅客、订单、酒店、航班、原始私人截图或其他景点。源旅行项目和欧洲行项目不作为发布目录。

## 本地运行

Node.js 22.12+。运行 `npm ci`、`npm run lint`、`npm test`、`npm run build`，然后 `npm run preview`。访问 `http://127.0.0.1:4181/nmec-cultural-guide/`。

## 发布

GitHub Actions 从 main 构建并发布至 GitHub Pages。所有资源与静态深链接使用 `/nmec-cultural-guide/`。离线缓存独立命名，不访问其他导览缓存；下载续传按已校验文件恢复，不是字节级续传。浏览器清理存储可能移除离线包。

## 来源与使用边界

图片的作者、原始页面与许可见 `public/images/guides/media-manifest.json` 和页面来源区域。平面依据与精度见各地图来源说明，外观为有来源支持的简化模型，不是测量模型。原始建筑研究材料未整包收录。

本地楼层参考图为 Aboulnaga, Puma, Eletrby, Bayomi & Farid (2022), “Sustainability Assessment of the National Museum of Egyptian Civilization (NMEC): Environmental, Social, Economic, and Cultural Analysis”, *Sustainability* 14(20), 13080, Figure 5，图源 NMEC；[原论文](https://doi.org/10.3390/su142013080)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。本项目从图件重绘楼层关系，三维剖切高度为显示用途。
