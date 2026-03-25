> [!CAUTION]
> Fork 自 https://github.com/hamster1963/nezha-dash-v1

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

### 示例

```html
<script>
window.CustomLogo = "/logo.png";
window.CustomDesc = "My Monitor";
window.ShowTrafficBar = true;
window.MergeDetailAndNetwork = true;
window.HidePlanInfo = true;
window.DisableAnimatedMan = true;
</script>
```
