import { siteUrl } from '../paths';
import type { CoverRole, GuideMedia } from '../data/types';

export function GuideCover({ media, role }: { media: GuideMedia; role: CoverRole }) {
  return <img className={`guide-cover guide-cover--${role}`} src={siteUrl(media.src)} alt={media.alt}
    width={media.dimensions?.width} height={media.dimensions?.height}
    style={{ objectFit: media.framing?.[role] ?? 'contain', objectPosition: '50% 50%' }}
    loading={role === 'hero' ? 'eager' : 'lazy'} decoding="async"/>;
}

export function CoverCredit({ media }: { media: GuideMedia }) {
  const credit = media.credit;
  if (!credit) return null;
  return <p className="cover-credit">封面摄影：<a href={siteUrl(credit.sourcePage)} target="_blank" rel="noreferrer">{credit.author}</a>
    {' · '}{credit.licenseUrl ? <a href={siteUrl(credit.licenseUrl)} target="_blank" rel="noreferrer">{credit.license}</a> : credit.license}
    {' · '}拍摄：{credit.photographedAt}。保留原图主体，无生成式修改。</p>;
}
