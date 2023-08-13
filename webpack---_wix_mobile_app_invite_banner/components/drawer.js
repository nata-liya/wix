import * as dom from '../services/dom-manipulations';
import styles from './drawer.scss';
import {
    WIX_SITE_CONTAINER_ID_ALTERNATIVE,
    WIX_SITE_CONTAINER_ID,
    SCRIPT_TAG_ID,
    GET_APP_EXPIRY_MS,
    DISMISS_EXPIRY_MS,
    DATA_CAPSULE_KEY,
    EVENT_OPTIONS_PASSIVE_ONCE,
    PreferredApp,
    PreferredAppColor,
    isMobile,
    isSuspectedBot,
    BannerType,
    BANNER_DEFAULT_DELAY,
    NOT_NOW_EXPIRY_V2_28_DAYS,
    NOT_NOW_EXPIRY_V2_7_DAYS,
    OPEN_APP_EXPIRY_V2_1_SEC_MS,
} from '../config';
import {
    getLinkByAppType,
    getLinkWithRef
} from '../services/link-editor';
import * as appPreferences from '../services/app-preferences';
import * as termsProvider from '../services/terms-provider';
import BiEventsLogger from '../services/bi-events-logger';
import closeBtnSvg from '../assets/close-btn.inline.svg';
import {
    localStorage
} from '../services/local-storage';
import {
    isIOS
} from '../services/browser-detector';

export class Drawer {
    biLogger = new BiEventsLogger(BannerType.BOTTOM);
    drawerElement;
    preferredApp;
    appColor;
    config;
    terms;

    onLoad = (config) => {
        this.config = config;

        this.shouldShowDrawer().then((should) => {
            if (should) {
                if (
                    document.readyState === 'complete' ||
                    document.readyState === 'interactive'
                ) {
                    this.renderBannerWithDelay();
                } else {
                    document.addEventListener(
                        'DOMContentLoaded',
                        this.renderBannerWithDelay,
                    );
                }
            }
        });
    };

    async loadBannerData() {
        if (this.config.isFetchPlaceDetailsEnabled) {
            this.preferredApp = this.config.preferredApp;
            this.appColor = this.config.appColor;
        } else {
            await this.fetchFallbackBannerData();
        }
        if (!this.terms) {
            this.terms = termsProvider.get();
        }
    }

    async fetchFallbackBannerData() {
        if (!this.preferredApp) {
            this.preferredApp = await appPreferences.getPreferredApp();
        }
        if (!this.appColor) {
            this.appColor = this.getAppColor();
        }
    }

    getAppColor() {
        switch (this.preferredApp) {
            case PreferredApp.WixOneApp:
                return PreferredAppColor.WixOneApp;
            case PreferredApp.WixRestaurantsApp:
                return PreferredAppColor.WixRestaurantsApp;
            case PreferredApp.WixFitnessApp:
                return PreferredAppColor.WixFitnessApp;
            case PreferredApp.WixBrandedApp:
                return PreferredAppColor.WixBrandedApp;
            default:
                return PreferredAppColor.WixOneApp;
        }
    }

    async shouldShowDrawer() {
        return this.isDrawerDismissed().then(
            (dismissed) =>
            !dismissed && isMobile(navigator.userAgent) && !isSuspectedBot(),
        );
    }

    isDrawerDismissed() {
        return localStorage.read(DATA_CAPSULE_KEY).catch(() => false);
    }

    renderBannerWithDelay = async () => {
        if (window.wixEmbedsAPI) {
            this.loadBannerData().then(this.render);
        } else {
            window.addEventListener(
                'wixEmbedsAPIReady',
                () => {
                    this.loadBannerData().then(this.render);
                },
                EVENT_OPTIONS_PASSIVE_ONCE,
            );
        }
    };

    onOpenClick = () => {
        this.biLogger.logBannerClicked();
        if (this.config.isShowAgainExpirationV2Enabled) {
            localStorage.write(
                DATA_CAPSULE_KEY,
                OPEN_APP_EXPIRY_V2_1_SEC_MS,
                OPEN_APP_EXPIRY_V2_1_SEC_MS,
            );
        } else {
            localStorage.write(
                DATA_CAPSULE_KEY,
                GET_APP_EXPIRY_MS,
                GET_APP_EXPIRY_MS,
            );
        }
        window.open(this.getAppLink(), '_blank');
        this.hideDrawer();
    };

    onContinueClick = () => {
        this.biLogger.logBannerDismissed();

        if (this.config.isShowAgainExpirationV2Enabled) {
            this.saveExpirationV2();
        } else {
            localStorage.write(
                DATA_CAPSULE_KEY,
                DISMISS_EXPIRY_MS,
                DISMISS_EXPIRY_MS,
            );
        }
        this.hideDrawer();
    };

