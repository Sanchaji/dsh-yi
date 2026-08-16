import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * ☯ session-header button and the divination modal.
 * Uses plain React state and inline styles so the plugin does not need
 * ui-primitives, locale, or CSS-module tooling for the first version.
 */
import { useState } from 'react';
import { lineMeta } from "../shared.js";
const TOPICS = [
    { value: 'career', label: '事业' },
    { value: 'family', label: '家庭' },
    { value: 'project', label: '当前项目' },
    { value: 'custom', label: '自定义' },
];
const EMPTY_TOSSES = [null, null, null, null, null, null];
const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};
const panelStyle = {
    background: '#fff',
    color: '#222',
    borderRadius: 14,
    padding: 24,
    maxWidth: 580,
    width: '92%',
    maxHeight: '82vh',
    overflow: 'auto',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
    fontFamily: 'system-ui, sans-serif',
};
const titleStyle = {
    margin: '0 0 16px',
    fontSize: 20,
    fontWeight: 700,
};
const labelStyle = {
    display: 'block',
    margin: '14px 0 6px',
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
};
const chipRowStyle = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
};
const chipStyle = (active) => ({
    border: active ? '2px solid #2563eb' : '1px solid #d0d0d0',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#1e40af' : '#333',
    borderRadius: 999,
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: 14,
});
const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #d0d0d0',
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 14,
    marginTop: 6,
};
const lineRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
};
const tossButtonStyle = {
    border: '1px solid #c7c7c7',
    background: '#f8f8f8',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 13,
};
const primaryButtonStyle = {
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 18px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 18,
};
const closeButtonStyle = {
    border: '1px solid #d0d0d0',
    background: '#fff',
    color: '#333',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 18,
    marginLeft: 8,
};
const resultBoxStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    background: '#fafafa',
    padding: '14px 16px',
    marginTop: 16,
    whiteSpace: 'pre-wrap',
};
function randomToss() {
    const coins = [0, 1, 2].map(() => (Math.random() < 0.5 ? 'yang' : 'yin'));
    const yangCount = coins.filter(coin => coin === 'yang').length;
    // 0 个阳 = 6 老阴, 1 个阳 = 7 少阳, 2 个阳 = 8 少阴, 3 个阳 = 9 老阳
    const value = (6 + yangCount);
    return { line: lineMeta(value), coins };
}
function manualReady(tosses) {
    return tosses.every(toss => toss !== null);
}
function lineSymbol(line) {
    return line.yin ? '- -' : '—';
}
function coinFace(coin) {
    return coin === 'yang' ? '○' : '●';
}
function topicLabel(topic) {
    return TOPICS.find(item => item.value === topic)?.label ?? topic;
}
/**
 * The ☯ header action. Renders a small button and, when clicked, a modal that
 * guides the user through topic/method selection and shows the LLM reading.
 */
