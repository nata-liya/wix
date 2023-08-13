export interface Logger {
  acceptButtonClicked: () => void;
  openedPanel: (origin: string) => void;
  declineAllClicked: () => void;
  dismissClicked: () => void;
  hideSettingsClicked: (origin: string) => void;
  cookieLinkClicked: () => void;
  onSettingsChanged: (oldValue: string, newValue: string) => void;
}

// BI catalog: https://bo.wix.com/bi-catalog-webapp/#/sources/5/events/814?artifactId=gdpr-statics
export interface LogObject {
  evid: number;
  url: string;
  toggle?: boolean;
  policy?: 'cookie';
  action?:
    | 'accept'
    | 'settings'
    | 'dismiss'
    | 'read_policy'
    | 'render'
    | 'decline_all'
    | 'save';
}

function getHostUrl() {
  let biUrl = 'https://frog.wix.com/';
  const hostName =
    ((window as any).location && (window as any).location.hostname) || '';
  if (hostName.indexOf('.editorx.com') > -1) {
    biUrl = 'https://frog.editorx.com/';
  }
  return biUrl;
}

export const logger: Logger = {
  acceptButtonClicked,
  openedPanel,
  declineAllClicked,
  dismissClicked,
  hideSettingsClicked,
  cookieLinkClicked,
  onSettingsChanged,
};

function log(eventData: LogObject | any) {
  let logURI = `${getHostUrl()}gdpr?src=5`;
  eventData.url = location.href;
  Object.keys(eventData).forEach((key: string) => {
    logURI += `&${encodeURIComponent(key)}=${encodeURIComponent(
      eventData[key],
    )}`;
  });
  return sendTheBI(logURI);
}

function sendTheBI(logURI: string) {
  if (isIOS()) {
    return sendImage(logURI);
  } else {
    return sendBeacon(logURI) || sendImage(logURI);
  }
}

function isIOS() {
  const userAgent = navigator.userAgent || '';
  return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
}

function sendBeacon(url: string) {
  let sent = false;
  try {
    if (navigator && navigator.sendBeacon) {
      sent = navigator.sendBeacon(url);
    }
  } catch (e) {
    // Linty linter linted something
  }
  return sent;
}

function sendImage(url: string) {
  const img = new Image();
  img.src = url;
  return true;
}

function acceptButtonClicked(): void {
  log({
    evid: 814,
    action: 'accept',
    origin: 'banner',
  });
}

function cookieLinkClicked(): void {
  log({
    evid: 814,
    action: 'read_policy',
    origin: 'banner',
  });
}

function openedPanel(origin: string): void {
  log({
    evid: 814,
    action: 'settings',
    origin,
  });
}

function declineAllClicked(): void {
  log({
    evid: 814,
    action: 'decline_all',
    origin: 'banner',
  });
}

function dismissClicked(): void {
  log({
    evid: 814,
    action: 'dismiss',
  });
}

function hideSettingsClicked(origin: string): void {
  log({
    evid: 814,
    action: 'hide',
    origin,
  });
}

function onSettingsChanged(oldValue: string, newValue: string): void {
  log({
    evid: 1727,
    new_value: newValue,
    old_value: oldValue,
  });
}
