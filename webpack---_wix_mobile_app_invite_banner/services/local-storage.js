import {
    LocalStorageCapsule
} from 'data-capsule';
import {
    DATA_CAPSULE_NAMESPACE
} from '../config';

const capsule = LocalStorageCapsule({
    namespace: DATA_CAPSULE_NAMESPACE
});

function read(key) {
    return capsule.getItem(key).then((record) => {
        if (record) {
            const {
                value,
                timestamp
            } = JSON.parse(record);
            if (Date.now() < timestamp) {
                return value;
            }
        }
    });
}

function getValue(key) {
    return capsule.getItem(key).then((record) => {
        if (record) {
            const {
                value
            } = JSON.parse(record);
            return value;
        }
    });
}

function write(key, value, expiration) {
    return capsule.setItem(
        key,
        JSON.stringify({
            value,
            timestamp: Date.now() + expiration,
        }),
    );
}

export const localStorage = {
    getValue,
    write,
    read
};