# nezha-dash-v1-komari

基于 [Akizon77/nezha-dash-v1](https://github.com/Akizon77/nezha-dash-v1) 二次修改的 Komari 监控面板主题。

原始项目 Fork 自 [hamster1963/nezha-dash-v1](https://github.com/hamster1963/nezha-dash-v1)。

## 主要改动

- 流量进度条组件（TrafficInfo），支持 sum/max/min/up/down 计费模式
- `deriveCycleLabel` 支持 2 年、3 年等多年周期显示
- 概览卡片标题前增加 lucide-react 图标
- 详情页与网络页可合并为一页
- 套餐标签可隐藏
- 移除未实现的 ServiceTracker 按钮
- `parsePublicNote` 静默 JSON 解析错误
- 修复 deprecated `apple-mobile-web-app-capable` meta 标签
- 支持通过标签过滤"已出"机器（不参与统计与地图点亮，可在"已出"分组中查看）
- 网络监控卡片延迟/丢包/波动指标可按数值着色（绿/黄/红）
- 波动值采用 Logistic 归一化算法（P95-P50 稳健极差，1小时窗口），结果归一化至 [0, 1)

## 编译部署

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm（随 Node.js 一起安装）

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/telly3e/nezha-dash-v1-komari.git
cd nezha-dash-v1-komari

# 2. 安装依赖
npm install

# 3. 编译
npm run build
```

编译产物在 `dist/` 目录下，将其部署到 Komari 即可。

```

## 自定义代码设置

在 Komari 后台的自定义代码中添加 `<script>` 标签来配置以下选项。

### 外观设置

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.CustomBackgroundImage` | string | `""` | 桌面端背景图片 URL |
| `window.CustomMobileBackgroundImage` | string | `""` | 移动端背景图片 URL，留空跟随桌面端 |
| `window.CustomLogo` | string | `"/favicon.ico"` | 站点 Logo 图片 URL |
| `window.CustomDesc` | string | `"Komari Monitor"` | 站点名称右侧的描述文字 |
| `window.CustomIllustration` | string | `"/animated-man.webp"` | 首页右侧自定义插图 URL |
| `window.ForceTheme` | string | `""` | 强制主题，可选 `"dark"` / `"light"`，留空跟随系统 |
| `window.CustomLinks` | string | `""` | 自定义导航链接，JSON 格式：`[{"link":"https://example.com","name":"示例"}]` |

### 功能开关

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.ForceShowServices` | boolean | `false` | 强制显示服务监控面板 |
| `window.ForceShowMap` | boolean | `false` | 强制显示全球地图 |
| `window.ForceCardInline` | boolean | `false` | 强制使用行内卡片布局 |
| `window.DisableAnimatedMan` | boolean | `false` | 隐藏首页动画插图 |
| `window.ForceUseSvgFlag` | boolean | `false` | 使用 SVG 国旗替代 Emoji |
| `window.ForcePeakCutEnabled` | boolean | `false` | 网络图表自动削峰 |

### 详情页设置

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.MergeDetailAndNetwork` | boolean | `false` | 合并详情页和网络页为一页 |
| `window.NetworkFirst` | boolean | `false` | 合并时网络图表在上、详情在下 |

### 卡片显示设置

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.FixedTopServerName` | boolean | `false` | 服务器名称固定在卡片顶部 |
| `window.ShowNetTransfer` | boolean | `false` | 显示上传/下载总流量 |
| `window.ShowTrafficBar` | boolean | `false` | 显示流量使用进度条（需配置流量限额） |
| `window.HidePlanInfo` | boolean | `false` | 隐藏套餐标签（IPv4/IPv6/带宽等） |

### 已出机器过滤

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.ExcludeSoldServers` | boolean | `false` | 启用后，带 `已出` 标签的机器不参与在线/离线统计和地图点亮，在"全部"及其他分组中也不显示；切换到"已出"分组时仍可正常查看 |

### 网络监控着色

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `window.ColorizeMonitorMetrics` | boolean | `false` | 对延迟、丢包率、波动值按阈值着色（绿/黄/红） |

着色阈值：

| 指标 | 绿色（优） | 黄色（一般） | 红色（差） |
|------|-----------|-------------|-----------|
| 延迟 | < 100 ms | 100 – 200 ms | > 200 ms |
| 丢包率 | < 1% | 1% – 5% | > 5% |
| 波动（Logistic） | < 0.25 | 0.25 – 0.50 | > 0.50 |

波动值说明：取最近 60 个采样点（约 1 小时），计算 P95−P50 后经 Logistic 归一化（`k=30ms`），结果在 [0, 1)，`0.50` 对应尾部延迟展宽 30 ms。

### 示例

```html
<script>
window.CustomLogo = "/logo.png";
window.CustomDesc = "My Monitor";
window.ShowTrafficBar = true;
window.MergeDetailAndNetwork = true;
window.HidePlanInfo = true;
window.DisableAnimatedMan = true;
window.ExcludeSoldServers = true;
window.ColorizeMonitorMetrics = true;
</script>
```
