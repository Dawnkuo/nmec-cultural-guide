import { siteUrl } from '../paths';
import { OfflineStatus } from './OfflineStatus';

export type NavKey = 'home' | 'itinerary' | 'cities' | 'guides' | 'bookings';
const links: Array<{ key: NavKey; label: string; href: string }> = [
  { key: 'home', label: '总览', href: '/' },
  { key: 'itinerary', label: '逐日行程', href: '/itinerary/' },
  { key: 'cities', label: '城市文化', href: '/cities/' },
  { key: 'guides', label: '景点导览', href: '/guides/' },
  { key: 'bookings', label: '凭证状态', href: '/bookings/' },
];

export function SiteNav({ active }: { active?: NavKey }) {
  return <header className="site-nav"><a className="wordmark" href={siteUrl("/")} aria-label="返回埃及纪行首页"><span>EG</span><strong>埃及纪行</strong></a><nav aria-label="主导航">{links.map((link) => <a key={link.key} className={active === link.key ? 'active' : ''} aria-current={active === link.key ? 'page' : undefined} href={siteUrl(link.href)}>{link.label}</a>)}</nav><OfflineStatus /></header>;
}
