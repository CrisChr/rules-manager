import * as vscode from 'vscode';
import { GlobalRule, EditorType } from '../types'; // 导入 EditorType

const GLOBAL_RULES_CONFIG_KEY = 'globalRules';

export class GlobalRuleManager {
    constructor() {
        // 不再需要 context，因为我们使用 VS Code 配置
    }

    public getGlobalRules(): GlobalRule[] {
        const config = vscode.workspace.getConfiguration('rules-manager');
        const globalRules = config.get<GlobalRule[]>(GLOBAL_RULES_CONFIG_KEY, []);
        return globalRules.sort((a, b) => b.timestamp - a.timestamp); // 按时间戳降序排序
    }

    public getGlobalRuleByName(name: string): GlobalRule | undefined {
        return this.getGlobalRules().find(rule => rule.name === name);
    }

    public async saveGlobalRule(name: string, content: string, tags?: string[], editorType?: EditorType): Promise<void> { // 增加 editorType 参数
        const globalRules = this.getGlobalRules();
        const existingRuleIndex = globalRules.findIndex(rule => rule.name === name);

        const newRule: GlobalRule = {
            name,
            content,
            timestamp: Date.now(),
            tags,
            editorType // 保存 editorType
        };

        if (existingRuleIndex !== -1) {
            globalRules[existingRuleIndex] = newRule;
        } else {
            globalRules.push(newRule);
        }

        const config = vscode.workspace.getConfiguration('rules-manager');
        await config.update(GLOBAL_RULES_CONFIG_KEY, globalRules, vscode.ConfigurationTarget.Global);
    }

    public async deleteGlobalRule(name: string): Promise<void> {
        let globalRules = this.getGlobalRules();
        globalRules = globalRules.filter(rule => rule.name !== name);
        const config = vscode.workspace.getConfiguration('rules-manager');
        await config.update(GLOBAL_RULES_CONFIG_KEY, globalRules, vscode.ConfigurationTarget.Global);
    }

    public searchGlobalRules(query: string, searchSource?: EditorType): GlobalRule[] {
        const lowerCaseQuery = query.toLowerCase();
        return this.getGlobalRules().filter(rule => {
            const matchesQuery = rule.name.toLowerCase().includes(lowerCaseQuery) ||
                                 (rule.tags && rule.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)));
            const matchesSource = !searchSource || rule.editorType === searchSource; // 如果没有指定来源，或者规则的来源与指定来源匹配

            return matchesQuery && matchesSource;
        });
    }
}
