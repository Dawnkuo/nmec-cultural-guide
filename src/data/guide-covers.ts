import provenance from '../../public/images/covers/provenance.json';
import type { GuideMedia } from './types';

// Each selection was inspected as an image, not inferred from search order or a filename.
const subjects: Record<keyof typeof provenance, string> = {
  'national-museum-egyptian-civilization': '埃及国家文明博物馆正门广场、石质主立面与上方金字塔形玻璃屋顶',
  'giza-plateau': '吉萨高地三座主要金字塔及周围沙漠的远景',
  'grand-egyptian-museum': '大埃及博物馆入口广场、三角形立面与方尖碑',
  'cairo-citadel': '开罗城堡内穆罕默德·阿里清真寺的石质外墙、穹顶群与尖塔',
  'khan-el-khalili': '哈利利市场内有商铺、悬挂商品和行人的真实街巷',
  'abu-simbel': '阿布辛贝大神庙岩凿立面及拉美西斯二世四尊坐像',
  'kom-ombo': '康翁波神庙正面柱廊与并列入口',
  'edfu-temple': '埃德富荷鲁斯神庙完整第一塔门及中央入口',
  'luxor-temple': '暮色中亮灯的卢克索神庙第一塔门、方尖碑与前庭',
  'valley-of-the-kings': '帝王谷东谷的石灰岩山坡、步道与墓葬入口地景',
  'hatshepsut-temple': '哈特谢普苏特葬祭殿的柱廊、中央坡道与后方悬崖',
  'colossi-of-memnon': '卢克索西岸两尊门农巨像及其后方山地',
  'karnak': '卡纳克阿蒙神庙的第一塔门及入口广场',
  'orange-bay': 'Orange Bay 的木栈桥、遮阳设施与吉夫顿岛浅海',
};

export const coverSlugs = Object.keys(subjects);
export function guideCover(slug: string): GuideMedia {
  const key = slug as keyof typeof provenance;
  const record = provenance[key];
  if (!record || !subjects[key]) throw new Error(`No reviewed cover: ${slug}`);
  return {
    src: record.file, alt: subjects[key],
    caption: `${record.author} · ${record.license} · 拍摄：${record.photographedAt}`,
    credit: { author: record.author, sourcePage: record.sourcePage, license: record.license, licenseUrl: record.licenseUrl, photographedAt: record.photographedAt },
    // Entire architectural subject stays visible in every consumer. No portrait slicing.
    framing: { hero: 'contain', directory: 'contain', card: 'contain', thumbnail: 'contain' },
    dimensions: { width: record.width, height: record.height },
  };
}
