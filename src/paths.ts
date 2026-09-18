export const base = import.meta.env.BASE_URL;
export function siteUrl(value: string): string;
export function siteUrl(value: string | undefined): string | undefined;
export function siteUrl(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith(base)) return value;
  return `${base}${value.slice(1)}`;
}
export const assetUrl = (value: string) => siteUrl(value);
export function stripBase(value: string) {
  return value.startsWith(base) ? `/${value.slice(base.length)}` : value;
}
export function withAssetBase<T>(value: T): T {
  if (typeof value === 'string') return (/^\/(images|maps)\//.test(value) ? siteUrl(value) : value) as T;
  if (Array.isArray(value)) return value.map(withAssetBase) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,withAssetBase(v)])) as T;
  return value;
}
