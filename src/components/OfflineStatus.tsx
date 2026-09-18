import { siteUrl } from '../paths';
import { useEffect, useRef, useState } from 'react';

type Progress = { completed: number; total: number; phase: 'idle' | 'downloading' | 'ready' | 'failed'; version?: string; error?: string };

export function OfflineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [progress, setProgress] = useState<Progress>({ completed: 0, total: 0, phase: import.meta.env.DEV ? 'idle' : 'downloading' });
  const [open, setOpen] = useState(false);
  const registration = useRef<ServiceWorkerRegistration | null>(null);
  const previousOnline = useRef(online);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    addEventListener('online', updateOnline);
    addEventListener('offline', updateOnline);
    return () => {
      removeEventListener('online', updateOnline);
      removeEventListener('offline', updateOnline);
    };
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV || !('serviceWorker' in navigator)) return;
    const onMessage = (event: MessageEvent<Progress & { type?: string }>) => {
      if (event.data?.type === 'OFFLINE_PROGRESS' || event.data?.type === 'OFFLINE_STATUS') setProgress(event.data);
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    navigator.serviceWorker.register(siteUrl('/sw.js')).then(async (value) => {
      registration.current = value;
      const ready = await navigator.serviceWorker.ready;
      ready.active?.postMessage({ type: 'OFFLINE_STATUS' });
    }).catch(() => setProgress((state) => ({ ...state, phase: 'failed', error: 'Service Worker 注册失败' })));
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const reconnected = online && !previousOnline.current;
    previousOnline.current = online;
    if (reconnected && progress.phase === 'failed') registration.current?.active?.postMessage({ type: 'OFFLINE_RESUME' });
  }, [online, progress.phase]);

  const label = import.meta.env.DEV
    ? '本地开发'
    : progress.phase === 'ready'
      ? online ? '已缓存' : '离线可读'
      : progress.phase === 'downloading'
        ? '离线包下载中'
        : '离线包未完成';

  function resume() {
    setProgress((state) => ({ ...state, phase: 'downloading' }));
    registration.current?.active?.postMessage({ type: 'OFFLINE_RESUME' });
  }

  return (
    <div className="offline-widget">
      <button className="offline-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span aria-hidden="true">{online ? '◉' : '◌'}</span>{label}
      </button>
      {open && (
        <section className="offline-popover" aria-live="polite">
          <strong>可续传离线包</strong>
          {import.meta.env.DEV ? (
            <p>开发服务器不安装缓存；生产预览会逐文件校验并续传。</p>
          ) : (
            <>
              <p>{progress.phase === 'ready' ? '全部行程、城市章节、景点导览、图片与地图模块均已保存。' : '已完成并校验的文件会保留；中断后只重试缺失资源。旧的完整离线版本会保留到新版本全部就绪。'}</p>
              {progress.total > 0 && <><progress value={progress.completed} max={progress.total} /><small>{progress.completed} / {progress.total} 项</small></>}
              {progress.error && <small>{progress.error}</small>}
              {progress.phase !== 'ready' && <button type="button" onClick={resume} disabled={!online || progress.phase === 'downloading'}>{progress.completed ? '继续下载' : '下载离线包'}</button>}
            </>
          )}
        </section>
      )}
    </div>
  );
}
