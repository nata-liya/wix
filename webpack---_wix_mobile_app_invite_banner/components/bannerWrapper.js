import {
    Drawer
} from './drawer';
import BannerComponent from './banner';
import {
    experiments
} from '../services/experiments';
import {
    BannerType,
    SCRIPT_TAG_ID
} from '../config';
import {
    placeDetailsService
} from '../services/place-details';

export default class BannerWrapper {
    onLoad = async () => {
        const config = this.getConfig();

        if (config && config.type === BannerType.BOTTOM) {
            const isFetchPlaceDetailsEnabled =
                await experiments.isFetchPlaceDetailsEnabled();
            config.isShowAgainExpirationV2Enabled =
                await experiments.isShowAgainExpirationV2Enabled();
            config.isFetchPlaceDetailsEnabled = isFetchPlaceDetailsEnabled;

            if (isFetchPlaceDetailsEnabled) {
                const placeDetails = await placeDetailsService.fetch();
                config.preferredApp = placeDetails.preferredApp;
                config.placeImageUrl = placeDetails.imageUrl;
                config.appColor = placeDetails.appColor;
                config.placeName = placeDetails.title;
            }
            new Drawer().onLoad(config);
        } else {
            new BannerComponent().onLoad();
        }
    };

    getConfig = () => {
        const selfScript = document.getElementById(SCRIPT_TAG_ID);
        if (!selfScript) {
            console.error(
                'Unable to find app banner script.' +
                'please make sure you included the script along with a %s id',
                SCRIPT_TAG_ID,
            );
            return '#';
        }
        try {
            const encodedConfig = selfScript.getAttribute('config');
            const config = encodedConfig
                .split('***')
                .join('"')
                .split('###')
                .join(' ');
            return JSON.parse(config);
        } catch (error) {
            return undefined;
        }
    };
}