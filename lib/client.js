window.__ModuleLoader__.load({
	id: "dsh-yi",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/shared.ts
		function lineMeta(value) {
			switch (value) {
				case 6: return {
					value,
					label: "老阴",
					yin: true,
					changing: true
				};
				case 7: return {
					value,
					label: "少阳",
					yin: false,
					changing: false
				};
				case 8: return {
					value,
					label: "少阴",
					yin: true,
					changing: false
				};
				case 9: return {
					value,
					label: "老阳",
					yin: false,
					changing: true
				};
				default: throw new Error(`invalid line value: ${String(value)}`);
			}
		}
		//#endregion
		//#region src/client/DivinationButton.tsx
		/**
		* ☯ session-header button and the divination modal.
		* Uses plain React state and inline styles so the plugin does not need
		* ui-primitives, locale, or CSS-module tooling for the first version.
		*/
		const TOPICS = [
			{
				value: "career",
				label: "事业"
			},
			{
				value: "family",
				label: "家庭"
			},
			{
				value: "project",
				label: "当前项目"
			},
			{
				value: "custom",
				label: "自定义"
			}
		];
		const EMPTY_TOSSES = [
			null,
			null,
			null,
			null,
			null,
			null
		];
		const overlayStyle = {
			position: "fixed",
			inset: 0,
			background: "rgba(0, 0, 0, 0.45)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1e3
		};
		const panelStyle = {
			background: "#fff",
			color: "#222",
			borderRadius: 14,
			padding: 24,
			maxWidth: 580,
			width: "92%",
			maxHeight: "82vh",
			overflow: "auto",
			boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
			fontFamily: "system-ui, sans-serif"
		};
		const titleStyle = {
			margin: "0 0 16px",
			fontSize: 20,
			fontWeight: 700
		};
		const labelStyle = {
			display: "block",
			margin: "14px 0 6px",
			fontSize: 13,
			fontWeight: 600,
			color: "#555"
		};
		const chipRowStyle = {
			display: "flex",
			gap: 8,
			flexWrap: "wrap"
		};
		const chipStyle = (active) => ({
			border: active ? "2px solid #2563eb" : "1px solid #d0d0d0",
			background: active ? "#eff6ff" : "#fff",
			color: active ? "#1e40af" : "#333",
			borderRadius: 999,
			padding: "6px 14px",
			cursor: "pointer",
			fontSize: 14
		});
		const inputStyle = {
			width: "100%",
			boxSizing: "border-box",
			border: "1px solid #d0d0d0",
			borderRadius: 8,
			padding: "8px 10px",
			fontSize: 14,
			marginTop: 6
		};
		const lineRowStyle = {
			display: "flex",
			alignItems: "center",
			gap: 10,
			marginTop: 8
		};
		const tossButtonStyle = {
			border: "1px solid #c7c7c7",
			background: "#f8f8f8",
			borderRadius: 8,
			padding: "6px 10px",
			cursor: "pointer",
			fontSize: 13
		};
		const primaryButtonStyle = {
			border: "none",
			background: "#2563eb",
			color: "#fff",
			borderRadius: 10,
			padding: "10px 18px",
			fontSize: 15,
			fontWeight: 600,
			cursor: "pointer",
			marginTop: 18
		};
		const closeButtonStyle = {
			border: "1px solid #d0d0d0",
			background: "#fff",
			color: "#333",
			borderRadius: 10,
			padding: "10px 16px",
			fontSize: 14,
			cursor: "pointer",
			marginTop: 18,
			marginLeft: 8
		};
		const resultBoxStyle = {
			border: "1px solid #e5e7eb",
			borderRadius: 10,
			background: "#fafafa",
			padding: "14px 16px",
			marginTop: 16,
			whiteSpace: "pre-wrap"
		};
		function randomToss() {
			const coins = [
				0,
				1,
				2
			].map(() => Math.random() < .5 ? "yang" : "yin");
			return {
				line: lineMeta(6 + coins.filter((coin) => coin === "yang").length),
				coins
			};
		}
		function manualReady(tosses) {
			return tosses.every((toss) => toss !== null);
		}
		function lineSymbol(line) {
			return line.yin ? "- -" : "—";
		}
		function coinFace(coin) {
			return coin === "yang" ? "○" : "●";
		}
		/**
		* The ☯ header action. Renders a small button and, when clicked, a modal that
		* guides the user through topic/method selection and shows the LLM reading.
		*/
		function DivinationButton({ runDivination }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [topic, setTopic] = (0, react.useState)("career");
			const [customText, setCustomText] = (0, react.useState)("");
			const [method, setMethod] = (0, react.useState)("auto");
			const [manualTosses, setManualTosses] = (0, react.useState)(EMPTY_TOSSES);
			const [loading, setLoading] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [result, setResult] = (0, react.useState)(null);
			const reset = () => {
				setTopic("career");
				setCustomText("");
				setMethod("auto");
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
				setManualTosses((current) => {
					const next = [...current];
					next[index] = randomToss();
					return next;
				});
			};
			const start = async () => {
				const request = method === "auto" ? {
					topic,
					...topic === "custom" ? { customText: customText.trim() } : {},
					method
				} : {
					topic,
					...topic === "custom" ? { customText: customText.trim() } : {},
					method,
					lines: manualTosses.map((toss) => toss.line.value)
				};
				setLoading(true);
				setError(null);
				setResult(null);
				try {
					setResult(await runDivination(request));
				} catch (caught) {
					setError(caught instanceof Error ? caught.message : String(caught));
				} finally {
					setLoading(false);
				}
			};
			const trigger = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "周易测算",
				title: "周易测算",
				onClick: () => {
					setOpen(true);
				},
				style: {
					border: "1px solid transparent",
					background: "transparent",
					borderRadius: 8,
					padding: "2px 6px",
					cursor: "pointer",
					fontSize: 16,
					lineHeight: 1
				},
				children: "☯"
			});
			if (!open) return trigger;
			const canStart = method === "auto" || manualReady(manualTosses);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [trigger, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: overlayStyle,
				onClick: (event) => {
					if (event.target === event.currentTarget) close();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: panelStyle,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": "周易测算",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: titleStyle,
							children: "☯ 周易测算"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: labelStyle,
							children: "想测什么？"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: chipRowStyle,
							children: TOPICS.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: chipStyle(topic === item.value),
								onClick: () => {
									setTopic(item.value);
									setResult(null);
								},
								children: item.label
							}, item.value))
						}),
						topic === "custom" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							style: inputStyle,
							value: customText,
							placeholder: "输入你想测算的事情",
							onChange: (event) => {
								setCustomText(event.target.value);
								setResult(null);
							}
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: labelStyle,
							children: "起卦方式"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: chipRowStyle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: chipStyle(method === "auto"),
								onClick: () => {
									setMethod("auto");
									setResult(null);
								},
								children: "一键测算"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: chipStyle(method === "manual"),
								onClick: () => {
									setMethod("manual");
									setResult(null);
								},
								children: "手动投掷三枚硬币"
							})]
						}),
						method === "manual" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: labelStyle,
							children: "依次掷出六爻（从下到上）"
						}), manualTosses.map((toss, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: lineRowStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									style: {
										width: 64,
										fontSize: 13,
										color: "#555"
									},
									children: [
										"第 ",
										index + 1,
										" 爻"
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									style: tossButtonStyle,
									onClick: () => tossLine(index),
									children: toss === null ? "掷币" : "重掷"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 18,
										letterSpacing: 4,
										color: toss === null ? "#bbb" : "#111",
										minWidth: 64
									},
									children: toss === null ? "○ ○ ○" : toss.coins.map(coinFace).join(" ")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 14,
										color: toss === null ? "#aaa" : "#111"
									},
									children: toss === null ? "尚未掷出" : `${toss.line.label}（${toss.line.value}） ${lineSymbol(toss.line)}`
								})
							]
						}, index))] }) : null,
						error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								...resultBoxStyle,
								color: "#b91c1c",
								borderColor: "#fecaca"
							},
							children: error
						}) : null,
						result !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: resultBoxStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "测问：" }), result.question] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "六爻：" }), result.lines.map((line, index) => `${index + 1}${line.label} ${lineSymbol(line)}`).join("  ")] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "本卦：" }),
									"第 ",
									result.original.number,
									" 卦 ",
									result.original.name,
									" — ",
									result.original.judgment
								] }),
								result.changed !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "变卦：" }),
									"第 ",
									result.changed.number,
									" 卦 ",
									result.changed.name,
									" — ",
									result.changed.judgment
								] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "变卦：" }), "六爻不动"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("hr", { style: {
									border: "none",
									borderTop: "1px solid #e5e7eb",
									margin: "12px 0"
								} }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: { whiteSpace: "pre-wrap" },
									children: result.llmText
								})
							]
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: primaryButtonStyle,
							disabled: !canStart || loading,
							onClick: () => {
								start();
							},
							children: loading ? "测算中…" : "开始测算"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: closeButtonStyle,
							onClick: close,
							children: "关闭"
						})] })
					]
				})
			})] });
		}
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"slots",
			"remote",
			"remote.commands",
			"locale"
		];
		function apply(ctx) {
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "dsh-yi",
				order: 10,
				inject: (sessionId) => ({ runDivination: async (request) => {
					const execution = await ctx.remote.commands.execute(sessionId, `/divinate ${JSON.stringify({
						...request,
						language: ctx.locale.getLocale().active
					})}`);
					if (!execution.ok) throw new Error(execution.error.message);
					const commandExecution = execution.value;
					if (commandExecution === void 0) throw new Error("/divinate 命令不存在，请确认 dsh-yi host 插件已加载");
					if (commandExecution.result.kind === "error") throw new Error(commandExecution.result.text);
					const text = commandExecution.result.text;
					if (text === void 0 || text.length === 0) throw new Error("测算结果为空");
					return JSON.parse(text);
				} })
			}, DivinationButton));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map