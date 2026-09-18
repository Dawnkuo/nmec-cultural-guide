import type { SourceRecord } from './types';
export const sources: SourceRecord[] = [
  {
    "id": "src-nmec-hall-photo",
    "title": "NMEC-MainHall.jpg — exhibition interior, 2017",
    "publisher": "Roland Unger / Wikimedia Commons",
    "authority": "media-repository",
    "url": "https://commons.wikimedia.org/wiki/File:NMEC-MainHall.jpg",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-historical-hall-photograph"
    ],
    "note": "CC BY-SA 4.0. Visually checked glass display cases and high ceiling, not a tourism sign. Historical interior photograph; not the 2026 exhibition arrangement. Provenance: /images/guides/nmec-reviewed-media.json."
  },
  {
    "id": "src-gem-architect",
    "title": "The Grand Egyptian Museum — architectural concept, model and photographs",
    "publisher": "Heneghan Peng Architects",
    "authority": "authoritative",
    "url": "https://www.hparc.com/work/the-grand-egyptian-museum/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "gem-exterior-fanning-axes",
      "gem-folded-roof",
      "gem-grand-stair-band"
    ],
    "note": "Architect project record: five exhibition bands and the grand stair. Site level difference is not building height. Photos/model viewed as form evidence, not a measured roof survey or redistributed asset."
  },
  {
    "id": "src-karnak-column-heights",
    "title": "The Great Hypostyle Hall — architecture and column heights",
    "publisher": "University of Memphis Great Hypostyle Hall Project",
    "authority": "authoritative",
    "url": "https://classic.memphis.edu/hypostyle/about_hall/index.php",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "12-high-columns",
      "122-low-columns",
      "papyrus-capital-types"
    ],
    "note": "12 central columns approximately21m, 122 side columns approximately12m. Not a present-day stone-by-stone condition survey."
  },
  {
    "id": "src-hatshepsut-whole-plan",
    "title": "Deir el Bahari complex plan",
    "publisher": "Gérard Ducher / Janmad, Wikimedia Commons",
    "authority": "media-repository",
    "url": "https://commons.wikimedia.org/wiki/File:Deir_el_Bahari-map.png",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "hatshepsut-terraces",
      "ramps-and-colonnades"
    ],
    "note": "CC BY-SA 2.5; portionIII used, not neighbouring Mentuhotep temple. Local PNG retained; derived geometry separately identified."
  },
  {
    "id": "src-sphinx-dimensions",
    "title": "The Sphinx — dimensions and form",
    "publisher": "Egypt State Information Service",
    "authority": "official-primary",
    "url": "https://sis.gov.eg/en/egypt/tourism/landmarks/sphinx/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "sphinx-length-height",
      "lion-human-form"
    ],
    "note": "73.5m length, 19.3m width and20m height used for a simplified posture model, not facial/scanning geometry."
  },
  {
    "id": "src-memnon-scan",
    "title": "Colossus of Memnon, Western Thebes — survey model",
    "publisher": "INSIGHT / MAFTO / SCA, Sketchfab",
    "authority": "authoritative",
    "url": "https://sketchfab.com/3d-models/colossus-of-memnon-western-thebes-upper-egypt-2a30e1459c1345b5959853136f5c4449",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "public-asset-search-audit"
    ],
    "note": "CC BY4.0 model discovered; browser preview reported heavy model, Download required login. Not acquired or integrated. Independent simplified model explicitly marked."
  },
  {
    "id": "src-mapzen-terrain",
    "title": "Terrain Tiles — public elevation data on AWS",
    "publisher": "Mapzen / AWS Open Data / SRTM",
    "authority": "authoritative",
    "url": "https://registry.opendata.aws/terrain-tiles/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "valley-of-kings-exterior-terrain"
    ],
    "note": "Public Terrarium elevation tiles; raw tiles and SHA256 retained locally. SRTM underlying nominal30m resolution, no vertical exaggeration. Attribution and source tile URLs preserved in valley-terrain.json."
  },
  {
    "id": "src-ghuri-wikala",
    "title": "Wikala of al-Ghuri — courtyard and street façade",
    "publisher": "Tarek Torky / Museum With No Frontiers",
    "authority": "authoritative",
    "url": "https://islamicart.museumwnf.org/database_item.php?id=monument;ISL;eg;Mon01;17;en",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "wikala-courtyard",
      "nine-street-mashrabiyyas",
      "stone-and-timber-facade"
    ],
    "note": "Curatorial architectural description cross-checked against Egyptian Ministry of Tourism and Antiquities record; not current operation or precise height data."
  },
  {
    "id": "src-ghuri-plans",
    "title": "Wikala — plans, elevations and photographs",
    "publisher": "Kamal Elgabalawy / Benha University architectural teaching material",
    "authority": "authoritative",
    "url": "https://beng.stafpu.bu.edu.eg/Architectural%20Engineering/6066/crs-18373/Files/20%20wikala.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "wikala-ground-plan",
      "courtyard-piers",
      "facade-layers"
    ],
    "note": "PDF pages2–5 viewed visually, page3 left orthographic plan used for exterior outline and courtyard. Underlying figure credits include MWNF; research PDF not republished as a public asset."
  },
  {
    "id": "src-giza-valley-plan",
    "title": "Khafre Valley Temple and Sphinx Temple — architectural plan",
    "publisher": "Maragioglio & Rinaldi V plate 14 / Harvard Digital Giza",
    "authority": "authoritative",
    "url": "https://giza.fas.harvard.edu/photos/88232/full/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "khafre-valley-temple-plan",
      "sixteen-square-piers",
      "independent-sphinx-temple"
    ],
    "note": "Annotated archival plan; photo inset and material annotations are not architectural geometry. Local research reference, redistribution rights to review before deployment."
  },
  {
    "id": "src-muhammad-ali-wnf-plan",
    "title": "Muhammad Ali Mosque architectural plan",
    "publisher": "Hasan Abd al-Wahhab / Museum With No Frontiers; Arabic Wikimedia reproduction",
    "authority": "authoritative",
    "url": "https://ar.wikipedia.org/wiki/ملف:Plan_of_Muhammad_Ali_Mosque.jpg",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "mosque-court-prayer-plan",
      "piers-and-colonnades"
    ],
    "note": "Reproduction identifies Museum With No Frontiers and History of Historic Mosques as source; cross-checked with curator Tarek Torky’s MWNF monument record. Local research reproduction, public redistribution rights require recheck before deployment."
  },
  {
    "id": "src-muhammad-ali-wnf",
    "title": "Mosque of Muhammad Ali Pasha — architectural record",
    "publisher": "Tarek Torky / Museum With No Frontiers",
    "authority": "authoritative",
    "url": "https://islamicart.museumwnf.org/database_item.php?id=monument;isl;eg;mon01;21;en",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "mosque-architecture",
      "court-piers-dome-relationship"
    ],
    "note": "Curatorial building description used to cross-check the published plan."
  },
  {
    "id": "src-tmp-valley-plan",
    "title": "Valley of the Kings & West Valley — measured plan",
    "publisher": "Theban Mapping Project / Walton Chan",
    "authority": "authoritative",
    "url": "https://thebanmappingproject.com/sites/default/files/plans/Valley%20of%20the%20Kings.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "valley-tomb-positions",
      "survey-contours"
    ],
    "note": "Original vector linework retained, terrain not converted to invented heights. Current access and ticketing not inferred."
  },
  {
    "id": "src-tmp-kv9",
    "title": "KV9 — Rameses V/VI, plans and sections",
    "publisher": "Theban Mapping Project / Walton Chan",
    "authority": "authoritative",
    "url": "https://thebanmappingproject.com/sites/default/files/plans/KV09_0.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "kv9-rooms-A-K",
      "kv9-pillared-hall"
    ],
    "note": "Native layer uses sheet 1 top orthographic plan, not the sections or overlapping neighbouring tombs."
  },
  {
    "id": "src-tmp-kv62",
    "title": "KV62 — Tutankhamen, plan, sections, axonometric",
    "publisher": "Theban Mapping Project / Walton Chan",
    "authority": "authoritative",
    "url": "https://thebanmappingproject.com/sites/default/files/plans/KV62_1.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "kv62-rooms",
      "burial-chamber-and-annexe"
    ],
    "note": "Room labels retained; source axonometric not directly extruded. No hidden-chamber speculation."
  },
  {
    "id": "src-kom-labelled-plan",
    "title": "Kom Ombo numbered architectural plan",
    "publisher": "Janmad / Wikimedia Commons, compared with de Morgan archive",
    "authority": "media-repository",
    "url": "https://commons.wikimedia.org/wiki/File:Kom_Ombo_map.png",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "kom-spaces-1-16",
      "column-and-wall-geometry"
    ],
    "note": "Janmad 2006, CC BY-SA 2.5. Historic site geometry cross-checked with French Ministry of Culture de Morgan 1894 plan. Numbers retained as source indices, not current access directions."
  },
  {
    "id": "src-karnak-eb-plan",
    "title": "Plan of the great temple of Karnak",
    "publisher": "Encyclopaedia Britannica 1911, vol 2 p372",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/File:Plan_of_Karnak.png",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "amun-core-plan",
      "pylons-courts-chambers"
    ],
    "note": "Public domain historical plan, letter key A–M preserved. Current access not inferred."
  },
  {
    "id": "src-karnak-memphis-plan",
    "title": "Great Hypostyle Hall — architectural plan and numbered columns",
    "publisher": "University of Memphis Great Hypostyle Hall Project",
    "authority": "authoritative",
    "url": "https://www.memphis.edu/hypostyle/interior-scenes/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "134-column-locations",
      "hall-wall-orientation"
    ],
    "note": "Plan and epigraphic research source; north points left. All 134 column identifiers retained; display-only cutaway heights."
  },
  {
    "id": "src-abu-small-plan",
    "title": "Small Temple of Abu Simbel plan",
    "publisher": "Dieter Arnold, Lexikon der ägyptischen Baukunst (2000), p.10 / Commons scan",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/File:Map_of_the_Little_Temple_of_Abu_Simbel.png",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "abu-small-six-pillar-plan",
      "abu-small-sanctuary"
    ],
    "note": "Historical architectural reference; Commons marks the diagram public-domain/ineligible. Credit retained; not a present-day access map."
  },
  {
    "id": "src-gem-authority-plans",
    "title": "GEM Authority Facilities Management Prequalification — Annex floor plans",
    "publisher": "Grand Egyptian Museum Authority / Ministry of Antiquities",
    "authority": "official-primary",
    "url": "https://www.investinegypt.gov.eg/Arabic/NewsAndEvents/News/SiteAssets/GEMFMO%20%2810%20June%200248%20HR%29%20Compiled%20Prequalification%20Form.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "gem-ground-floor-2016",
      "gem-upper-floor-2016"
    ],
    "note": "Annex PDF pages 62 and 68, CAD dates 2016-06-15. Historic architectural reference, not a 2026 circulation or exhibit-location survey."
  },
  {
    "id": "src-gem-gallery-sign",
    "title": "Main Galleries plan photographed on site, 5 January 2025",
    "publisher": "GEM on-site sign / Richard Mortel photograph",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/File:Main_Galleries_plan_in_grand_egyptian_museum.jpg",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "main-gallery-numbers",
      "chronology-theme-matrix"
    ],
    "note": "Photo © Richard Mortel, CC BY 2.0. Source for 01–12 labels and themes only; oblique sign photograph is not directly extruded into architectural geometry."
  },
  {
    "id": "src-gem-visitor-guide",
    "title": "GEM English Visitor Guide",
    "publisher": "Grand Egyptian Museum",
    "authority": "official-primary",
    "url": "https://gem-pulse.com/gemdc/GEM_Visitor_Guide-English.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "public-arrival",
      "levels",
      "visitor-areas"
    ],
    "note": "Pages 8–9 identify levels and public attractions. Illustrated three-dimensional visitor diagram is not a survey floor plan."
  },
  {
    "id": "src-gem-tut-designer",
    "title": "Tutankhamun Gallery floor plan and sections",
    "publisher": "ATELIER BRÜCKNER",
    "authority": "authoritative",
    "url": "https://www.atelier-brueckner.com/en/media-library/gem-grand-egyptian-museum",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "tutankhamun-display-plan-2025",
      "exhibition-design"
    ],
    "note": "Exhibition designer’s published floor plan; source credit retained. Geometry and interpretation are separate from former construction plans."
  },
  {
    "id": "src-itinerary-image",
    "title": "本次行程草案",
    "publisher": "用户提供",
    "authority": "user-primary",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "itinerary",
      "transfers",
      "provisional-visit-times"
    ],
    "note": "外部原件未收入项目；仅记录文件名与摘要。行程草案的优先级低于航班及酒店确认截图。"
  },
  {
    "id": "src-flight-images",
    "title": "本次航班确认记录",
    "publisher": "用户提供 / 航旅纵横",
    "authority": "user-primary",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "flight-numbers",
      "flight-times",
      "terminals"
    ],
    "note": "外部原件未收入项目；不展示订单号或旅客身份。"
  },
  {
    "id": "src-hotel-images",
    "title": "本次住宿确认记录",
    "publisher": "用户提供 / 预订平台截图",
    "authority": "user-primary",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "lodging-dates",
      "lodging-room-types",
      "booking-state"
    ],
    "note": "外部原件未收入项目；只使用酒店、日期和房型，不保存金额、订单号、账户或旅客身份。"
  },
  {
    "id": "src-nmec-exterior-plan-2023",
    "title": "Investigating the Socio-Economic Sustainability within the Egyptian Museums over the Last Decade — Fig.4(a–e)",
    "publisher": "Sustainability 2023, 15, 16746",
    "authority": "authoritative",
    "url": "https://www.mdpi.com/2071-1050/15/24/16746",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-integrated-exterior-plan",
      "nmec-arrival-building"
    ],
    "note": "PDF pp12–13 visually reviewed. Fig.4(b) orthographic integrated plan preserves relative rotation; Fig.4(a) is a maquette/birdseye image, not a current survey. Reference numbering is inconsistent: drawings credited in reference40 to Keseeba 2007, caption cites41. No claim of 2026 as-built metric geometry."
  },
  {
    "id": "src-nmec-architect-plan-2024",
    "title": "The role of historical architectural scale models in Egyptian Museums — Fig.17",
    "publisher": "Osama Abdelhady Aboelyazed Khalifa / CPAS",
    "authority": "authoritative",
    "url": "https://publication-cpas-egypt.com/wp-content/uploads/2025/01/007.pdf",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-exhibition-building-outline",
      "nmec-central-structure"
    ],
    "note": "PDF p15 Fig.17 visually reviewed; plan explicitly credited to architect Al-Ghazali Kesseiba. Uniform scale into integrated exterior coordinates; no current exhibit assignment inferred."
  },
  {
    "id": "src-nmec-model-photo",
    "title": "NMEC-Model.jpg — museum architectural maquette",
    "publisher": "Roland Unger / Wikimedia Commons",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/File:NMEC-Model.jpg",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-roof-hierarchy",
      "nmec-exterior-component-relationships"
    ],
    "note": "2017 photograph, CC BY-SA4.0. Inspected as a historic building model, NOT a photograph of the actual building or source of measured heights. Current entrance and museum facade photographs checked separately."
  },
  {
    "id": "src-nmec-pavilion-section",
    "title": "NMEC Top Panorama — 3D corner section, 2019",
    "publisher": "Mahmoud Hussain, architectural modeling and drawings",
    "authority": "authoritative",
    "url": "https://www.behance.net/gallery/116304541/NMEC-Top-Panorama-(Capital-Museum)",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-pavilion-pyramid",
      "nmec-pavilion-inverted-glass-base",
      "nmec-pavilion-piers"
    ],
    "note": "Author credits architect Ghazali Kesseiba and exhibit designer Arata Isozaki; section visually inspected for pavilion structure. Private research reference, original image not published in the site."
  },
  {
    "id": "src-nmec-facade-photo",
    "title": "NMEC-MainEntrance.jpg — actual main entrance",
    "publisher": "Roland Unger / Wikimedia Commons",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/File:NMEC-MainEntrance.jpg",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "nmec-entrance-portico",
      "nmec-as-built-pavilion-silhouette"
    ],
    "note": "2017-03-05, CC BY-SA4.0. Actual facade/4 stone entrance piers/glazing inspected; canonical cover asset includes attribution and license provenance. Not a floor-plan source."
  },
  {
    "id": "src-nmec",
    "title": "National Museum of Egyptian Civilization",
    "publisher": "NMEC",
    "authority": "official-primary",
    "url": "https://nmec.gov.eg/new-home/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "nmec-identity",
      "visitor-information",
      "collections"
    ]
  },
  {
    "id": "src-nmec-main",
    "title": "NMEC Main Gallery",
    "publisher": "NMEC",
    "authority": "official-primary",
    "url": "https://nmec.gov.eg/main-gallery/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "nmec-main-gallery",
      "chronology",
      "themes"
    ]
  },
  {
    "id": "src-nmec-mummies",
    "title": "NMEC Royal Mummies Hall",
    "publisher": "NMEC",
    "authority": "official-primary",
    "url": "https://nmec.gov.eg/mummies-hall/",
    "verifiedAt": "2026-09-17",
    "scopes": [
      "royal-mummies",
      "display-ethics"
    ],
    "note": "官方页面列出哈特谢普苏特、图特摩斯三世等人物，并说明展厅借鉴帝王谷墓葬氛围。此前核对记录中的男女数量拆分差异保留在来源层；游客入门卡不以数量或核对过程代替参观看点。"
  },
  {
    "id": "src-nmec-floor-plan",
    "title": "NMEC Floor Plan",
    "publisher": "NMEC",
    "authority": "official-primary",
    "url": "https://nmec.gov.eg/floor-plan/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "nmec-floor-relationship",
      "official-virtual-plan"
    ],
    "note": "官方页面嵌入 Matterport；本地图只提取楼层与主要展区关系，不复制全景或推断门洞。"
  },
  {
    "id": "src-nmec-plan-study",
    "title": "Sustainability Assessment of the National Museum of Egyptian Civilization (NMEC): Environmental, Social, Economic, and Cultural Analysis",
    "publisher": "Sustainability / MDPI",
    "authority": "authoritative",
    "url": "https://www.mdpi.com/2071-1050/14/20/13080",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "nmec-main-hall-plan",
      "nmec-mummies-hall-plan"
    ]
  },
  {
    "id": "src-gem",
    "title": "The Grand Egyptian Museum — visitor information",
    "publisher": "Grand Egyptian Museum",
    "authority": "official-primary",
    "url": "https://gem.eg/visit/plan-your-visit/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "gem-identity",
      "visitor-information"
    ]
  },
  {
    "id": "src-gem-map",
    "title": "Grand Egyptian Museum maps",
    "publisher": "Grand Egyptian Museum",
    "authority": "official-primary",
    "url": "https://gem.eg/visit/plan-your-visit/museum-maps/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "official-complex-map",
      "exterior-visitor-zones"
    ],
    "note": "官网当前展示园区图和航拍，不是馆内楼层图。"
  },
  {
    "id": "src-gem-tickets",
    "title": "Grand Egyptian Museum ticketing",
    "publisher": "Grand Egyptian Museum",
    "authority": "official-primary",
    "url": "https://tickets.gem.eg/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "hours",
      "ticket-products",
      "open-galleries"
    ]
  },
  {
    "id": "src-gem-experience",
    "title": "The Grand Egyptian Museum",
    "publisher": "Experience Egypt / Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://www.experienceegypt.eg/en/attraction-details/346/the-grand-egyptian-museum-gem",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "gallery-breadth",
      "grand-staircase",
      "tutankhamun",
      "khufu-boats"
    ]
  },
  {
    "id": "src-egypt-giza",
    "title": "Giza Plateau",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/ar/archaeological-sites/giza-plateau",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "giza-site",
      "hours",
      "ticket-scope"
    ]
  },
  {
    "id": "src-egypt-khufu",
    "title": "The Great Pyramid",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/the-great-pyramid/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "khufu-history",
      "khufu-features",
      "hours"
    ]
  },
  {
    "id": "src-egypt-khafre",
    "title": "Pyramid Complex of Khafre",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/pyramid-complex-of-khafre-khefren/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "khafre-complex",
      "valley-temple",
      "sphinx-relationship"
    ]
  },
  {
    "id": "src-egypt-menkaure",
    "title": "Pyramid Complex of Menkaure",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/pyramid-complex-of-menkaure/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "menkaure-complex"
    ]
  },
  {
    "id": "src-egypt-sphinx",
    "title": "The Great Sphinx",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/the-great-sphinx/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "sphinx-history",
      "sphinx-material"
    ]
  },
  {
    "id": "src-digital-giza",
    "title": "Digital Giza",
    "publisher": "The Giza Project at Harvard University",
    "authority": "authoritative",
    "url": "https://giza.fas.harvard.edu/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "giza-relative-layout",
      "monument-identities",
      "archaeological-context"
    ]
  },
  {
    "id": "src-giza-plateau-plan",
    "title": "Giza Plateau archaeological plan",
    "publisher": "Giza Archives / GizaPyramids.org",
    "authority": "authoritative",
    "url": "https://www.gizapyramids.org/static/html/maps_plans.jsp",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "giza-site-plan",
      "pyramid-complexes",
      "cemeteries",
      "temples-and-causeways"
    ],
    "note": "离线副本由站点 Zoomify 原图瓦片无改动拼合；用于遗址关系，不用于现行游客导航。"
  },
  {
    "id": "src-unesco-memphis",
    "title": "Memphis and its Necropolis",
    "publisher": "UNESCO World Heritage Centre",
    "authority": "authoritative",
    "url": "https://whc.unesco.org/en/list/86",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "giza-world-heritage-context"
    ]
  },
  {
    "id": "src-citadel",
    "title": "Cairo Citadel",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/archaeological-sites/cairo-citadel/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "citadel-history",
      "site-components"
    ]
  },
  {
    "id": "src-muhammad-ali",
    "title": "Muhammad Ali Mosque",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/muhammad-ali-mosque/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "mosque-history",
      "architectural-form",
      "hours",
      "ticket-scope"
    ]
  },
  {
    "id": "src-citadel-map",
    "title": "Cairo Citadel present-day site map",
    "publisher": "Wikimedia Commons contributors",
    "authority": "media-repository",
    "url": "https://commons.wikimedia.org/wiki/File:GD-EG-Citadelle_du_Caire-map_ENG.jpg",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "citadel-present-layout",
      "site-components"
    ],
    "note": "CC BY-SA 4.0；用于场地关系重绘。"
  },
  {
    "id": "src-muhammad-ali-plan",
    "title": "Mosque of Muhammad Ali Pasha plan drawing",
    "publisher": "MIT Aga Khan Visual Archive",
    "authority": "authoritative",
    "url": "https://dome.mit.edu/handle/1721.3/63996",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "mosque-plan",
      "court-prayer-hall-relationship"
    ],
    "note": "1908 plan drawing，Public Domain。"
  },
  {
    "id": "src-historic-cairo",
    "title": "Historic Cairo",
    "publisher": "UNESCO World Heritage Centre",
    "authority": "authoritative",
    "url": "https://whc.unesco.org/en/list/89/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "historic-cairo-context",
      "urban-heritage"
    ]
  },
  {
    "id": "src-unesco-khan-map",
    "title": "Historic Cairo — Shyakha Khan Al Khalili map panel",
    "publisher": "UNESCO World Heritage Centre",
    "authority": "authoritative",
    "url": "https://whc.unesco.org/document/120217",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "khan-al-khalili-boundary",
      "historic-cairo-urban-context"
    ]
  },
  {
    "id": "src-abu-simbel",
    "title": "Abu Simbel",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/archaeological-sites/abu-simbel/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "abu-simbel-history",
      "great-temple",
      "small-temple",
      "relocation",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-unesco-nubian",
    "title": "Nubian Monuments from Abu Simbel to Philae",
    "publisher": "UNESCO World Heritage Centre",
    "authority": "authoritative",
    "url": "https://whc.unesco.org/en/list/88/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "relocation",
      "world-heritage-context"
    ]
  },
  {
    "id": "src-abu-plan",
    "title": "Great Temple at Abu Simbel — historic floor plan",
    "publisher": "Wikimedia Commons / public-domain historic survey",
    "authority": "authoritative",
    "url": "https://commons.wikimedia.org/wiki/Category:Floor_plans_of_Abu_Simbel_temples",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "great-temple-axis",
      "hall-sanctuary-plan"
    ]
  },
  {
    "id": "src-kom-ombo",
    "title": "Kom Ombo Temple",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/kom-ombo-temple",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "dual-axis-plan",
      "sobek",
      "harwer",
      "reliefs",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-kom-plan",
    "title": "Plan of the Temple of Kom Ombo",
    "publisher": "French Ministry of Culture / Jacques de Morgan archive",
    "authority": "authoritative",
    "url": "https://archeologie.culture.gouv.fr/jacques-morgan/en/mediatheque/plan-temple-kom-ombo",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "kom-ombo-plan",
      "dual-sanctuary",
      "courts-and-halls"
    ]
  },
  {
    "id": "src-aswan-guide",
    "title": "Aswan visitor guide",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/media/8341/%D9%85%D8%B4%D8%B1%D9%88%D8%B9-%D8%AF%D9%84%D9%8A%D9%84-%D8%A3%D8%B3%D9%88%D8%A7%D9%86-%D8%A5%D9%86%D8%AC%D9%84%D9%8A%D8%B2%D9%8A.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "edfu-history",
      "edfu-sequence",
      "kom-ombo-museum",
      "abu-simbel-context"
    ],
    "note": "PDF 内票价可能落后于现行票务页面；导览不把旧价写成当前价。"
  },
  {
    "id": "src-edfu-plan",
    "title": "Plan of the Temple of Edfu",
    "publisher": "University of South Florida / Encyclopaedia Britannica 1910",
    "authority": "authoritative",
    "url": "https://etc.usf.edu/maps/pages/10500/10598/10598.htm",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "edfu-pylon-court-halls-sanctuary-plan"
    ],
    "note": "历史平面支持墙、柱、厅室关系，不用于判断现时开放。站点标题的公元前 2134–1999 年为错误元数据，不采用；建造年代依据埃及文物部门。"
  },
  {
    "id": "src-edfu-official",
    "title": "Edfu Temple",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/temple-of-edfu/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "edfu-construction-history",
      "pylon-court-two-halls-sequence",
      "relief-context"
    ]
  },
  {
    "id": "src-luxor-temple",
    "title": "Luxor Temple",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/luxor-temple",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "luxor-temple-history",
      "architectural-sequence",
      "opet",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-luxor-plan",
    "title": "Temple of Luxor — Key Plan",
    "publisher": "Institute for the Study of Ancient Cultures, University of Chicago",
    "authority": "authoritative",
    "url": "https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/oic27.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "luxor-temple-key-plan",
      "architectural-phases"
    ]
  },
  {
    "id": "src-valley-kings",
    "title": "Valley of the Kings",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/archaeological-sites/valley-of-the-kings/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "valley-history",
      "tomb-landscape",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-theban-map",
    "title": "Theban Necropolis central area map",
    "publisher": "Theban Mapping Project",
    "authority": "authoritative",
    "url": "https://thebanmappingproject.com/sites/default/files/plans/Theban%20Necropolis.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "theban-necropolis-context",
      "valleys",
      "west-bank-sites"
    ]
  },
  {
    "id": "src-hatshepsut",
    "title": "Hatshepsut Temple",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/monuments/hatshepsut-temple/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "three-terraces",
      "chapels",
      "reliefs",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-hatshepsut-plan",
    "title": "Temple of Hatshepsut — archaeological plan",
    "publisher": "Antiquity / Cambridge University Press",
    "authority": "authoritative",
    "url": "https://www.cambridge.org/core/journals/antiquity/article/demonumentalising-perceptions-of-ancient-architectural-practices/6CE2DAFE0CA059189E9A2E65F8515122",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "hatshepsut-terraces",
      "chapels",
      "upper-sanctuary-plan"
    ]
  },
  {
    "id": "src-hatshepsut-oic-plan",
    "title": "Temple of Hatshepsut — Key Plans",
    "publisher": "Institute for the Study of Ancient Cultures, University of Chicago",
    "authority": "authoritative",
    "url": "https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/oic27.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "hatshepsut-lower-terrace",
      "hatshepsut-second-terrace",
      "hathor-and-anubis-chapels",
      "hatshepsut-upper-court"
    ]
  },
  {
    "id": "src-karnak",
    "title": "Karnak",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/archaeological-sites/karnak/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "karnak-precincts",
      "axes",
      "hypostyle",
      "hours",
      "tickets"
    ]
  },
  {
    "id": "src-karnak-plan",
    "title": "Karnak precinct plan and monument database",
    "publisher": "UCLA Digital Karnak",
    "authority": "authoritative",
    "url": "https://digitalkarnak.ucsc.edu/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "karnak-precincts",
      "axes",
      "monument-relationships"
    ]
  },
  {
    "id": "src-thebes",
    "title": "Ancient Thebes and its Necropolis",
    "publisher": "Egyptian Ministry of Tourism and Antiquities / UNESCO context",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/en/world-heritage/ancient-thebes-and-its-necropolis/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "thebes-landscape",
      "colossi",
      "sphinx-avenue",
      "world-heritage-context"
    ]
  },
  {
    "id": "src-colossi-research",
    "title": "Restoration of the Colossi of Memnon and Amenhotep III temple",
    "publisher": "Egyptian Ministry of Tourism and Antiquities",
    "authority": "official-primary",
    "url": "https://egymonuments.gov.eg/en/news/new-archaeological-discoveries-in-the-project-to-restore-the-colossi-of-memnon-and-the-temple-of-king-amenhotep-iii",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "colossi-context",
      "amenhotep-iii-temple",
      "restoration"
    ]
  },
  {
    "id": "src-amenhotep-photo-study",
    "title": "Images of a Lost Egypt",
    "publisher": "Institute for the Study of Ancient Cultures, University of Chicago",
    "authority": "authoritative",
    "url": "https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/lost3.pdf",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "historic-colossi-photograph"
    ],
    "note": "该出版物是历史摄影资料，不是葬祭殿平面；不得作为空间几何依据。"
  },
  {
    "id": "src-orange-bay",
    "title": "Orange Bay Hurghada",
    "publisher": "Orange Bay",
    "authority": "official-primary",
    "url": "https://www.orangebayhurghada.com/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "destination-identity",
      "island-services",
      "marine-setting"
    ],
    "note": "目的地官网不是用户所订船公司的订单凭证；接送、潜水、保险、上岛时段均保持待确认。"
  },
  {
    "id": "src-osm",
    "title": "OpenStreetMap",
    "publisher": "OpenStreetMap contributors",
    "authority": "authoritative",
    "url": "https://www.openstreetmap.org/copyright",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "journey-place-coordinates",
      "city-context"
    ],
    "note": "地图点位用于离线概览与相对位置；不是入口或步行导航。"
  },
  {
    "id": "src-natural-earth",
    "title": "Natural Earth 1:50m Admin 0 countries",
    "publisher": "Natural Earth",
    "authority": "authoritative",
    "url": "https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "national-outline"
    ],
    "note": "首页使用 1:50m 国家轮廓；数据固定到 natural-earth-vector 提交 ca96624a56bd078437bca8184e78163e5039ad19，不用于边界判定或导航。"
  },
  {
    "id": "src-commons-media",
    "title": "Local guide media manifest",
    "publisher": "Wikimedia Commons contributors",
    "authority": "media-repository",
    "url": "https://commons.wikimedia.org/",
    "verifiedAt": "2026-09-16",
    "scopes": [
      "guide-media"
    ],
    "note": "逐图文件名、作者、许可证与原始页面见本地 /images/guides/media-manifest.json。"
  }
];
export const sourceById=new Map(sources.map(s=>[s.id,s]));
