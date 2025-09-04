import * as vscode from 'vscode';
import { WebviewMessage, RuleFileManager, EditorType } from './types'; // 导入 EditorType, GlobalRule
import { GlobalRuleManager } from './globalRuleManager';
import { getWebviewContent } from './webview'; // 导入 getWebviewContent 函数

export class RuleManagementPanelImpl {
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private readonly disposables: vscode.Disposable[] = [];
    private readonly fileManager: RuleFileManager;
    private readonly globalRuleManager: GlobalRuleManager;
    private currentEditorType: EditorType; // 新增属性来存储当前编辑器类型

    constructor(extensionUri: vscode.Uri, fileManager: RuleFileManager, globalRuleManager: GlobalRuleManager) {
        this.extensionUri = extensionUri;
        this.fileManager = fileManager;
        this.globalRuleManager = globalRuleManager;
        this.currentEditorType = this.detectEditorType(); // 检测当前编辑器类型
        this.panel = this.createWebviewPanel();
        this.disposables.push(this.panel);
        this.setWebviewMessageListener(); // 添加消息监听器
    }

    private detectEditorType(): EditorType {
        const appName = vscode.env.appName.toLowerCase();
        if (appName.includes('cursor')) {
            return EditorType.Cursor;
        }
        // 假设如果 appName 包含 'code' 且不包含 'cursor'，则为 Cline 或 VSCode
        // 这里可以根据实际情况进一步细化判断逻辑
        if (appName.includes('code')) {
            // 如果有更明确的 Cline 标识，可以在这里添加
            return EditorType.Cline; // 暂时将 VS Code 也视为 Cline
        }
        // 默认返回 VSCodeCopilot
        return EditorType.VSCodeCopilot;
    }

    public show(): void {
        this.panel.reveal(vscode.ViewColumn.One);
        this.updateWebviewContent();
    }

    public reveal(): void {
        this.panel.reveal(vscode.ViewColumn.One);
    }

