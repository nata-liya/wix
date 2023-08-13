import {
    APP_DEF_ID,
    GET_PREFERRED_APPS_PREFERENCE_URL,
    PreferredApp
} from '../config';
import * as http from './http';

const DEFAULT_PREFERRED_APP = PreferredApp.WixOneApp;
let preferredAppsData;

export async function getPreferredApp() {
    if (preferredAppsData) {
        const preferredApp = preferredAppsData.ownerPreferredApp;
        return isValid(preferredApp) ? preferredApp : DEFAULT_PREFERRED_APP;
    }
    const signedInstance = window.wixEmbedsAPI ? .getAppToken(APP_DEF_ID);

    if (!signedInstance) {
        return DEFAULT_PREFERRED_APP;
    }
    try {
        preferredAppsData = await http.fetchAsync({
            method: 'GET',
            url: GET_PREFERRED_APPS_PREFERENCE_URL,
            headers: {
                Authorization: signedInstance
            }
        });
        if (!preferredAppsData) {
            return DEFAULT_PREFERRED_APP;
        }
        const preferredApp = preferredAppsData.ownerPreferredApp;
        return isValid(preferredApp) ? preferredApp : DEFAULT_PREFERRED_APP;
    } catch (error) {
        return DEFAULT_PREFERRED_APP;
    }
}

function isValid(preferredApp) {
    switch (preferredApp) {
        case PreferredApp.WixOneApp:
        case PreferredApp.WixRestaurantsApp:
        case PreferredApp.WixBrandedApp:
        case PreferredApp.WixFitnessApp:
            return true;
        default:
            return false;
    }
}