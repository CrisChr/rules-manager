import * as vscode from 'vscode';
import { RuleManagementPanelImpl } from './rules/ruleManagementPanel';
import { RuleFileManagerImpl } from './rules/ruleFileManager';
import { GlobalRuleManager } from './rules/globalRuleManager';
import * as path from 'path'; // 导入 path 模块
import { EditorType, RULE_FOLDER_MAP, SUPPORTED_RULE_EXTENSIONS } from './types'; // 导入 EditorType 和 RULE_FOLDER_MAP
import {I18n} from './i18n'

let ruleManagementPanel: RuleManagementPanelImpl | undefined;
let ruleFileManager: RuleFileManagerImpl;
let globalRuleManager: GlobalRuleManager;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "rules-manager" is now active!');

    const workspaceRoot = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;

    if (!workspaceRoot) {
        vscode.window.showErrorMessage('请先打开一个工作区文件夹以使用规则管理功能。');
        return;
    }

    ruleFileManager = new RuleFileManagerImpl(workspaceRoot);
    globalRuleManager = new GlobalRuleManager();
    I18n.init();

    // 定义刷新规则列表的函数
    const refreshRulesList = async () => {
        console.log('refreshRulesList 被调用');
        if (ruleManagementPanel && ruleFileManager) {
            console.log('规则管理面板存在，开始刷新');
            // 确保面板是可见和活跃的，这样才能正确接收消息
            ruleManagementPanel.reveal();
            // 保存面板引用，避免在 setTimeout 中出现 undefined 的情况
            const panel = ruleManagementPanel;
            // 添加小延迟确保面板完全激活后再发送消息
            setTimeout(async () => {
                if (panel) {
                    console.log('获取规则列表并发送到面板');
                    const rules = await ruleFileManager.listRules();
                    console.log('获取到的规则列表:', rules);
                    panel.postMessage({ command: 'rulesList', rules: rules });
                    console.log('已发送 rulesList 消息到前端');
                }
            }, 100);
        } else {
            console.log('规则管理面板不存在，跳过刷新');
        }
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.openRulesPanel', () => {
            if (!ruleManagementPanel) {
                ruleManagementPanel = new RuleManagementPanelImpl(context.extensionUri, ruleFileManager, globalRuleManager);
                ruleManagementPanel.onDidDispose(() => {
                    ruleManagementPanel = undefined;
                });
            }
            ruleManagementPanel.show();
            refreshRulesList(); // 打开面板时刷新一次
        })
    );

    // 为不同类型的规则文件创建文件系统监听器

    // 为每个规则文件夹创建文件系统监听器
    for (const editorTypeKey in EditorType) {
        const editorType = EditorType[editorTypeKey as keyof typeof EditorType];
        const folderName = RULE_FOLDER_MAP[editorType];
        let folderPath: string;

        {
            folderPath = path.join(workspaceRoot, folderName);
            // 为其他编辑器类型创建多个监听器，监听所有支持的文件格式
            for (const extension of SUPPORTED_RULE_EXTENSIONS) {
                const filePattern = `*${extension}`;
                console.log(`创建文件监听器 - 编辑器类型: ${editorType}, 文件夹路径: ${folderPath}, 文件模式: ${filePattern}`);

                const watcher = vscode.workspace.createFileSystemWatcher(
                    new vscode.RelativePattern(folderPath, filePattern),
                    false, // ignoreCreateEvents
                    false, // ignoreChangeEvents
                    false  // ignoreDeleteEvents
                );

                context.subscriptions.push(watcher);

                watcher.onDidChange(uri => {
                    console.log(`[${editorType}] 文件改变: ${uri.fsPath}`);
                    refreshRulesList();
                });
                watcher.onDidCreate(uri => {
                    console.log(`[${editorType}] 文件创建: ${uri.fsPath}`);
                    refreshRulesList();
                });
                watcher.onDidDelete(uri => {
                    console.log(`[${editorType}] 文件删除: ${uri.fsPath}`);
                    refreshRulesList();
                });
            }
        }
    }

    // 注册命令以创建新规则
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.createRule', async (ruleType?: EditorType) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                // 等待面板完全加载并设置好 currentEditorType
                // 实际应用中可能需要更健壮的等待机制
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel) {
                // 直接调用面板的 createRule 逻辑，它会处理 editorType
                ruleManagementPanel.postMessage({ command: 'createRule', editorType: ruleType });
            }
        })
    );

    // 注册命令以编辑规则
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.editRule', async (ruleName: string) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel && ruleName) {
                ruleManagementPanel.postMessage({ command: 'editRule', ruleName });
            }
        })
    );

    // 注册命令以删除规则
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.deleteRule', async (ruleName: string) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel && ruleName) {
                ruleManagementPanel.postMessage({ command: 'deleteRule', ruleName });
            }
        })
    );

    // 注册命令以保存规则到全局
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.saveRuleAsGlobal', async (ruleName: string) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel && ruleName) {
                ruleManagementPanel.postMessage({ command: 'saveRuleAsGlobal', ruleName });
            }
        })
    );

    // 注册命令以删除全局规则
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.deleteGlobalRule', async (ruleName: string) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel && ruleName) {
                ruleManagementPanel.postMessage({ command: 'deleteGlobalRule', ruleName });
            }
        })
    );

    // 注册命令以添加全局规则到项目
    context.subscriptions.push(
        vscode.commands.registerCommand('rules-manager.addGlobalRuleToProject', async (ruleName: string) => {
            if (!ruleManagementPanel) {
                vscode.commands.executeCommand('rules-manager.openRulesPanel');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (ruleManagementPanel && ruleName) {
                ruleManagementPanel.postMessage({ command: 'addGlobalRuleToProject', ruleName });
            }
        })
    );
}

export function deactivate() {
    if (ruleManagementPanel) {
        ruleManagementPanel.dispose();
    }
}
