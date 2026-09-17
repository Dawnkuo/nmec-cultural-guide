export const base = import.meta.env.BASE_URL;
export const assetUrl = (path:string) => `${base}${path.replace(/^\//,'')}`;
export function withAssetBase<T>(value:T):T {
  if(typeof value==='string') return (/^\/(images|maps)\//.test(value)?assetUrl(value):value) as T;
  if(Array.isArray(value)) return value.map(withAssetBase) as T;
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,withAssetBase(v)])) as T;
  return value;
}
