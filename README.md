---

# Rules Manager

![Visual Studio Code](https://img.shields.io/badge/VS%20Code-^1.82.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)

[中文](./README_Zh.md)
[English](./README.md)

[![Buy me a coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=ponyred&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00)](https://www.buymeacoffee.com/ponyred)

[![Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.png?post_id=1013301&theme=light&t=1757140846606)](https://www.producthunt.com/products/rules-manager?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-rules&#0045;manager)

🚀 **A powerful VS Code extension for unified management of rule files for various AI programming tools**

Supports rule management for mainstream AI programming tools like Cursor, Cline, VS Code Copilot, and Windsurf, providing features such as cloud sync, tag classification, and one-click add to local projects.

[Examples](/EXAMPLES.md)

## ✨ Core Features

### 🔄 **Remote Rule Sync**
- **VS Code Settings Sync Integration**: Automatically sync rules via your VS Code account.
- **Seamless Cross-Device Experience**: Access your rule library by logging into your VS Code account on any device.
- **Real-time Sync**: Rule modifications are automatically synced to the cloud, no manual action required.

### 🎯 **Multi-Platform Rule Support**
- **Cursor Rules**: Manage rule files under `.cursor/rules/`.
- **Cline Rules**: Manage rule files under `.clinerules/`.
- **VS Code Copilot Rules**: Manage rule files under `.github/`.
- **Windsurf Rules**: Manage rule files under `.windsurf/rules/`.

### 📄 **Multi-Format File Support**
- **Markdown** (`.md`) - Traditional documentation format.
- **YAML** (`.yaml`, `.yml`) - Configuration file format.
- **JSON** (`.json`) - Structured data format.
- **XML** (`.xml`) - Markup language format.
- **Text** (`.txt`) - Plain text format.
- **User-Defined** - Supports any file extension.

### 📋 **Intelligent Rule Management**
- **Visual Panel**: Manage all rules through an intuitive web interface.
- **Smart Categorization**: Automatically identifies rule types and displays them in categories.
- **Quick Search**: Supports fast searching by name, tag, and source.
- **One-Click Add**: Add cloud rules to the current project with a single click.
- **Filename Validation**: Intelligently validates filename length and character legality.
- **Real-time Monitoring**: Automatically detects file changes and refreshes the rule list.

### 🏷️ **Tagging System**
- **Rule Tagging**: Add up to 5 custom tags to each rule.
- **Tag-Based Search**: Quickly filter relevant rules using tags.
- **Source Identification**: Automatically marks the source platform of a rule.

## 🚀 Quick Start

### Install Extension
1. Search for "Rules Manager" in the VS Code Marketplace.
2. Click "Install" and reload VS Code.

### Basic Usage
1. **Open the Rules Manager Panel**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
   - Search for and execute `Rules Manager: Open Rules Manager Panel`.

2. **Create a New Rule**
   - Click the "New Rule" button in the panel.
   - Select the rule type and file format (multiple formats supported).
   - Enter a filename (length and character legality are automatically validated).
   - Start writing your rule content.

3. **Save Rule to the Cloud**
   - Click the "Save to Cloud" button next to a project rule.
   - Add tags for better organization.
   - The rule will be automatically synced to the cloud.

## 📖 Detailed Features

### Project Rule Management
- **Auto-Detection**: Automatically scans for various rule files within the project.
- **Quick Edit**: Click to open and edit a rule file directly.
- **Smart Creation**: Intelligently recommends rule types based on the current project environment.

### Cloud Rule Library
- **Rule Collection**: Save excellent project rules to the remote library.
- **Cross-Project Reusability**: Quickly apply rules in any project.
- **Version Management**: Automatically records creation and modification times for rules.

### Sync Functionality
- **Settings Sync**: Reliable synchronization based on VS Code Settings Sync.
- **Automatic Backup**: Rule data is securely stored in the Microsoft cloud.
- **Multi-Device Support**: Full support for Windows, Mac, and Linux platforms.

## 🛠️ Supported Rule Types

| Platform | File Location | Supported Formats | Description |
|---|---|---|---|
| **Cursor** | `.cursor/rules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Rules for the Cursor AI programming assistant. |
| **Cline** | `.clinerules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Rules for the Cline AI assistant. |
| **VS Code Copilot** | `.github/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Rules for GitHub Copilot. |
| **Windsurf** | `.windsurf/rules/` | `.md`, `.yaml`, `.yml`, `.json`, `.txt`, `.xml` | Rules for Windsurf AI. |

### 📝 File Format Features
- **Flexible Format Choice**: Users can freely choose any file format.
- **Smart Templates**: Automatically generates appropriate initial content based on the file format.
- **Format Validation**: Automatically validates filename legality upon creation (≤50 characters, no illegal characters).
- **Real-time Monitoring**: Supports file change detection for all formats.

## 🔧 Configuration

### VS Code Settings Sync Setup
1. **Enable Sync**
   - Press `Cmd+Shift+P` to open the Command Palette.
   - Search for "Settings Sync: Turn On".
   - Select the content you want to sync (ensure "Settings" is included).

2. **Log In to Your Account**
   - Supports both Microsoft and GitHub accounts.
   - Choose your preferred login method.

3. **Verify Sync**
   - Search for `rules-manager.globalRules` in the settings.
   - Check if the rule data is synced correctly.

## 📋 Use Cases

### For Individual Developers
- **Build a Rule Library**: Accumulate and manage a personal library of AI prompts.
- **Quick Project Kickstarts**: Quickly apply mature rule configurations to new projects.
- **Cross-Device Development**: Maintain a consistent development experience across different devices.

### For Team Collaboration
- **Standardize Rules**: Share a unified standard of AI rules among team members.
- **Share Best Practices**: Share team best practices through rules.
- **Onboard New Members Quickly**: New team members can quickly obtain project rule configurations.

### For Enterprise Use
- **Rule Governance**: Centrally manage enterprise-level AI programming rules.
- **Compliance Requirements**: Ensure AI-assisted programming complies with corporate standards.
- **Increase Efficiency**: Standardized rule configurations improve development efficiency.

## 🚀 Development Roadmap

- [ ] **Rule Template Marketplace**: Built-in templates for common rules.
- [ ] **Team Collaboration Features**: Support for shared team rule libraries.
- [ ] **Rule Version Control**: History and rollback for rule changes.
- [ ] **Intelligent Recommendations**: Recommend suitable rules based on the project type.
- [ ] **Bulk Operations**: Support for batch import and export of rules.

## 🤝 Contribution Guide

Issues and Pull Requests are welcome!

### Development Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd rules-manager

# Install dependencies
npm install

# Compile the project
npm run compile

# Start in watch mode
npm run watch
```

### Testing the Extension
1. Open the project folder in VS Code.
2. Press `F5` to start the Extension Development Host.
3. Test the extension's features in the new window.

## 📄 License

MIT License - See the [LICENSE](LICENSE) file for details.

---

**Make AI programming more efficient, and rule management simpler!** 🎉
