/**
 * Shared wire types between the host command handler and the browser UI.
 * Keep this module dependency-free so both the Node bundle and the client
 * bundle can import it without dragging in the full 64-hexagram data table.
 */
export const DIVINATION_TOPIC_LABELS = {
    career: '事业',
    family: '家庭',
    project: '当前项目',
    custom: '自定义',
};
export function lineMeta(value) {
    switch (value) {
        case 6:
            return { value, label: '老阴', yin: true, changing: true };
        case 7:
            return { value, label: '少阳', yin: false, changing: false };
        case 8:
            return { value, label: '少阴', yin: true, changing: false };
        case 9:
            return { value, label: '老阳', yin: false, changing: true };
        default:
            throw new Error(`invalid line value: ${String(value)}`);
    }
}
export function questionText(topic, customText) {
    if (topic === 'custom') {
        const text = customText?.trim();
        if (!text)
            throw new Error('自定义测算内容不能为空');
        return text;
    }
    return DIVINATION_TOPIC_LABELS[topic];
}
//# sourceMappingURL=shared.js.map