export function DivinationButton({ runDivination }) {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState('career');
    const [customText, setCustomText] = useState('');
    const [method, setMethod] = useState('auto');
    const [manualTosses, setManualTosses] = useState(EMPTY_TOSSES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const reset = () => {
        setTopic('career');
        setCustomText('');
        setMethod('auto');
        setManualTosses(EMPTY_TOSSES);
        setLoading(false);
        setError(null);
        setResult(null);
    };
    const close = () => {
        setOpen(false);
        reset();
    };
    const tossLine = (index) => {
        setManualTosses(current => {
            const next = [...current];
            next[index] = randomToss();
            return next;
        });
    };
    const start = async () => {
        const request = method === 'auto'
            ? {
                topic,
                ...(topic === 'custom' ? { customText: customText.trim() } : {}),
                method,
            }
            : {
                topic,
                ...(topic === 'custom' ? { customText: customText.trim() } : {}),
                method,
                lines: manualTosses.map(toss => toss.line.value),
            };
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const value = await runDivination(request);
            setResult(value);
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : String(caught));
        }
        finally {
            setLoading(false);
        }
    };
    const trigger = (_jsx("button", { type: "button", "aria-label": "\u5468\u6613\u6D4B\u7B97", title: "\u5468\u6613\u6D4B\u7B97", onClick: () => { setOpen(true); }, style: {
            border: '1px solid transparent',
            background: 'transparent',
            borderRadius: 8,
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
        }, children: "\u262F" }));
    if (!open)
        return trigger;
    const canStart = method === 'auto' || manualReady(manualTosses);
    return (_jsxs(_Fragment, { children: [trigger, _jsx("div", { style: overlayStyle, onClick: (event) => { if (event.target === event.currentTarget)
                    close(); }, children: _jsxs("div", { style: panelStyle, role: "dialog", "aria-modal": "true", "aria-label": "\u5468\u6613\u6D4B\u7B97", children: [_jsx("h2", { style: titleStyle, children: "\u262F \u5468\u6613\u6D4B\u7B97" }), _jsx("span", { style: labelStyle, children: "\u60F3\u6D4B\u4EC0\u4E48\uFF1F" }), _jsx("div", { style: chipRowStyle, children: TOPICS.map(item => (_jsx("button", { type: "button", style: chipStyle(topic === item.value), onClick: () => { setTopic(item.value); setResult(null); }, children: item.label }, item.value))) }), topic === 'custom'
                            ? (_jsx("input", { style: inputStyle, value: customText, placeholder: "\u8F93\u5165\u4F60\u60F3\u6D4B\u7B97\u7684\u4E8B\u60C5", onChange: (event) => { setCustomText(event.target.value); setResult(null); } }))
                            : null, _jsx("span", { style: labelStyle, children: "\u8D77\u5366\u65B9\u5F0F" }), _jsxs("div", { style: chipRowStyle, children: [_jsx("button", { type: "button", style: chipStyle(method === 'auto'), onClick: () => { setMethod('auto'); setResult(null); }, children: "\u4E00\u952E\u6D4B\u7B97" }), _jsx("button", { type: "button", style: chipStyle(method === 'manual'), onClick: () => { setMethod('manual'); setResult(null); }, children: "\u624B\u52A8\u6295\u63B7\u4E09\u679A\u786C\u5E01" })] }), method === 'manual'
                            ? (_jsxs("div", { children: [_jsx("span", { style: labelStyle, children: "\u4F9D\u6B21\u63B7\u51FA\u516D\u723B\uFF08\u4ECE\u4E0B\u5230\u4E0A\uFF09" }), manualTosses.map((toss, index) => (_jsxs("div", { style: lineRowStyle, children: [_jsxs("span", { style: { width: 64, fontSize: 13, color: '#555' }, children: ["\u7B2C ", index + 1, " \u723B"] }), _jsx("button", { type: "button", style: tossButtonStyle, onClick: () => tossLine(index), children: toss === null ? '掷币' : '重掷' }), _jsx("span", { style: { fontSize: 18, letterSpacing: 4, color: toss === null ? '#bbb' : '#111', minWidth: 64 }, children: toss === null ? '○ ○ ○' : toss.coins.map(coinFace).join(' ') }), _jsx("span", { style: { fontSize: 14, color: toss === null ? '#aaa' : '#111' }, children: toss === null ? '尚未掷出' : `${toss.line.label}（${toss.line.value}） ${lineSymbol(toss.line)}` })] }, index)))] }))
                            : null, error !== null ? _jsx("div", { style: { ...resultBoxStyle, color: '#b91c1c', borderColor: '#fecaca' }, children: error }) : null, result !== null
                            ? (_jsxs("div", { style: resultBoxStyle, children: [_jsxs("div", { children: [_jsx("strong", { children: "\u6D4B\u95EE\uFF1A" }), result.question] }), _jsxs("div", { children: [_jsx("strong", { children: "\u516D\u723B\uFF1A" }), result.lines.map((line, index) => `${index + 1}${line.label} ${lineSymbol(line)}`).join('  ')] }), _jsxs("div", { children: [_jsx("strong", { children: "\u672C\u5366\uFF1A" }), "\u7B2C ", result.original.number, " \u5366 ", result.original.name, " \u2014 ", result.original.judgment] }), result.changed !== undefined
                                        ? _jsxs("div", { children: [_jsx("strong", { children: "\u53D8\u5366\uFF1A" }), "\u7B2C ", result.changed.number, " \u5366 ", result.changed.name, " \u2014 ", result.changed.judgment] })
                                        : _jsxs("div", { children: [_jsx("strong", { children: "\u53D8\u5366\uFF1A" }), "\u516D\u723B\u4E0D\u52A8"] }), _jsx("hr", { style: { border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' } }), _jsx("div", { style: { whiteSpace: 'pre-wrap' }, children: result.llmText })] }))
                            : null, _jsxs("div", { children: [_jsx("button", { type: "button", style: primaryButtonStyle, disabled: !canStart || loading, onClick: () => { void start(); }, children: loading ? '测算中…' : '开始测算' }), _jsx("button", { type: "button", style: closeButtonStyle, onClick: close, children: "\u5173\u95ED" })] })] }) })] }));
}
//# sourceMappingURL=DivinationButton.js.map