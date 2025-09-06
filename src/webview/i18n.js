/* global document, window */

const i18n = {
    zh: {
        title: '规则管理面板',
        selectRuleType: '选择规则类型:',
        selectFileFormat: '选择文件格式:',
        createRule: '新增规则',
        remoteRules: '远程规则列表（通过VS Code账号同步）',
        searchPlaceholder: '搜索规则名称或标签...',
        search: '搜索',
        loading: '加载中...',
        projectRules: '项目规则文件列表',
        noRulesFound: '没有找到规则文件。',
        noRemoteRules: '没有找到远程规则。',
        addToProject: '添加到项目',
        saveToRemote: '保存到远程',
        edit: '编辑',
        delete: '删除',
        source: '来源',
        cursor: 'Cursor 规则',
        vscodeCopilot: 'VS Code / GitHub Copilot 规则',
        cline: 'Cline 规则',
        windsurf: 'Windsurf 规则',
        text: '文本',
        // ruleFileManager.ts 相关文本
        fileAlreadyExists: '文件 {0} 已存在。',
        fileNotExists: '文件 {0} 不存在。',
        ruleDirectoryDeleted: '规则目录 {0} 已删除，因为它现在是空的。',
        listRulesError: '列出 {0} 规则文件时发生错误:',
        openRuleUnknownError: '打开规则文件时发生未知错误',
        readRuleContentError: '读取规则文件 {0} 内容时发生错误:',
        fileExistsPrompt: '项目中已存在 "{0}" 文件。您想如何处理？',
        overwrite: '覆盖',
        cancel: '取消',
        userCancelledOperation: '用户取消了添加操作。',
        // 错误处理相关
        unknownError: '未知错误',
        webviewError: 'Webview 错误',
        restartVSCode: '请尝试重新启动 VS Code。'
    },
    en: {
        title: 'Rules Management Panel',
        selectRuleType: 'Select Rule Type:',
        selectFileFormat: 'Select File Format:',
        createRule: 'Create Rule',
        remoteRules: 'Remote Rules List (Synced via VS Code Account)',
        searchPlaceholder: 'Search rule names or tags...',
        search: 'Search',
        loading: 'Loading...',
        projectRules: 'Project Rules File List',
        noRulesFound: 'No rule files found.',
        noRemoteRules: 'No remote rules found.',
        addToProject: 'Add to Project',
        saveToRemote: 'Save to Remote',
        edit: 'Edit',
        delete: 'Delete',
        source: 'Source',
        cursor: 'Cursor rule',
        vscodeCopilot: 'VS Code / GitHub Copilot rule',
        cline: 'Cline rule',
        windsurf: 'Windsurf rule',
        text: 'Text',
        // ruleFileManager.ts related text
        fileAlreadyExists: 'File {0} already exists.',
        fileNotExists: 'File {0} does not exist.',
        ruleDirectoryDeleted: 'Rule directory {0} has been deleted because it is now empty.',
        listRulesError: 'Error occurred while listing {0} rule files:',
        openRuleUnknownError: 'Unknown error occurred while opening rule file',
        readRuleContentError: 'Error occurred while reading rule file {0} content:',
        fileExistsPrompt: 'File "{0}" already exists in the project. How would you like to proceed?',
        overwrite: 'Overwrite',
        cancel: 'Cancel',
        userCancelledOperation: 'User cancelled the add operation.',
        // 错误处理相关
        unknownError: 'Unknown error',
        webviewError: 'Webview Error',
        restartVSCode: 'Please try restarting VS Code.'
    }
};

let currentLang = 'zh';

function t(key, ...args) {
    let text = i18n[currentLang][key] || key;
    // 替换占位符 {0}, {1}, {2} 等
    args.forEach((arg, index) => {
        text = text.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
    });
    return text;
}

function switchLanguage(lang) {
    currentLang = lang;
    updateUI();

    // 更新语言按钮的激活状态
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    // 重新渲染动态内容
    const event = new CustomEvent('languageChanged');
    window.dispatchEvent(event);
}

function updateUI() {
    document.title = t('title');
    document.querySelector('h1').textContent = t('title');
    document.querySelector('label[for="rule-type-select"]').textContent = t('selectRuleType');
    document.querySelector('label[for="file-format-select"]').textContent = t('selectFileFormat');
    document.getElementById('create-rule-button').textContent = t('createRule');
    document.querySelector('h2').textContent = t('remoteRules');
    document.getElementById('search-input').placeholder = t('searchPlaceholder');
    document.getElementById('search-button').textContent = t('search');
    document.querySelector('.project-rules-header').textContent = t('projectRules');

    // 更新加载文本
    const remoteRulesLoading = document.getElementById('remote-rules-loading');
    if (remoteRulesLoading) {
        remoteRulesLoading.textContent = t('loading');
    }
    const projectRulesLoading = document.getElementById('project-rules-loading');
    if (projectRulesLoading) {
        projectRulesLoading.textContent = t('loading');
    }

    // 更新规则类型选项
    const ruleTypeSelect = document.getElementById('rule-type-select');
    if (ruleTypeSelect) {
        const options = ruleTypeSelect.querySelectorAll('option');
        options[0].textContent = t('cursor'); // Cursor
        options[1].textContent = t('vscodeCopilot'); // VSCodeCopilot
        options[2].textContent = t('windsurf'); // Windsurf
        options[3].textContent = t('cline'); // Cline
    }

    // 更新文件格式选项
    const fileFormatSelect = document.getElementById('file-format-select');
    if (fileFormatSelect) {
        const options = fileFormatSelect.querySelectorAll('option');
        // 只更新文本选项，其他保持原样
        if (options[4]) { // .txt 选项
            options[4].textContent = `${t('text')} (.txt)`;
        }
    }
}