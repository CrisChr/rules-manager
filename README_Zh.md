# Rules Manager

![Visual Studio Code](https://img.shields.io/badge/VS%20Code-^1.82.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)

[中文](./README_Zh.md)
[English](./README.md)

[![Buy me a coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=ponyred&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00)](https://www.buymeacoffee.com/ponyred)

[![Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.png?post_id=1013301&theme=light&t=1757140846606)](https://www.producthunt.com/products/rules-manager?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-rules&#0045;manager)

🚀 **一个强大的 VS Code 扩展，用于统一管理多种 AI 编程工具的规则文件**

支持 Cursor、Cline、VS Code Copilot、Windsurf 等主流 AI 编程工具的规则管理，提供云端同步、标签分类、一键添加到本地等功能。

[参考用例](/EXAMPLES_Zh.md)

## ✨ 核心特性

### 🔄 **规则远程同步**
- **VS Code Settings Sync 集成**：通过 VS Code 账号自动同步规则
- **跨设备无缝体验**：在任何设备上登录 VS Code 账号即可获取你的规则库
- **实时同步**：规则修改后自动同步到云端，无需手动操作

### 🎯 **多平台规则支持**
- **Cursor 规则**：管理 `.cursor/rules/` 下的规则文件
- **Cline 规则**：管理 `.clinerules/` 下的规则文件
- **VS Code Copilot 规则**：管理 `.github/` 下的规则文件
- **Windsurf 规则**：管理 `.windsurf/rules/` 下的规则文件

### 📄 **多格式文件支持**
- **Markdown** (`.md`) - 传统文档格式
- **YAML** (`.yaml`, `.yml`) - 配置文件格式
- **JSON** (`.json`) - 结构化数据格式
- **XML** (`.xml`) - 标记语言格式
- **文本** (`.txt`) - 纯文本格式
- **用户自定义** - 支持任意文件扩展名

### 📋 **智能规则管理**
- **可视化面板**：直观的 Web 界面管理所有规则
- **智能分类**：自动识别规则类型并分类显示
- **快速搜索**：支持按名称、标签、来源快速查找规则
- **一键添加**：将云端规则一键添加到当前项目
- **文件名验证**：智能验证文件名长度和字符合法性
- **实时监听**：自动检测文件变化并刷新规则列表

### 🏷️ **标签系统**
- **规则标记**：为规则添加最多 5 个自定义标签
- **标签搜索**：通过标签快速筛选相关规则
- **来源标识**：自动标记规则的来源平台

## 🚀 快速开始

### 安装扩展
1. 在 VS Code 扩展市场搜索 "Rules Manager"
2. 点击安装并重新加载 VS Code

### 基本使用
1. **打开规则管理面板**
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
   - 搜索并执行 `Rules Manager: Open Rules Manager Panel`

2. **创建新规则**
   - 在面板中点击 "新增规则" 按钮
   - 选择规则类型和文件格式（支持多种格式）
   - 输入文件名（自动验证长度和字符合法性）
   - 开始编写你的规则内容

3. **保存规则到云端**
   - 点击项目规则旁的 "保存到云端" 按钮
   - 添加标签便于分类管理
   - 规则将自动同步到云端

## 📖 详细功能

### 项目规则管理
- **自动检测**：自动扫描项目中的各类规则文件
- **快速编辑**：点击即可打开规则文件进行编辑
- **智能创建**：根据当前项目环境智能推荐规则类型

### 云端规则库
- **规则收藏**：将优秀的项目规则保存到远程库
- **跨项目复用**：在任何项目中快速应用规则
- **版本管理**：自动记录规则的创建和修改时间

### 同步功能
- **设置同步**：基于 VS Code Settings Sync 的可靠同步机制
- **自动备份**：规则数据安全存储在 Microsoft 云端
- **多设备支持**：Windows、Mac、Linux 全平台支持

## 🛠️ 支持的规则类型

| 平台 | 文件位置 | 支持格式 | 说明 |
|------|----------|----------|------|
| **Cursor** | `.cursor/rules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Cursor AI 编程助手规则 |
| **Cline** | `.clinerules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Cline AI 助手规则 |
| **VS Code Copilot** | `.github/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | GitHub Copilot 规则 |
| **Windsurf** | `.windsurf/rules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Windsurf AI 规则 |

### 📝 文件格式特性
- **灵活格式选择**：用户可自由选择任意文件格式
- **智能模板**：根据文件格式自动生成适当的初始内容
- **格式验证**：创建时自动验证文件名合法性（长度≤50字符，无非法字符）
- **实时监听**：支持所有格式的文件变化检测

## 🔧 配置说明

### VS Code Settings Sync 设置
1. **启用同步**
   - 按 `Cmd+Shift+P` 打开命令面板
   - 搜索 "Settings Sync: Turn On"
   - 选择要同步的内容（确保包含 Settings）

2. **登录账号**
   - 支持 Microsoft 账号和 GitHub 账号
   - 选择你偏好的登录方式

3. **验证同步**
   - 在设置中搜索 `rules-manager.globalRules`
   - 查看规则数据是否正确同步

## 📋 使用场景

### 个人开发者
- **规则库建设**：积累和管理个人的 AI 提示词库
- **项目快速启动**：新项目快速应用成熟的规则配置
- **跨设备开发**：在不同设备间保持一致的开发体验

### 团队协作
- **规则标准化**：团队成员共享统一的 AI 规则标准
- **最佳实践分享**：通过规则分享团队最佳实践
- **新人快速上手**：新团队成员快速获取项目规则配置

### 企业应用
- **规则治理**：统一管理企业级 AI 编程规则
- **合规要求**：确保 AI 辅助编程符合企业规范
- **效率提升**：标准化的规则配置提升开发效率


## 🚀 开发计划

- [ ] **规则模板市场**：内置常用规则模板
- [ ] **团队协作功能**：支持团队规则库共享
- [ ] **规则版本控制**：规则变更历史和回滚
- [ ] **智能推荐**：基于项目类型推荐适合的规则
- [ ] **批量操作**：支持规则的批量导入导出

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境设置
```bash
# 克隆仓库
git clone <repository-url>
cd rules-manager

# 安装依赖
npm install

# 编译项目
npm run compile

# 启动开发模式
npm run watch
```

### 测试扩展
1. 在 VS Code 中打开项目文件夹
2. 按 `F5` 启动扩展开发主机
3. 在新窗口中测试扩展功能

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**让 AI 编程更高效，让规则管理更简单！** 🎉
