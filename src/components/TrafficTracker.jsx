import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../lib/api';

const VISIT_SESSION_KEY = 'rbe:traffic:visit-recorded';

const classifySourceHint = () => {
  const ref = String(document.referrer || '').toLowerCase();
  const query = new URLSearchParams(window.location.search);
  const utmSource = String(query.get('utm_source') || '').toLowerCase();

  if (utmSource.includes('google') || ref.includes('google.')) return 'google';
  if (utmSource.includes('share') || utmSource.includes('social') || /facebook|instagram|tiktok|discord|x\.com|twitter|linkedin|whatsapp/.test(ref)) return 'share';
  if (!ref) return 'direct';
  return 'site';
};

const sendTrafficEvent = async (eventType, path) => {
  const payload = {
    eventType,
    path,
    referrer: document.referrer || '',
    source: classifySourceHint(),
    timestamp: new Date().toISOString(),
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

  useEffect(() => {
    const path = `${location.pathname}${location.search || ''}`;

    if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
      sessionStorage.setItem(VISIT_SESSION_KEY, '1');
      sendTrafficEvent('visit', path);
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
    };

    clickHandlerRef.current = handler;
    document.addEventListener('click', handler, { passive: true });

    return () => {
      if (clickHandlerRef.current) {
        document.removeEventListener('click', clickHandlerRef.current);
      }
    };
  }, [location.pathname, location.search]);

  return null;
}
