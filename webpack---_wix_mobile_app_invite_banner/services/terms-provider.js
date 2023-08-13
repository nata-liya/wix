import {
    DEFAULT_LANG_KEY
} from '../config';

// First try Wix multilingual selected language, then browser language, then default
export function get() {
    let terms = require(`./../assets/locale/messages_${DEFAULT_LANG_KEY}.json`);;
    try {
        terms = (
            // eslint-disable-next-line prettier/prettier
            getLocale(window ? .viewerModel ? .siteFeaturesConfigs ? .multilingual ? .currentLanguage.languageCode) ||
            getLocale(navigator.language) ||
            require(`./../assets/locale/messages_${DEFAULT_LANG_KEY}.json`)
        );
    } catch (exception) {
        console.log('failed to get translations', exception);
    }
    return terms;
}

function getLocale(language) {
    if (language) {
        const languageKey = language.slice(0, 2).toLowerCase();
        return require(`./../assets/locale/messages_${languageKey}.json`);
    }
}