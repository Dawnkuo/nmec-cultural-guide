# 埃及纪行 2026 · 完整项目

本仓库已由单景点发布扩展为完整埃及项目：12 日行程、全国与逐日地图、4 个城市文化章节、14 个景点导览及凭证状态，共 23 条静态页面路由。保留每个景点已有的外观、室内／场内章节、解读、原生地图和可续传离线包。不是馆方官网；既有博物馆章节是主题精选，不声称完整馆藏目录或现场导航。

按用户要求发布本次埃及行程与全部景点；没有上传旅客身份、联系方式、订单号、金额、原始私人截图、欧洲行私人记录或本地研究下载。源旅行项目与欧洲行项目均不作为 Git 发布目录。

## 本地运行

Node.js 22.12+。运行 `npm ci`、`npm run lint`、`npm test`、`npm run build`，然后 `npm run preview`。访问 `http://127.0.0.1:4181/nmec-cultural-guide/`。

## 发布

GitHub Actions 从 main 构建并发布至 GitHub Pages。沿用已建立的仓库与地址，因此目录仍为 `/nmec-cultural-guide/`，内容已是完整埃及项目；旧 NMEC 深链接保持有效。离线缓存独立命名，不访问其他导览缓存；下载续传按已校验文件恢复，不是字节级续传。浏览器清理存储可能移除离线包。

发布回归：先运行 `node scripts/qa-catalog.mjs` 从当前数据生成测试目录，再运行 `node scripts/qa-full-site.mjs <站点根地址> <结果目录名>` 验证全部路由、三种屏幕尺寸、现有地图双视图和离线深链接。`node scripts/qa-full-fallback.mjs` 检查全部景点的 WebGL 回退，`node scripts/qa-resume.mjs` 验证真实 Service Worker 中断、页面重开、续传和更新保留旧版。报告在 `docs/qa`；旧单景点报告仅代表当时版本，不代表本次全站。

## 来源与使用边界

图片的作者、原始页面与许可见 `public/images/guides/media-manifest.json` 和页面来源区域。平面依据与精度见各地图来源说明，外观为有来源支持的简化模型，不是测量模型。原始建筑研究材料未整包收录。

本地楼层参考图为 Aboulnaga, Puma, Eletrby, Bayomi & Farid (2022), “Sustainability Assessment of the National Museum of Egyptian Civilization (NMEC): Environmental, Social, Economic, and Cultural Analysis”, *Sustainability* 14(20), 13080, Figure 5，图源 NMEC；[原论文](https://doi.org/10.3390/su142013080)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。本项目从图件重绘楼层关系，三维剖切高度为显示用途。
