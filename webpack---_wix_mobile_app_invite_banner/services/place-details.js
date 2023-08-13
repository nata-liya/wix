import {
    APP_DEF_ID,
    getWixBiSession,
    PreferredApp,
    PreferredAppColor,
} from '../config';
import * as http from './http';
import _ from 'lodash';

async function getPlaceDetails() {
    const {
        msId
    } = getWixBiSession();
    const businessId = msId || window.rendererModel ? .metaSiteId;
    const DEFAULT_PREFERRED_APP = PreferredApp.WixOneApp;

    if (!businessId) {
        return undefined;
    }
    try {
        const body = {
            businessIds: [businessId]
        };
        const signedInstance = window.wixEmbedsAPI ? .getAppToken(APP_DEF_ID);
        const placeDetailsResponse = await http.fetchAsync({
            method: 'POST',
            url: '/_/clubs/api/v1/business/join/details',
            body: JSON.stringify(body),
            headers: {
                Authorization: signedInstance,
            },
        });
        // placeDetails = { coverImageUrl, imageUrl, preferredApp, primaryColor, title, joinInformation, owner }
        const placeDetails = _.get(
            placeDetailsResponse,
            `joinDetails.${businessId}`,
        );

        if (!placeDetails) {
            return undefined;
        }
        const preferredApp = placeDetails.preferredApp ? ? DEFAULT_PREFERRED_APP;
        return {
            title: placeDetails.title,
            imageUrl: placeDetails.imageUrl,
            appColor: getAppColor(preferredApp),
            preferredApp,
        };
    } catch (error) {
        return undefined;
    }
}

function getAppColor(preferredApp) {
    switch (preferredApp) {
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

export const placeDetailsService = {
    fetch: getPlaceDetails,
};