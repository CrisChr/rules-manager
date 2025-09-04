import * as vscode from 'vscode';

export type RuleFileExtensions = '.md'; // 规则文件统一使用 .md 扩展名

export enum EditorType {
    Cline = 'Cline',
    Cursor = 'Cursor',
    VSCodeCopilot = 'VSCodeCopilot', // VS Code / GitHub Copilot 规则
    Windsurf = 'Windsurf',
}

export const RULE_FOLDER_MAP: Record<EditorType, string> = {
    [EditorType.Cline]: '.clinerules',
    [EditorType.Cursor]: '.cursor/rules',
    [EditorType.VSCodeCopilot]: '.github', // VS Code / GitHub Copilot 规则在 .github 文件夹下
    [EditorType.Windsurf]: '.windsurf/rules',
};

// 支持的规则文件扩展名
export const SUPPORTED_RULE_EXTENSIONS = [
    '.md',      // Markdown
    '.yaml',    // YAML
    '.yml',     // YAML (短格式)
    '.json',    // JSON
    '.txt',     // 纯文本
    '.xml',     // XML
] as const;

// 检查文件是否为支持的规则文件格式
export function isSupportedRuleFile(fileName: string): boolean {
    return SUPPORTED_RULE_EXTENSIONS.some(ext => fileName.toLowerCase().endsWith(ext));
}

export interface GlobalRule {
    name: string;
    content: string;
    timestamp: number; // 用于记录保存时间，方便排序和管理
    tags?: string[]; // 新增标签属性，最多5个标签
    editorType?: EditorType; // 新增编辑器类型，用于区分规则来源
}

export interface WebviewMessage {
    command: WebviewCommand;
    ruleName?: string;
    rules?: ProjectRule[]; // 修改为 ProjectRule 数组
    globalRules?: GlobalRule[];
    ruleContent?: string; // 用于保存全局规则时传递内容
    tags?: string[]; // 用于保存全局规则时传递标签
    searchQuery?: string; // 用于搜索全局规则时传递查询字符串
    editorType?: EditorType; // 用于在 Webview 和 Extension 之间传递当前编辑器类型
    searchSource?: EditorType; // 新增搜索来源字段
    fileFormat?: string; // 用于创建规则时指定文件格式
}

export interface ProjectRule {
    fileName: string;
    editorType: EditorType;
    fullPath: string; // 用于显示给用户看的完整路径，例如 .cursor/rules/my-rule.md
    source: EditorType; // 新增来源字段，直接使用 editorType
}

export type WebviewCommand = 'getRules' | 'createRule' | 'editRule' | 'deleteRule' | 'rulesList' | 'getGlobalRules' | 'saveRuleAsGlobal' | 'deleteGlobalRule' | 'addGlobalRuleToProject' | 'globalRulesList' | 'searchGlobalRules' | 'editGlobalRule' | 'setCurrentEditorType' | 'webviewReady';

export interface RuleManagementPanel {
    readonly panel: vscode.WebviewPanel;
    readonly extensionUri: vscode.Uri;
    readonly disposables: vscode.Disposable[];
    dispose(): void;
    show(): void;
    reveal(): void;
    postMessage(message: WebviewMessage): void;
    onDidReceiveMessage(callback: (message: WebviewMessage) => void): void;
    onDidDispose(callback: () => void): void;
    updateRulesList(rules: string[]): void;
}

export interface RuleOperationResult {
    success: boolean;
    message?: string;
    data?: unknown;
}

export interface RuleFileOptions {
    content: string;
    editorType: EditorType; // 创建规则时需要指定编辑器类型
}

export interface RuleFileManager {
    initializeRuleDirectory(editorType: EditorType): Promise<void>; // 初始化时需要指定编辑器类型
    createRule(fileName: string, options: RuleFileOptions): Promise<void>;
    deleteRule(fileName: string, editorType: EditorType): Promise<void>; // 删除时需要指定编辑器类型
    listRules(): Promise<ProjectRule[]>; // 列出所有规则，返回 ProjectRule 数组
    openRule(fileName: string, editorType: EditorType): Promise<void>; // 打开规则时需要指定编辑器类型
    getRuleContent(fileName: string, editorType: EditorType): Promise<string | undefined>; // 获取内容时需要指定编辑器类型
    getRulesPath(editorType: EditorType): string; // 获取路径时需要指定编辑器类型
    addRuleFromContent(fileName: string, content: string, editorType: EditorType): Promise<void>; // 新增方法，添加时需要指定编辑器类型
}
