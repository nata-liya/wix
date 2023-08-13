/* eslint-disable prettier/prettier */
import styles from './banner.scss';
import BiEventsLogger from '../services/bi-events-logger';
import {
    DATA_CAPSULE_KEY,
    DISMISS_EXPIRY_MS,
    GET_APP_EXPIRY_MS,
    SCRIPT_TAG_ID,
    WIX_SITE_CONTAINER_ID,
    WIX_SITE_CONTAINER_ID_ALTERNATIVE,
    MOVE_VIEWPORT,
    HIDE_AFTER,
    EVENT_OPTIONS_PASSIVE_ONCE,
    EVENT_OPTIONS_PASSIVE,
    isMobile,
    isSuspectedBot,
    BannerType
} from '../config';
import * as dom from '../services/dom-manipulations';
import {
    localStorage
} from '../services/local-storage';
import * as termsProvider from '../services/terms-provider';
import {
    getLinkWithRef
} from '../services/link-editor';

class BannerComponent {
    biLogger = new BiEventsLogger(BannerType.TOP);
    bannerHeight = parseInt(styles.bannerHeight, 10);
    terms = undefined;

    async loadTerms() {
        if (!this.terms) {
            this.terms = termsProvider.get();
        }
    }

    async shouldShowBanner() {
        return this.isBannerDismissed().then((dismissed) => (!dismissed &&
            isMobile(navigator.userAgent) &&
            !isSuspectedBot()
        ));
    }

    onCloseClick = (event) => {
        event.stopPropagation();
        this.biLogger.logBannerDismissed();
        this.dismissBanner(DISMISS_EXPIRY_MS);
    };

    onBannerClick = () => {
        this.biLogger.logBannerClicked();
        this.dismissBanner(GET_APP_EXPIRY_MS);
        window.open(this.getAppLink(), '_blank');
    };

    isBannerDismissed() {
        return localStorage.read(DATA_CAPSULE_KEY).catch(() => false);
    }

    dismissBanner(expiration) {
        localStorage.write(DATA_CAPSULE_KEY, expiration, expiration);
        clearTimeout(this.autoHideTimer);
        return this.hideBanner();
    }

    hideBanner = () => {
        const hideAnimationDuration = parseInt(styles.animationDuration, 10);
        this.bannerElement.classList.add(styles.bannerRemove);
        if (MOVE_VIEWPORT) {
            this.restoreSiteViewport();
        }
        // cleanup after banner was already hidden and animation ended
        return dom.wait(hideAnimationDuration + 20).then(this.cleanup);
    };

    cleanup = () => {
        dom.removeElement(this.bannerElement);
        this.siteContainer.classList.remove(styles.siteContainerPushAnimation);
    };

    getAppLink() {
        const selfScript = document.getElementById(SCRIPT_TAG_ID);
        if (!selfScript) {
            return '#';
        }
        const appLink = selfScript.getAttribute('data-app-link');
        return getLinkWithRef(appLink, BannerType.TOP);
    }

    renderBanner = () => {
        this.siteContainer =
            document.getElementById(WIX_SITE_CONTAINER_ID) ||
            document.getElementById(WIX_SITE_CONTAINER_ID_ALTERNATIVE);
        if (!this.siteContainer) {
            return;
        }
        const template = `
    <div class="${styles.banner}" data-hook="wix-app-banner">
      <button class="${styles.closeButton}" data-hook="wix-app-banner-close">
        X
      </button>
      <div class="${styles.text}">
        <strong>${this.terms['title.Default']}</strong>
        <br />
        ${this.terms['subtitle.Default']}
      </div>
      <span
        data-hook="wix-app-banner-link"
        class="${styles.appLink}">
        ${this.terms.getAppText}
      </span>
    </div>`;
        this.bannerElement = dom.createElementFromString(template);
        this.innerContainer = this.siteContainer.firstElementChild;
        this.bindEvents();
        if (MOVE_VIEWPORT) {
            this.moveSiteViewport();
        }
        dom.prependElementToBody(this.bannerElement);
        this.biLogger.logBannerShown();
        this.autoHideTimer = setTimeout(this.hideBanner, HIDE_AFTER);
    };

    renderBannerWithDelay = () => {
        if (window.wixEmbedsAPI) {
            this.loadTerms().then(this.renderBanner);
        } else {
            window.addEventListener('wixEmbedsAPIReady', () => {
                this.loadTerms().then(this.renderBanner);
            }, EVENT_OPTIONS_PASSIVE_ONCE);
        }
    };

    moveSiteViewport() {
        this.siteContainer.classList.add(
            styles.siteContainerPush,
            styles.siteContainerPushAnimation,
        );
        this.setContainerHeight();
        this.registerSizingEvents();
    }

    registerSizingEvents() {
        window.addEventListener('orientationchange', this.setContainerHeight, EVENT_OPTIONS_PASSIVE);
        window.addEventListener('resize', this.setContainerHeight, EVENT_OPTIONS_PASSIVE);
    }
    unregisterSizingEvents() {
        window.removeEventListener('orientationchange', this.setContainerHeight, EVENT_OPTIONS_PASSIVE);
        window.removeEventListener('resize', this.setContainerHeight, EVENT_OPTIONS_PASSIVE);
    }

    /**
     * This will override the "view height" used by css, as VH does not
     * take the address bar into account.
     */
    setContainerHeight = () => {
        const newHeight = window.innerHeight - this.bannerHeight;
        this.innerContainer.style.setProperty('height', `${newHeight}px`);
    };

    restoreSiteViewport() {
        this.unregisterSizingEvents();
        this.siteContainer.classList.remove(styles.siteContainerPush);
    }

    bindEvents() {
        const closeBtn = this.bannerElement.querySelector(`.${styles.closeButton}`);
        closeBtn.addEventListener('click', this.onCloseClick, EVENT_OPTIONS_PASSIVE_ONCE);
        this.bannerElement.addEventListener('click', this.onBannerClick, EVENT_OPTIONS_PASSIVE_ONCE);
    }

    onLoad() {
        this.shouldShowBanner().then((should) => {
            if (should) {
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    this.renderBannerWithDelay();
                } else {
                    document.addEventListener('DOMContentLoaded', this.renderBannerWithDelay, EVENT_OPTIONS_PASSIVE_ONCE);
                }
            }
        });
    }
}

export default BannerComponent;