    saveExpirationV2 = () => {
        localStorage.getValue(DATA_CAPSULE_KEY).then((duration) => {
            switch (duration) {
                case NOT_NOW_EXPIRY_V2_7_DAYS:
                    {
                        localStorage.write(
                            DATA_CAPSULE_KEY,
                            NOT_NOW_EXPIRY_V2_28_DAYS,
                            NOT_NOW_EXPIRY_V2_28_DAYS,
                        );
                        break;
                    }
                case NOT_NOW_EXPIRY_V2_28_DAYS:
                    {
                        localStorage.write(
                            DATA_CAPSULE_KEY,
                            NOT_NOW_EXPIRY_V2_28_DAYS,
                            NOT_NOW_EXPIRY_V2_28_DAYS,
                        );
                        break;
                    }
                default:
                    {
                        localStorage.write(
                            DATA_CAPSULE_KEY,
                            NOT_NOW_EXPIRY_V2_7_DAYS,
                            NOT_NOW_EXPIRY_V2_7_DAYS,
                        );
                    }
            }
        });
    };

    initElements = () => {
        const closeButtonV2 = this.drawerElement.querySelector(
            `.${styles.closeButtonV2}`,
        );
        const openButton = this.drawerElement.querySelector(
            `.${styles.openButton}`,
        );
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const drawer = document.getElementById('drawerMain');

        closeButtonV2.style.setProperty('color', this.appColor);
        closeButtonV2.addEventListener('click', this.onContinueClick);
        drawer.style.setProperty('height', isIOS() ? '190px' : '170px');

        openButton.style.setProperty('background-color', this.appColor);
        openButton.addEventListener('click', this.onOpenClick);
        drawerBackdrop.addEventListener('click', undefined);
    };

    getAppLink = () => {
        const selfScript = document.getElementById(SCRIPT_TAG_ID);
        if (!selfScript) {
            return '#';
        }
        const appLink = selfScript.getAttribute('data-app-link');
        const linkByAppType = getLinkByAppType(appLink, this.preferredApp);
        return getLinkWithRef(linkByAppType, BannerType.BOTTOM);
    };

    cleanup = () => {
        dom.removeElement(this.drawerElement);
        this.siteContainer.classList.remove(styles.siteContainerPushAnimation);
    };

    hideDrawer = () => {
        const drawer = document.getElementById('drawerMain');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        const animationDuration = parseInt(styles.animationDuration, 10);
        drawerBackdrop.classList.add(styles.fadeOut);
        drawer.classList.add(styles.drawerRemove);
        dom.wait(animationDuration + 20).then(this.cleanup);
    };

    render = async () => {
        const hasPlaceImageUrl = this.config.placeImageUrl;
        const openButtonTitle = `ㅤㅤ${this.terms.openButton}ㅤㅤ`;
        const closeButtonTitle = `ㅤㅤ${this.terms.continueButton}ㅤㅤ`;

        const placeImageElement = hasPlaceImageUrl ?
            `<div class=${styles.placeImageBackground}>
        <img
         class=${styles.placeImage}
         src=${this.config.placeImageUrl}
       />
      </div>` :
            `<div class=${styles.noImageBackground}></div>`;

        const template = `
    <div class=${styles.drawerBackdrop} id="drawerBackdrop">
      <div class=${styles.drawer} data-hook="wix-app-banner" id="drawerMain">
        <div>${placeImageElement}</div>
        <strong class=${styles.title}>${this.terms.drawerTitle}</strong>
        <strong class=${styles.subtitle}>${this.terms[
      `drawerSubtitle.${this.preferredApp}`
    ].replace('{placeName}', this.config.placeName)}</strong>
        <button class=${styles.openButton}>${openButtonTitle}</button>
        <button class=${styles.closeButtonV2}>${closeButtonTitle}</button>
      </div>
    </div>`;

        this.drawerElement = dom.createElementFromString(template);
        this.siteContainer =
            document.getElementById(WIX_SITE_CONTAINER_ID) ||
            document.getElementById(WIX_SITE_CONTAINER_ID_ALTERNATIVE);
        this.innerContainer = this.siteContainer.firstElementChild;
        this.biLogger.logBannerShown();
        dom.prependElementToBody(this.drawerElement);
        this.initElements();
        this.showDrawer();
    };

    showDrawer = async () => {
        await dom.wait(BANNER_DEFAULT_DELAY);
        const drawer = document.getElementById('drawerMain');
        const drawerBackdrop = document.getElementById('drawerBackdrop');
        drawerBackdrop.style.setProperty('background', 'rgba(0, 0, 0, 0.5)');
        drawer.classList.add(styles.drawerShow);
    };
}