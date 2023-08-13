import {
    BannerType,
    PreferredApp
} from '../config';

export function getLinkWithRef(link, bannerType) {
    if (!link) {
        return;
    }
    const {
        cleanLink,
        params
    } = extractQueryParams(link);
    let refValue = 'pre_banner_top';

    if (bannerType === BannerType.BOTTOM) {
        refValue = 'pre_banner_bottom';
    }
    if (!params) {
        return `${link}?ref=${refValue}`;
    }
    const {
        ref
    } = params;
    if (!ref) {
        return `${link}&ref=${refValue}`;
    }
    if (ref !== refValue) {
        params.ref = `${ref},${refValue}`;
    }
    const newQueryParams = convertObjectToQueryParams(params);
    return `${cleanLink}?${newQueryParams}`;
}

function extractQueryParams(link) {
    const [cleanLink, queryParams] = link.split('?');

    if (!queryParams) {
        return {
            cleanLink,
        };
    }

    const params = queryParams.split('&').reduce((acc, param) => {
        const pair = param.split('=');
        acc[pair[0]] = pair[1];
        return acc;
    }, {});

    return {
        cleanLink,
        params,
    };
}

function convertObjectToQueryParams(objectToConvert) {
    return Object.entries(objectToConvert)
        .filter(([, value]) => typeof value !== 'undefined')
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}

export function getLinkByAppType(link, appType) {
    if (appType === PreferredApp.WixBrandedApp) {
        return link.replace("https://apps.wix.com", "http://www.mobileappinvite.com");
    }
    return link;
}