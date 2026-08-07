import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../lib/api';

const VISIT_SESSION_KEY = 'rbe:traffic:visit-recorded';
const SEARCH_CLICK_SESSION_KEY = 'rbe:traffic:search-click-recorded';

const getSourceHint = () => {
  const ref = String(document.referrer || '').toLowerCase();
  const query = new URLSearchParams(window.location.search);
  const utmSource = String(query.get('utm_source') || '').toLowerCase();

  if (utmSource.includes('google') || ref.includes('google.')) return 'google';
  if (utmSource.includes('share') || utmSource.includes('social') || /facebook|instagram|tiktok|discord|x\.com|twitter|linkedin|whatsapp/.test(ref)) return 'share';
  if (!ref) return 'direct';
  return 'site';
};

const getSearchQueryHint = () => {
  const query = new URLSearchParams(window.location.search);
  const candidates = [query.get('q'), query.get('query'), query.get('utm_term'), query.get('keyword')]
    .map((v) => String(v || '').trim())
    .filter(Boolean);
  return candidates[0] || null;
};

const classifySourceHint = () => {
  return getSourceHint();
};

const sendTrafficEvent = async (eventType, path, metadata = {}) => {
  const payload = {
    eventType,
    path,
    referrer: document.referrer || '',
    source: classifySourceHint(),
    searchQuery: getSearchQueryHint(),
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  const endpoint = `${API_BASE}/api/public/traffic-event`;

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const ok = navigator.sendBeacon(endpoint, blob);
      if (ok) return;
    }

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silent fail: analytics should never block UI.
  }
};

export default function TrafficTracker() {
  const location = useLocation();
  const clickHandlerRef = useRef(null);
  const seenAdImpressionsRef = useRef(new Set());

  useEffect(() => {
    const path = `${location.pathname}${location.search || ''}`;
    const sourceHint = getSourceHint();

    if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
      sessionStorage.setItem(VISIT_SESSION_KEY, '1');
      sendTrafficEvent('visit', path);
    }

    if (sourceHint === 'google' && !sessionStorage.getItem(SEARCH_CLICK_SESSION_KEY)) {
      sessionStorage.setItem(SEARCH_CLICK_SESSION_KEY, '1');
      sendTrafficEvent('search_click', path);
    }

    if (sourceHint === 'google') {
      sendTrafficEvent('search_impression', path);
    }

    sendTrafficEvent('pageview', path);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handler = (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) return;
      const clickable = target.closest('a,button,[role="button"]');
      if (!clickable) return;

      const href = clickable.getAttribute('href');
      const path = href || `${location.pathname}${location.search || ''}`;
      sendTrafficEvent('click', path);

      const adSlot = clickable.getAttribute('data-ad-slot')
        || clickable.closest('[data-ad-slot]')?.getAttribute('data-ad-slot')
        || null;
      const adContainer = clickable.closest('.adsbygoogle,[data-ad-slot],[id*="google_ads"],[class*="ad-"]');
      if (adContainer) {
        sendTrafficEvent('ad_click', path, { adSlot: adSlot || 'generic' });
      }
    };

    clickHandlerRef.current = handler;
    document.addEventListener('click', handler, { passive: true });

    return () => {
      if (clickHandlerRef.current) {
        document.removeEventListener('click', clickHandlerRef.current);
      }
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const adSelectors = '.adsbygoogle,[data-ad-slot],[id*="google_ads"],[class*="ad-"]';
    const adNodes = Array.from(document.querySelectorAll(adSelectors));
    if (adNodes.length === 0) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
        const node = entry.target;
        const key = node.getAttribute('data-ad-slot') || node.id || `node-${Math.round(entry.boundingClientRect.top)}`;
        if (seenAdImpressionsRef.current.has(key)) return;

        seenAdImpressionsRef.current.add(key);
        sendTrafficEvent('ad_impression', `${location.pathname}${location.search || ''}`, { adSlot: key });
      });
    }, { threshold: [0.5] });

    adNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [location.pathname, location.search]);

  return null;
}
