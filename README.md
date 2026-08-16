# ☯ dsh-yi

[English](README.en.md) | 中文

一个给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 用的周易测算插件。在 Web UI 会话头部增加一个 ☯ 入口，支持一键起卦或手动投掷三枚硬币，得到本卦/变卦后交给当前会话连接的 LLM 解读。

## 功能

- 会话头部 ☯ 按钮，打开测算弹窗
- 测算主题：事业 / 家庭 / 当前项目 / 自定义
- 起卦方式：
  - 一键测算：自动生成六爻
  - 手动投掷三枚硬币：每爻显示 `●` / `○` 硬币结果，并同步显示 `—` / `- -` 爻画
- 三枚硬币规则：`○○○` = 老阳（9）、`○○●` 等 = 少阴（8）、`○●●` 等 = 少阳（7）、`●●●` = 老阴（6）
- 内置 64 卦 King Wen 数据（卦名 + 卦辞）
- 自动计算本卦；有老阴/老阳时按变爻规则计算变卦
- 根据当前 DSH 工作语言（中文 / English）自动调整 LLM 回复语言
- 将测问内容、六爻、本卦、变卦发送给当前会话使用的 LLM，返回解读

## 安装

### 从 GitHub 安装（推荐 HTTPS，无需 SSH key）

```bash
dsh plugin --profile web add https://github.com/Sanchaji/dsh-yi.git
```

也可以使用 `git+https` 形式：

```bash
dsh plugin --profile web add git+https://github.com/Sanchaji/dsh-yi.git
```

> 注意：`github:Sanchaji/dsh-yi` 这种简写会走 SSH，需要本机配置 GitHub SSH key；没有 SSH key 时请用上面的 HTTPS 地址。
>
> 仓库里已经包含构建好的 `lib/`，所以 git 安装后可以直接使用，不需要本地再跑构建。

### 从 GitHub Release tgz 安装

```bash
dsh plugin --profile web add https://github.com/Sanchaji/dsh-yi/releases/download/v0.1.0/dsh-yi-0.1.0.tgz
```

### 从本地目录安装

```bash
dsh plugin --profile web add ./dsh-yi
```

### 从 npm 安装

```bash
dsh plugin --profile web add dsh-yi
```

安装后启动或刷新 Web UI，进入任意会话，标题旁边会出现 ☯。

## 使用

1. 点击会话头部的 ☯
2. 选择测算主题
3. 选择起卦方式
4. 点击“开始测算”
5. 弹窗中会显示六爻、本卦、变卦和 LLM 解读

也可以直接输入命令：

```text
/divinate {"topic":"career","method":"auto"}
/divinate {"topic":"custom","customText":"这个月跳槽合适吗","method":"manual","lines":[6,7,8,9,7,8]}
```

## 配置

插件默认配置如下，可在 `cordis.patch.yml` 或 profile 的 patch 层覆盖：

```yaml
- id: dsh-yi
  name: 'dsh-yi'
  config:
    maxTokens: 2000
    temperature: 0.8
    timeoutMs: 30000
```

可选字段：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `provider` | string | 无 | 指定 LLM provider；与 `model` 同时提供时优先于会话当前路由 |
| `model` | string | 无 | 指定 LLM model；与 `provider` 同时提供 |
| `maxTokens` | number | `2000` | LLM 输出上限 |
| `temperature` | number | `0.8` | 采样温度 |
| `timeoutMs` | number | `30000` | LLM 调用超时 |

如果没有配置 `provider` / `model`，插件会读取当前会话最近一次 `request/header` 里的 provider/model。全新会话还没发过消息时，建议先发一条消息，或在配置里显式指定。

## 从源码构建

```bash
DSH_CHECKOUT=/path/to/deepseek-harness bash scripts/build.sh
npm run build:client
```

构建产物会输出到 `lib/`。

## 项目结构

```
src/
  shared.ts                 # 前后端共享类型和爻辞工具
  iching/data.ts            # 64 卦 King Wen 数据
  iching/engine.ts          # 起卦、变卦、卦象查询
  index.ts                  # Host：/divinate 命令 + LLM 解读
  client/index.ts           # Client：☯ 头部入口注册
  client/DivinationButton.tsx  # ☯ 按钮 + 测算弹窗
```

## License

[BSD-3-Clause](LICENSE)
