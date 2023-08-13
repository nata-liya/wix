export function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function createElementFromString(str) {
    const el = document.createElement('div');
    el.innerHTML = str.trim();
    return el.firstChild;
}

export function prependElementToBody(element) {
    document.body.insertBefore(element, document.body.firstChild);
}

export function removeElement(element) {
    element.parentNode.removeChild(element);
}

export function isElementFixed(element) {
    const {
        position
    } = getElementStyle(element);
    return position === 'fixed';
}

export function getElementStyle(element) {
    // if browser supports getComputed style - use it. otherwise read direct style only
    return window.getComputedStyle ? .(element) || element.style;
}