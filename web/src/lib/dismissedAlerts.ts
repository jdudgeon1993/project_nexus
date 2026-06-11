const DISMISSED_ALERTS_KEY = 'nexus_dismissed_alerts';

/** Dismissal key: alert id + header, so an edited/updated alert un-dismisses itself. */
export function alertDismissKey(id: string, header: string): string {
  return `${id}|${header}`;
}

export function loadDismissedAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_ALERTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function persistDismissedAlerts(keys: Set<string>) {
  localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify([...keys]));
}
