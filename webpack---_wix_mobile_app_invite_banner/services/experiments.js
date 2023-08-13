import Experiments from '@wix/wix-experiments';

const experimentsInstance = new Experiments({
    scope: 'wix-one-app'
});

async function isExperimentEnabled(specName) {
    return new Promise((resolve) => {
        experimentsInstance
            .conduct(specName, 'false')
            .then((specResult) => resolve(specResult === 'true'))
            .catch(() => resolve(false));
    });
}

async function isFetchPlaceDetailsEnabled() {
    return isExperimentEnabled('specs.woa.GrowthMobileBannerDataFetch');
}

async function isShowAgainExpirationV2Enabled() {
    return isExperimentEnabled('specs.woa.GrowthMobileBannerExpirationV2');
}

export const experiments = {
    isShowAgainExpirationV2Enabled,
    isFetchPlaceDetailsEnabled,
};