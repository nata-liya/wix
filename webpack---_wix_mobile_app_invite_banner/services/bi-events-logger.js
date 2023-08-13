import {
    BI_EVENTS,
    BannerType,
    getWixBiSession
} from '../config';

class BiEventsLogger {
    constructor(bannerType) {
        this.bannerType = bannerType;
    }

    logBannerShown() {
        return this.log({
            evid: BI_EVENTS.BANNER_SHOWN
        });
    }

    logBannerClicked() {
        return this.log({
            evid: BI_EVENTS.BANNER_CLICKED,
            type: 'click'
        });
    }

    logBannerDismissed() {
        return this.log({
            evid: BI_EVENTS.BANNER_CLICKED,
            type: 'dismiss'
        });
    }

    log(params) {
        const {
            viewerSessionId,
            visitorId,
            msId
        } = getWixBiSession();
        const msid = msId || window.rendererModel ? .metaSiteId;
        sendBi(BI_EVENTS.URL, {
            src: BI_EVENTS.SRC,
            msid,
            vsi: viewerSessionId,
            vid: visitorId,
            bannerType: this.bannerType === BannerType.BOTTOM ? 'bottom' : 'top',
            ...params,
        });
    }
}

export function sendBi(url, params) {
    const urlParams = serializeUrlParams(params);
    const biUrl = `${url}?${urlParams}`;
    try {
        if (window.navigator.sendBeacon(biUrl)) {
            return;
        }
    } catch (e) {
        console.error('Send BI failed', e);
    }
    new Image().src = biUrl;
}

export function serializeUrlParams(params) {
    return Object.entries(params)
        .filter(([, value]) => typeof value !== 'undefined')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
}

export default BiEventsLogger;