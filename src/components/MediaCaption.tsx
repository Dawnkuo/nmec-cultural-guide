import type { GuideMedia } from '../data/types';

export function MediaCaption({ media }: { media: GuideMedia }) {
  const credit = media.credit;
  return <span className="media-caption"><span>{media.caption}</span>{credit && <span className="media-attribution">
    {' '}<a href={credit.sourcePage} target="_blank" rel="noreferrer">{credit.author} · 图片来源</a>
    {' · '}<a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>
    {' · '}{credit.photographedAt}
  </span>}</span>;
}
