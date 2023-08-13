import {
    BrowserIcon,
    BrowserName
} from '../config';
import * as termsProvider from './terms-provider';

export function getBrowserInfo() {
    /* eslint-disable-next-line */
    const isSafari = (function(p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    const terms = termsProvider.get();
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== "undefined" || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    const isFirefox = typeof InstallTrigger !== 'undefined' || navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    const isIOSChrome = winNav.userAgent.match("CriOS");
    const isChromeBrowser = (isChromium !== null && typeof isChromium !== "undefined" && vendorName === "Google Inc." && isOpera === false && isIEedge === false);
    const isSafariUA = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isSafariVendor = (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && navigator.userAgent.indexOf('CriOS') === -1 && navigator.userAgent.indexOf('FxiOS') === -1);
    const userAgent = navigator.userAgent.toLowerCase();
    const chromeInfo = {
        name: terms[`browserName.${BrowserName.Chrome}`],
        iconUrl: BrowserIcon.Chrome
    };
    const safariInfo = {
        name: terms[`browserName.${BrowserName.Safari}`],
        iconUrl: BrowserIcon.Safari
    };
    const operaInfo = {
        name: terms[`browserName.${BrowserName.Opera}`],
        iconUrl: BrowserIcon.Opera
    };
    const fireFoxInfo = {
        name: terms[`browserName.${BrowserName.Firefox}`],
        iconUrl: BrowserIcon.Firefox
    };

    if (isOpera) {
        return operaInfo;
    }
    if (isFirefox) {
        return fireFoxInfo;
    }
    if (isIOSChrome || isChromeBrowser) {
        return chromeInfo;
    }
    if ((isSafari || window.safari !== undefined) || isSafariUA || isSafariVendor) {
        return safariInfo;
    }
    if (userAgent.indexOf('safari') !== -1) {
        if (userAgent.indexOf('chrome') > -1) {
            return chromeInfo;
        } else {
            return safariInfo;
        }
    }
    return {
        name: terms[`browserName.${BrowserName.Default}`],
        iconUrl: BrowserIcon.Default
    }
}

export function isIOS() {
    /* eslint-disable-next-line */
    const isSafari = (function(p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    const winNav = window.navigator;
    const isIOSChrome = winNav.userAgent.match("CriOS");
    const isSafariUA = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isSafariVendor = (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && navigator.userAgent.indexOf('CriOS') === -1 && navigator.userAgent.indexOf('FxiOS') === -1);
    return !!(isIOSChrome || ((isSafari || window.safari !== undefined) || isSafariUA || isSafariVendor));
}