    public dispose(): void {
        this.panel.dispose();

        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    public postMessage(message: WebviewMessage): void {
        this.panel.webview.postMessage(message);
    }

    public onDidReceiveMessage(callback: (message: WebviewMessage) => void): void {
        const disposable = this.panel.webview.onDidReceiveMessage(callback);
        this.disposables.push(disposable);
    }

    public onDidDispose(callback: () => void): void {
        const disposable = this.panel.onDidDispose(callback);
        this.disposables.push(disposable);
    }

    private createWebviewPanel(): vscode.WebviewPanel {
        return vscode.window.createWebviewPanel(
            'rulesManage',
            '规则管理',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'webview')]
            }
        );
    }

    private async updateWebviewContent(): Promise<void> {
        this.panel.webview.html = getWebviewContent(this.panel.webview, this.extensionUri);
        // 在 Webview 加载后，发送当前编辑器类型
        this.postMessage({ command: 'setCurrentEditorType', editorType: this.currentEditorType });
    }

    private setWebviewMessageListener() {
        this.panel.webview.onDidReceiveMessage(
            async (message: WebviewMessage) => {
                switch (message.command) {
                    case 'getRules': {
                        console.log('收到 getRules 命令，开始获取规则列表');
                        const rules = await this.fileManager.listRules();
                        console.log('获取到的规则列表:', rules);
                        this.postMessage({ command: 'rulesList', rules: rules });
                        console.log('已发送 rulesList 消息到前端');
                        return;
                    }
                    case 'createRule': {
                        const selectedEditorType = message.editorType || this.currentEditorType; // 使用 Webview 传递的 editorType，如果未传递则使用当前检测到的
                        const selectedFileFormat = message.fileFormat; // 获取选择的文件格式

                        // 文件名验证函数
                        const validateFileName = (value: string): string | undefined => {
                            if (!value || value.trim().length === 0) {
                                return '文件名不能为空';
                            }

                            const trimmedValue = value.trim();

                            // 长度验证
                            if (trimmedValue.length > 50) {
                                return `文件名长度不能超过50个字符 (当前: ${trimmedValue.length})`;
                            }

                            // 非法字符验证 (Windows和Unix通用的非法字符)
                            const invalidChars = /[/\\:*?"<>|]/;
                            if (invalidChars.test(trimmedValue)) {
                                return '文件名不能包含以下字符: / \\ : * ? " < > |';
                            }

                            return undefined; // 验证通过
                        };

                        let ruleName = await vscode.window.showInputBox({
                            prompt: `请输入新规则的文件名 (例如: my-rule)`,
                            placeHolder: selectedEditorType === EditorType.Windsurf ? '.windsurfrules' : 'my-rule',
                            validateInput: validateFileName
                        });
                        if (ruleName) {
                            // 根据编辑器类型确定文件扩展名
                            if (selectedEditorType === EditorType.Windsurf) {
                                // Windsurf 规则文件统一命名为 .windsurfrules
                                ruleName = '.windsurfrules';
                            } else {
                                // 移除现有扩展名（如果有的话）
                                const nameWithoutExt = ruleName.replace(/\.[^/.]+$/, '');
                                // 使用用户选择的文件格式，如果没有选择则默认使用 .md
                                const fileExtension = selectedFileFormat || '.md';
                                ruleName = nameWithoutExt + fileExtension;
                            }

                            // 根据文件格式生成适当的初始内容
                            let initialContent = '';
                            const fileExtension = ruleName.substring(ruleName.lastIndexOf('.'));
                            switch (fileExtension) {
                                case '.md':
                                    initialContent = '# 新规则\n\n请在此处编写您的规则内容。';
                                    break;
                                case '.yaml':
                                case '.yml':
                                    initialContent = '# 新规则配置\nname: "新规则"\ndescription: "请在此处编写您的规则内容"\nrules:\n  - rule: "示例规则"';
                                    break;
                                case '.json':
                                    initialContent = '{\n  "name": "新规则",\n  "description": "请在此处编写您的规则内容",\n  "rules": [\n    {\n      "rule": "示例规则"\n    }\n  ]\n}';
                                    break;
                                case '.xml':
                                    initialContent = '<?xml version="1.0" encoding="UTF-8"?>\n<rule>\n  <name>新规则</name>\n  <description>请在此处编写您的规则内容</description>\n  <content>示例规则</content>\n</rule>';
                                    break;
                                case '.txt':
                                default:
                                    initialContent = '新规则\n\n请在此处编写您的规则内容。';
                                    break;
                            }

                            try {
                                await this.fileManager.createRule(ruleName, { content: initialContent, editorType: selectedEditorType });
                                vscode.window.showInformationMessage(`规则文件 ${ruleName} 创建成功！`);
                            } catch (error) {
                                vscode.window.showErrorMessage(error instanceof Error ? error.message : '创建规则文件失败。');
                            }
                        }
                        // 无论是否创建成功，都刷新规则列表（这样会隐藏加载指示器）
                        this.postMessage({ command: 'rulesList', rules: await this.fileManager.listRules() });
                        return;
                    }
                    case 'editRule':
                        if (message.ruleName && message.editorType) {
                            await this.fileManager.openRule(message.ruleName, message.editorType);
                        }
                        return;
                    case 'deleteRule': {
                        if (message.ruleName && message.editorType) {
                            const confirm = await vscode.window.showWarningMessage(`确定要删除规则文件 "${message.ruleName}" 吗？`, { modal: true }, '删除', '取消');
                            if (confirm === '删除') {
                                try {
                                    await this.fileManager.deleteRule(message.ruleName, message.editorType);
                                    vscode.window.showInformationMessage(`规则文件 ${message.ruleName} 删除成功！`);
                                    this.postMessage({ command: 'rulesList', rules: await this.fileManager.listRules() });
                                } catch (error) {
                                    vscode.window.showErrorMessage(error instanceof Error ? error.message : '删除规则文件失败。');
                                }
                            }
                        }
                        return;
                    }
                    case 'getGlobalRules':
                        this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                        return;
                    case 'saveRuleAsGlobal': {
                        if (message.ruleName && message.editorType) {
                            const content = await this.fileManager.getRuleContent(message.ruleName, message.editorType);
                            if (content !== undefined) {
                                const globalRuleName = await vscode.window.showInputBox({
                                    prompt: `请输入全局规则的名称 (默认为 ${message.ruleName})`,
                                    value: message.ruleName
                                });

                                // 检查原始规则名称是否已存在于全局规则中
                                const isExistingGlobalRule = this.globalRuleManager.getGlobalRuleByName(message.ruleName) !== undefined;

                                if (globalRuleName) { // 如果用户输入了名称（没有按Esc取消）
                                    const tagsInput = await vscode.window.showInputBox({
                                        prompt: '请输入标签，用逗号分隔 (最多5个)',
                                        placeHolder: '例如: web, frontend, react'
                                    });
                                    let tags: string[] | undefined;
                                    if (tagsInput) {
                                        tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '').slice(0, 5);
                                    }

                                    // 如果用户重命名了规则，并且旧的规则名称在全局规则中存在，则删除旧的全局规则
                                    if (globalRuleName !== message.ruleName) {
                                        const oldGlobalRule = this.globalRuleManager.getGlobalRuleByName(message.ruleName);
                                        if (oldGlobalRule) {
                                            await this.globalRuleManager.deleteGlobalRule(message.ruleName);
                                        }
                                    }

                                    await this.globalRuleManager.saveGlobalRule(globalRuleName, content, tags, message.editorType); // 传递 editorType
                                    vscode.window.showInformationMessage(`规则 "${globalRuleName}" 已保存为全局规则！`);
                                    this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                                } else { // 如果用户按 Esc 取消
                                    if (isExistingGlobalRule) {
                                        // 如果是已存在的全局规则，并且用户取消了，则删除它
                                        await this.globalRuleManager.deleteGlobalRule(message.ruleName);
                                        vscode.window.showInformationMessage(`全局规则 "${message.ruleName}" 已取消保存并删除。`);
                                        this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                                    }
                                }
                            } else {
                                vscode.window.showErrorMessage(`无法获取规则文件 "${message.ruleName}" 的内容。`);
                            }
                        }
                        return;
                    }
                    case 'deleteGlobalRule': {
                        if (message.ruleName) {
                            const confirm = await vscode.window.showWarningMessage(`确定要删除全局规则 "${message.ruleName}" 吗？`, { modal: true }, '删除', '取消');
                            if (confirm === '删除') {
                                await this.globalRuleManager.deleteGlobalRule(message.ruleName);
                                vscode.window.showInformationMessage(`全局规则 "${message.ruleName}" 删除成功！`);
                                this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                            }
                        }
                        return;
                    }
                    case 'addGlobalRuleToProject': {
                        if (message.ruleName) {
                            const globalRule = this.globalRuleManager.getGlobalRuleByName(message.ruleName);
                            if (globalRule) {
                                try {
                                    // 使用全局规则自己的 editorType，如果没有则使用当前检测到的类型作为 fallback
                                    const targetEditorType = globalRule.editorType || this.currentEditorType;
                                    await this.fileManager.addRuleFromContent(globalRule.name, globalRule.content, targetEditorType);
                                    vscode.window.showInformationMessage(`全局规则 "${globalRule.name}" 已添加到项目规则！`);
                                    this.postMessage({ command: 'rulesList', rules: await this.fileManager.listRules() });
                                } catch (error) {
                                    vscode.window.showErrorMessage(error instanceof Error ? error.message : '添加全局规则到项目失败。');
                                }
                            } else {
                                vscode.window.showErrorMessage(`未找到全局规则 "${message.ruleName}"。`);
                            }
                        }
                        return;
                    }
                    case 'searchGlobalRules': {
                        if (message.searchQuery !== undefined) {
                            const searchResults = this.globalRuleManager.searchGlobalRules(message.searchQuery, message.searchSource); // 传递 searchSource
                            this.postMessage({ command: 'globalRulesList', globalRules: searchResults });
                        }
                        return;
                    }
                    case 'webviewReady': {
                        console.log('收到 webview 准备就绪消息，发送初始数据');
                        // webview 准备好后，发送当前编辑器类型和规则列表
                        this.postMessage({ command: 'setCurrentEditorType', editorType: this.currentEditorType });
                        this.postMessage({ command: 'rulesList', rules: await this.fileManager.listRules() });
                        this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                        return;
                    }
                    case 'editGlobalRule': {
                        if (message.ruleName) {
                            const globalRule = this.globalRuleManager.getGlobalRuleByName(message.ruleName);
                            if (globalRule) {
                                const newContent = await vscode.window.showInputBox({
                                    prompt: `编辑全局规则 "${globalRule.name}" 的内容`,
                                    value: globalRule.content,
                                    ignoreFocusOut: true,
                                    placeHolder: '规则内容'
                                });
                                if (newContent !== undefined) {
                                    const tagsInput = await vscode.window.showInputBox({
                                        prompt: '请输入标签，用逗号分隔 (最多5个)',
                                        placeHolder: '例如: web, frontend, react',
                                        value: globalRule.tags ? globalRule.tags.join(', ') : '',
                                        ignoreFocusOut: true
                                    });
                                    let tags: string[] | undefined;
                                    if (tagsInput) {
                                        tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '').slice(0, 5);
                                    }
                                    await this.globalRuleManager.saveGlobalRule(globalRule.name, newContent, tags, globalRule.editorType); // 传递 editorType
                                    vscode.window.showInformationMessage(`全局规则 "${globalRule.name}" 更新成功！`);
                                    this.postMessage({ command: 'globalRulesList', globalRules: this.globalRuleManager.getGlobalRules() });
                                }
                            } else {
                                vscode.window.showErrorMessage(`未找到全局规则 "${message.ruleName}"。`);
                            }
                        }
                        return;
                    }
                }
            },
            undefined,
            this.disposables
        );
    }
}
