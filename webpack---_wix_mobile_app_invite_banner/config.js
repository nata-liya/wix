const DAY_MS = 60 * 60 * 24 * 1000;
export const DISMISS_EXPIRY_MS = DAY_MS * 7;
export const GET_APP_EXPIRY_MS = DAY_MS * 28;
export const NOT_NOW_EXPIRY_V2_7_DAYS = DAY_MS * 7;
export const NOT_NOW_EXPIRY_V2_28_DAYS = DAY_MS * 28;
export const OPEN_APP_EXPIRY_V2_1_SEC_MS = 1000;
export const DATA_CAPSULE_NAMESPACE = 'wix.promote.appDownloadBanner';
export const DATA_CAPSULE_KEY = 'dismissed';
export const DEFAULT_LANG_KEY = 'en';
export const SUPPORTED_USER_AGENTS = /(android|iphone)(?!.*(googlebot|tablet))/i;
export const SCRIPT_TAG_ID = 'wix-mobile-app-banner';
export const WIX_SITE_CONTAINER_ID = 'SITE_CONTAINER';
export const WIX_SITE_CONTAINER_ID_ALTERNATIVE = 'site-container';
export const MOVE_VIEWPORT = false; // this breaks "back-to-top" in-page links
export const HIDE_AFTER = 18000;
export const GET_PREFERRED_APPS_PREFERENCE_URL = '/wixapp/api/v1/preferred-apps/preference';
export const APP_DEF_ID = '22bef345-3c5b-4c18-b782-74d4085112ff';
export const BANNER_DEFAULT_DELAY = 1500;
export const BI_EVENTS = {
    URL: 'https://frog.wix.com/oneapp',
    SRC: 67,
    BANNER_SHOWN: 622,
    BANNER_CLICKED: 623,
};
export const PreferredApp = {
    WixOneApp: 'WixOneApp',
    WixFitnessApp: 'WixFitnessApp',
    WixRestaurantsApp: 'WixRestaurantsApp',
    WixBrandedApp: 'WixBrandedApp',
};
export const PreferredAppColor = {
    WixOneApp: '#116DFF',
    WixFitnessApp: '#067a69',
    WixRestaurantsApp: '#7F3377',
    WixBrandedApp: '#000000',
};
export const BannerType = {
    TOP: 'mobileBannerTop',
    BOTTOM: 'mobileBannerBottomV2'
};
export const BrowserName = {
    Safari: 'Safari',
    Chrome: 'Chrome',
    Opera: 'Opera',
    Firefox: 'Firefox',
    Default: 'Default',
};
export const BrowserIcon = {
    Opera: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Opera_2015_icon.svg/1024px-Opera_2015_icon.svg.png',
    Firefox: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg',
    Safari: 'https://static.wixstatic.com/shapes/1453b7_99643193078a4f58b3f3d39886e18363.svg',
    Chrome: 'https://static.wixstatic.com/shapes/1453b7_68affe044a6f4f1484f1a7c14dff0cf4.svg',
    Default: 'https://www.svgrepo.com/show/295345/internet.svg'
};
export const EVENT_OPTIONS_PASSIVE = {
    passive: true,
};
export const EVENT_OPTIONS_PASSIVE_ONCE = {
    ...EVENT_OPTIONS_PASSIVE,
    once: true,
};

export function getWixBiSession() {
    return window.wixBiSession || window.bi ? .wixBiSession || {};
}

export function isMobile(userAgent) {
    return SUPPORTED_USER_AGENTS.test(userAgent);
}

export function isSuspectedBot() {
    const {
        isjp
    } = getWixBiSession();
    return !!isjp;
}