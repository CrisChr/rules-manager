import * as vscode from 'vscode';

interface I18nMessages {
    [key: string]: {
        zh: string;
        en: string;
    };
}

const messages: I18nMessages = {
    title: {
        zh: '规则管理',
        en: 'Rules Management'
    },
    fileNameEmpty: {
        zh: '文件名不能为空',
        en: 'File name cannot be empty'
    },
    fileNameTooLong: {
        zh: '文件名长度不能超过50个字符 (当前: {0})',
        en: 'File name cannot exceed 50 characters (current: {0})'
    },
    invalidChars: {
        zh: '文件名不能包含以下字符: / \\ : * ? " < > |',
        en: 'File name cannot contain these characters: / \\ : * ? " < > |'
    },
    enterRuleName: {
        zh: '请输入新规则的文件名 (例如: my-rule)',
        en: 'Enter new rule file name (e.g.: my-rule)'
    },
    ruleCreated: {
        zh: '规则文件 {0} 创建成功！',
        en: 'Rule file {0} created successfully!'
    },
    createRuleFailed: {
        zh: '创建规则文件失败。',
        en: 'Failed to create rule file.'
    },
    confirmDelete: {
        zh: '确定要删除规则文件 "{0}" 吗？',
        en: 'Are you sure you want to delete rule file "{0}"?'
    },
    deleteButton: {
        zh: '删除',
        en: 'Delete'
    },
    cancelButton: {
        zh: '取消',
        en: 'Cancel'
    },
    ruleDeleted: {
        zh: '规则文件 {0} 删除成功！',
        en: 'Rule file {0} deleted successfully!'
    },
    deleteRuleFailed: {
        zh: '删除规则文件失败。',
        en: 'Failed to delete rule file.'
    },
    enterGlobalRuleName: {
        zh: '请输入要保存的规则名称 (默认为 {0})',
        en: 'Enter the rule name to save (default: {0})'
    },
    enterTags: {
        zh: '请输入标签，用逗号分隔 (最多5个)',
        en: 'Enter tags, separated by commas (max 5)'
    },
    tagsPlaceholder: {
        zh: '例如: web, frontend, react',
        en: 'e.g.: web, frontend, react'
    },
    ruleSavedToGlobal: {
        zh: '规则 "{0}" 已保存规则！',
        en: 'Rule "{0}" has been saved!'
    },
    ruleCancelledAndDeleted: {
        zh: '规则 "{0}" 已取消保存并删除。',
        en: 'Rule "{0}" has been cancelled and deleted.'
    },
    cannotGetRuleContent: {
        zh: '无法获取规则文件 "{0}" 的内容。',
        en: 'Cannot get content of rule file "{0}".'
    },
    confirmDeleteGlobalRule: {
        zh: '确定要删除规则 "{0}" 吗？',
        en: 'Are you sure you want to delete rule "{0}"?'
    },
    globalRuleDeleted: {
        zh: '规则 "{0}" 删除成功！',
        en: 'Rule "{0}" deleted successfully!'
    },
    ruleAddedToProject: {
        zh: '规则 "{0}" 已添加到项目！',
        en: 'Rule "{0}" has been added to project!'
    },
    addRuleToProjectFailed: {
        zh: '添加规则到项目失败。',
        en: 'Failed to add rule to project.'
    },
    ruleNotFoundInRemote: {
        zh: '未在远程库中找到规则 "{0}"。',
        en: 'Rule "{0}" not found in remote library.'
    },
    editRuleContent: {
        zh: '编辑规则 "{0}" 的内容',
        en: 'Edit content of rule "{0}"'
    },
    ruleContentPlaceholder: {
        zh: '规则内容',
        en: 'Rule content'
    },
    ruleUpdated: {
        zh: '规则 "{0}" 更新成功！',
        en: 'Rule "{0}" updated successfully!'
    },
    ruleNotFound: {
        zh: '未找到规则 "{0}"。',
        en: 'Rule "{0}" not found.'
    },
    // ruleFileManager.ts related messages
    fileAlreadyExists: {
        zh: '文件 {0} 已存在。',
        en: 'File {0} already exists.'
    },
    fileNotExists: {
        zh: '文件 {0} 不存在。',
        en: 'File {0} does not exist.'
    },
    ruleDirectoryDeleted: {
        zh: '规则目录 {0} 已删除，因为它现在是空的。',
        en: 'Rule directory {0} has been deleted because it is now empty.'
    },
    listRulesError: {
        zh: '列出 {0} 规则文件时发生错误:',
        en: 'Error occurred while listing {0} rule files:'
    },
    openRuleUnknownError: {
        zh: '打开规则文件时发生未知错误',
        en: 'Unknown error occurred while opening rule file'
    },
    readRuleContentError: {
        zh: '读取规则文件 {0} 内容时发生错误:',
        en: 'Error occurred while reading rule file {0} content:'
    },
    fileExistsPrompt: {
        zh: '项目中已存在 "{0}" 文件。您想如何处理？',
        en: 'File "{0}" already exists in the project. How would you like to proceed?'
    },
    overwrite: {
        zh: '覆盖',
        en: 'Overwrite'
    },
    userCancelledOperation: {
        zh: '用户取消了添加操作。',
        en: 'User cancelled the add operation.'
    }
};

export class I18n {
    private static currentLanguage: string = 'zh';

    static init() {
        // 检测VS Code语言设置
        const locale = vscode.env.language;
        this.currentLanguage = locale.startsWith('en') ? 'en' : 'zh';
    }

    static t(key: string, ...args: string[]): string {
        const message = messages[key];
        if (!message) return key;
        
        let text = message[this.currentLanguage] || message.zh;
        
        // 替换占位符 {0}, {1}, etc.
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, arg);
        });
        
        return text;
    }

    static setLanguage(lang: 'zh' | 'en') {
        this.currentLanguage = lang;
    }
}