export function log(...items) {
    items.forEach(i => console.log(i));
    return items.length === 1 ? items[0] : items;
}

export function titleCase(str) {
    if (!str) return str;
    return str
        .split(' ')
        .map(s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '')
        .join(' ');
}

export function truncate(str, maxLen) {
    if (typeof str !== 'string') return str;
    if (str.length <= maxLen) return str;
    const ell = '...';
    const cut = Math.max(0, maxLen - ell.length);
    return str.slice(0, cut) + ell;
}

export function areaCircle(r) {
    return Math.PI * r * r;
}

export function areaRect(w, h) {
    return w * h;
}