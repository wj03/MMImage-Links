import { useEffect, useMemo, useRef, useState } from 'react';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { categories, sites, type CategoryFilter, type PhotoSite } from './sites';

type CheckState = { kind: 'ok' | 'limited' | 'fail'; label: string; elapsed: number };

async function requestStatus(url: string, method: 'HEAD' | 'GET'): Promise<{ status: number; ok: boolean }> {
  if (window.MMImage) return window.MMImage.checkUrl(url);
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.request({
      url,
      method,
      headers: method === 'GET' ? { Range: 'bytes=0-0' } : undefined,
      connectTimeout: 7000,
      readTimeout: 7000,
      responseType: 'text',
    });
    return { status: response.status, ok: response.status >= 200 && response.status < 300 };
  }
  const response = await fetch(url, {
    method,
    headers: method === 'GET' ? { Range: 'bytes=0-0' } : undefined,
    signal: AbortSignal.timeout(7000),
    redirect: 'follow',
  });
  return { status: response.status, ok: response.ok };
}

async function checkSite(site: PhotoSite): Promise<CheckState> {
  const started = performance.now();
  let response: { status: number; ok: boolean };
  try {
    try {
      response = await requestStatus(site.url, 'HEAD');
      if (response.status === 405 || response.status === 501) {
        response = await requestStatus(site.url, 'GET');
      }
    } catch {
      response = await requestStatus(site.url, 'GET');
    }
    const elapsed = Math.round(performance.now() - started);
    if (response.status === 401 || response.status === 403 || response.status === 429) {
      return { kind: 'limited', label: `站点响应 ${response.status} · 访问受限`, elapsed };
    }
    if (response.ok || (response.status >= 200 && response.status < 400)) {
      return { kind: 'ok', label: `可访问 · ${response.status}`, elapsed };
    }
    return { kind: 'fail', label: `HTTP ${response.status}`, elapsed };
  } catch {
    return {
      kind: 'fail',
      label: Capacitor.isNativePlatform() || window.MMImage ? '连接失败或超时' : '检测受浏览器跨域限制',
      elapsed: Math.round(performance.now() - started),
    };
  }
}

async function openSite(url: string) {
  if (window.MMImage) return window.MMImage.openExternal(url);
  if (Capacitor.isNativePlatform()) return AppLauncher.openUrl({ url });
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<CategoryFilter>('全部');
  const [query, setQuery] = useState('');
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('mmimage-favorites') ?? '[]') as string[]; }
    catch { return []; }
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const filteredSites = useMemo(() => sites.filter((site) => {
    const matchesCategory = category === '全部' || site.category === category;
    const matchesQuery = `${site.name} ${site.description} ${site.url}`.toLowerCase().includes(query.toLowerCase());
    const matchesFavorite = !showFavorites || favorites.includes(site.id);
    return matchesCategory && matchesQuery && matchesFavorite;
  }), [category, query, favorites, showFavorites]);

  async function runCheck(site: PhotoSite) {
    setChecking((current) => ({ ...current, [site.id]: true }));
    const result = await checkSite(site);
    setChecks((current) => ({ ...current, [site.id]: result }));
    setChecking((current) => ({ ...current, [site.id]: false }));
  }

  async function checkAll() {
    for (let index = 0; index < filteredSites.length; index += 3) {
      await Promise.all(filteredSites.slice(index, index + 3).map((site) => runCheck(site)));
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('mmimage-favorites', JSON.stringify(next));
      return next;
    });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="MMImage Links 首页">
          <span className="brand-mark">M<span>+</span></span>
          <span className="brand-name">MMImage <b>LINKS</b></span>
        </a>
        <div className="top-note"><span className="live-dot" /> 亚洲写真站点导航</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> PHOTO DIRECTORY · {sites.length} SOURCES</div>
          <h1>好图集，<em>一键直达。</em></h1>
          <p>精选亚洲写真与艺术摄影站点。检查链接状态，然后用浏览器打开。</p>
        </div>
        <div className="hero-stamp"><strong>{String(sites.length).padStart(2, '0')}</strong><span>个站点<br />随手可查</span></div>
      </section>

      <section className="directory" aria-label="写真网站目录">
        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="站点分类">
            {categories.map((item) => (
              <button key={item} className={`filter ${category === item ? 'active' : ''}`} onClick={() => { setCategory(item); setShowFavorites(false); }}>
                {item}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索站点" aria-label="搜索站点" />
            <kbd>CTRL K</kbd>
          </label>
        </div>

        <div className="list-heading">
          <div><span className="section-index">01 / LINKS</span><h2>{showFavorites ? '我的收藏' : '站点目录'} <small>{filteredSites.length}</small></h2></div>
          <div className="list-actions">
            <button className={`favorite-filter ${showFavorites ? 'selected' : ''}`} onClick={() => setShowFavorites((value) => !value)}>♡ 收藏</button>
            <button className="check-all" onClick={checkAll} disabled={filteredSites.length === 0}>检测当前列表 <span>↗</span></button>
          </div>
        </div>

        <div className="site-list">
          {filteredSites.map((site, index) => {
            const state = checks[site.id];
            return (
              <article className="site-row" key={site.id}>
                <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="site-monogram">{site.name.slice(0, 1)}</span>
                <div className="site-info">
                  <div className="site-title"><h3>{site.name}</h3><span className="site-badge">{site.badge}</span></div>
                  <p>{site.description}</p>
                  <span className="site-url">{site.url.replace('https://', '')}</span>
                </div>
                <div className="site-category">{site.category}</div>
                <div className="status-area" aria-live="polite">
                  {checking[site.id] ? <span className="status checking"><i /> 检测中</span> : state ? <span className={`status ${state.kind}`}><i />{state.label}<small>{state.elapsed} ms</small></span> : <span className="status idle"><i />尚未检测</span>}
                </div>
                <button className={`icon-button heart ${favorites.includes(site.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(site.id)} aria-label={favorites.includes(site.id) ? '取消收藏' : '收藏'} title="收藏">{favorites.includes(site.id) ? '♥' : '♡'}</button>
                <button className="icon-button probe" onClick={() => runCheck(site)} disabled={checking[site.id]} title="检查链接" aria-label={`检查 ${site.name} 链接`}><span>↻</span></button>
                <button className="open-button" onClick={() => openSite(site.url)}>打开网站 <span>↗</span></button>
              </article>
            );
          })}
          {filteredSites.length === 0 && <div className="empty-state">没有匹配的站点。试试其他关键词，或切回全部分类。</div>}
        </div>
      </section>

      <footer className="footer"><span>MMIMAGE LINKS <i>·</i> 个人站点导航</span><span>链接状态会因地区、网络与站点限制而不同</span></footer>
    </main>
  );
}
