import { OfflineStatus } from './OfflineStatus';
import { base } from '../paths';
export function SiteNav(){return <header className="site-nav"><a className="wordmark" href={base} aria-label="返回国家文明博物馆导览"><span>NMEC</span><strong>文明博物馆</strong></a><nav aria-label="主导航"><a href="#orientation">导览</a><a href="#spatial">地图</a><a href="#highlights">看点</a><a href="#sources">来源</a></nav><OfflineStatus/></header>;}
