# ☯ dsh-yi

English | [中文](README.md)

An I Ching fortune-telling plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It adds a ☯ entry to the Web UI session header, supports one-click casting or manually tossing three coins, and asks the currently connected LLM to interpret the resulting hexagram.

## Features

- ☯ button in the session header
- Topics: career / family / current project / custom
- Casting methods:
  - One-click: auto-generate six lines
  - Manual coin toss: shows `●` / `○` for each coin plus `—` / `- -` line symbols
- Built-in King Wen sequence data for all 64 hexagrams
- Automatic original hexagram lookup and changed hexagram calculation
- Replies in the current DSH UI language (Chinese or English)
- Sends the question, six lines, original hexagram, and changed hexagram to the LLM

## Install

From GitHub:

```bash
dsh plugin --profile web add github:<your-github-username>/dsh-yi
```

From a local directory:

```bash
dsh plugin --profile web add ./dsh-yi
```

From npm (if published):

```bash
dsh plugin --profile web add dsh-yi
```

After installation, refresh the Web UI and open a session. You will see ☯ next to the session title.

## Usage

Click ☯, choose a topic and casting method, then start. You can also use the command directly:

```text
/divinate {"topic":"career","method":"auto"}
/divinate {"topic":"custom","customText":"Should I change jobs this month?","method":"manual","lines":[6,7,8,9,7,8]}
```

## Configuration

Optional config fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `provider` | string | — | Explicit LLM provider; used together with `model` |
| `model` | string | — | Explicit LLM model; used together with `provider` |
| `maxTokens` | number | `2000` | LLM output token limit |
| `temperature` | number | `0.8` | Sampling temperature |
| `timeoutMs` | number | `30000` | LLM call timeout |

If `provider` / `model` are not set, the plugin reads the route from the latest `request/header` of the current session.

## Build from source

```bash
DSH_CHECKOUT=/path/to/deepseek-harness bash scripts/build.sh
npm run build:client
```

Build output goes to `lib/`.

## License

[BSD-3-Clause](LICENSE)
