import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { RuleFileManager, RuleFileOptions, EditorType, RULE_FOLDER_MAP, ProjectRule, isSupportedRuleFile } from '../types'; // 导入 EditorType, RULE_FOLDER_MAP, ProjectRule
import { I18n } from '../i18n';

export class RuleFileManagerImpl implements RuleFileManager {
    private readonly workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    public getRulesPath(editorType: EditorType): string {
        const folderName = RULE_FOLDER_MAP[editorType];
        return path.join(this.workspaceRoot, folderName);
    }

    public async initializeRuleDirectory(editorType: EditorType): Promise<void> {
        const rulesDirectory = this.getRulesPath(editorType);
        // 如果规则目录不是工作区根目录且不存在，则创建目录
        if (rulesDirectory !== this.workspaceRoot && !fs.existsSync(rulesDirectory)) {
            fs.mkdirSync(rulesDirectory, { recursive: true });
        }
    }

    public async createRule(fileName: string, options: RuleFileOptions): Promise<void> {
        const rulesDirectory = this.getRulesPath(options.editorType);
        await this.initializeRuleDirectory(options.editorType); // 确保目录存在
        const filePath = path.join(rulesDirectory, fileName);

        if (fs.existsSync(filePath)) {
            throw new Error(I18n.t('fileAlreadyExists', fileName));
        }

        fs.writeFileSync(filePath, options.content);
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    }

    public async deleteRule(fileName: string, editorType: EditorType): Promise<void> {
        const rulesDirectory = this.getRulesPath(editorType);
        const filePath = path.join(rulesDirectory, fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(I18n.t('fileNotExists', fileName));
        }

        // 在删除文件之前，检查目录中是否只包含这一个文件
        let shouldDeleteDirectory = false;
        if (rulesDirectory !== this.workspaceRoot && fs.existsSync(rulesDirectory)) {
            const filesInDirectory = fs.readdirSync(rulesDirectory);
            // 如果目录中只有一个文件，并且这个文件就是我们要删除的文件
            if (filesInDirectory.length === 1 && filesInDirectory[0] === fileName) {
                shouldDeleteDirectory = true;
            }
        }

        fs.unlinkSync(filePath);

        // 如果之前判断出目录中只包含这一个文件，则删除目录
        if (shouldDeleteDirectory) {
            fs.rmdirSync(rulesDirectory);
            vscode.window.showInformationMessage(I18n.t('ruleDirectoryDeleted', path.basename(rulesDirectory)));
        }
    }

    public async listRules(): Promise<ProjectRule[]> {
        const allProjectRules: ProjectRule[] = [];
        const excludedRootFiles = ['README.md', 'README_en.md']; // 需要排除的根目录文件

        for (const editorTypeKey in EditorType) {
            const editorType = EditorType[editorTypeKey as keyof typeof EditorType];
            try {
                const rulesDirectory = this.getRulesPath(editorType);
                if (!fs.existsSync(rulesDirectory)) {
                    continue;
                }
                const files = fs.readdirSync(rulesDirectory);
                let filteredFiles: string[] = [];

                // 对于所有类型，查找所有支持的规则文件格式
                filteredFiles = files.filter(file => isSupportedRuleFile(file));

                // 对于根目录下的文件，需要排除特定的非规则文件
                if (rulesDirectory === this.workspaceRoot) {
                    filteredFiles = filteredFiles.filter(file => !excludedRootFiles.includes(file));
                    filteredFiles.forEach(fileName => {
                        allProjectRules.push({
                            fileName: fileName,
                            editorType: editorType,
                            fullPath: fileName, // 根目录文件直接显示文件名
                            source: editorType // 添加 source 字段
                        });
                    });
                } else {
                    // 对于子目录下的文件，添加文件名和完整路径
                    const folderName = RULE_FOLDER_MAP[editorType];
                    filteredFiles.forEach(fileName => {
                        allProjectRules.push({
                            fileName: fileName,
                            editorType: editorType,
                            fullPath: path.join(folderName, fileName), // 显示 folderName/fileName
                            source: editorType // 添加 source 字段
                        });
                    });
                }
            } catch (error) {
                console.error(I18n.t('listRulesError', editorType), error);
            }
        }
        // 移除重复项 (基于 fileName 和 editorType)
        const uniqueRules = new Map<string, ProjectRule>();
        allProjectRules.forEach(rule => {
            const key = `${rule.fileName}-${rule.editorType}`;
            if (!uniqueRules.has(key)) {
                uniqueRules.set(key, rule);
            }
        });
        return Array.from(uniqueRules.values());
    }

    public async openRule(fileName: string, editorType: EditorType): Promise<void> {
        try {
            const rulesDirectory = this.getRulesPath(editorType);
            const filePath = path.join(rulesDirectory, fileName);

            if (!fs.existsSync(filePath)) {
                throw new Error(I18n.t('fileNotExists', fileName));
            }

            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
        } catch (error) {
            throw error instanceof Error ? error : new Error(I18n.t('openRuleUnknownError'));
        }
    }

    public async getRuleContent(fileName: string, editorType: EditorType): Promise<string | undefined> {
        try {
            const rulesDirectory = this.getRulesPath(editorType);
            const filePath = path.join(rulesDirectory, fileName);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf8');
            }
            return undefined;
        } catch (error) {
            console.error(I18n.t('readRuleContentError', fileName), error);
            return undefined;
        }
    }

    /**
     * 将给定内容作为新规则文件添加到项目中。
     * 如果文件已存在，则会提示用户是否覆盖。
     * @param fileName 规则文件名。
     * @param content 规则内容。
     * @param editorType 编辑器类型。
     */
    public async addRuleFromContent(fileName: string, content: string, editorType: EditorType): Promise<void> {
        const rulesDirectory = this.getRulesPath(editorType);
        await this.initializeRuleDirectory(editorType); // 确保目录存在
        const filePath = path.join(rulesDirectory, fileName);

        if (fs.existsSync(filePath)) {
            const choice = await vscode.window.showWarningMessage(
                I18n.t('fileExistsPrompt', fileName),
                { modal: true },
                I18n.t('overwrite'),
                I18n.t('cancelButton')
            );
            if (choice === I18n.t('overwrite')) {
                // 用户选择覆盖，继续执行写入操作
            } else {
                // 用户选择取消，抛出错误或返回
                throw new Error(I18n.t('userCancelledOperation'));
            }
        }

        fs.writeFileSync(filePath, content);
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    }
}

export default RuleFileManagerImpl;
