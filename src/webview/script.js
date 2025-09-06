/* global acquireVsCodeApi, document, window, t, updateUI */

const vscode = acquireVsCodeApi();
//let currentEditorType = ''; // 存储当前编辑器类型
let projectRulesLoading; // 声明为全局变量

// 根据规则类型显示/隐藏文件格式选择
function updateFileFormatVisibility() {
    const ruleTypeSelect = document.getElementById('rule-type-select');
    const fileFormatGroup = document.getElementById('file-format-group');
    if (ruleTypeSelect && fileFormatGroup) {
        // 所有规则类型都显示文件格式选择
        fileFormatGroup.style.display = 'block';
    }
}

// 初始化 projectRulesLoading 变量
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 内容已加载');
    projectRulesLoading = document.getElementById('project-rules-loading');
    console.log('projectRulesLoading 元素:', projectRulesLoading);

    // 初始化语言
    console.log('初始化UI翻译');
    updateUI();

    // 发送 webview 准备就绪消息
    console.log('发送 webviewReady 消息');
    vscode.postMessage({ command: 'webviewReady' });

    // 监听语言变化事件
    window.addEventListener('languageChanged', () => {
        console.log('语言已切换，重新渲染按钮文本');
        // 重新渲染项目规则按钮
        document.querySelectorAll('.button-group button').forEach(button => {
            const action = button.getAttribute('data-action');
            if (action === 'edit') {
                button.textContent = t('edit');
            } else if (action === 'saveToRemote') {
                button.textContent = t('saveToRemote');
            } else if (action === 'delete') {
                button.textContent = t('delete');
            }
        });

        // 重新渲染全局规则按钮
        document.querySelectorAll('.add-to-project-button').forEach(button => {
            if (button.textContent !== t('saveToRemote')) { // 不是项目规则中的保存按钮
                button.textContent = t('addToProject');
            }
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            if (!button.getAttribute('data-action')) { // 全局规则的删除按钮没有 data-action
                button.textContent = t('delete');
            }
        });

        // 更新加载文本
        const remoteRulesLoading = document.getElementById('remote-rules-loading');
        if (remoteRulesLoading) {
            remoteRulesLoading.textContent = t('loading');
        }
        const projectRulesLoading = document.getElementById('project-rules-loading');
        if (projectRulesLoading) {
            projectRulesLoading.textContent = t('loading');
        }
    });
});

const handleError = (error) => {
    const errorMessage = error instanceof Error ? error.message : t('unknownError');
    document.body.innerHTML = `<h1>${t('webviewError')}</h1><p>${errorMessage}</p><p>${t('restartVSCode')}</p>`;
    console.error('Webview JavaScript 错误:', error);
};

// 渲染全局规则列表
function renderGlobalRules(globalRules) {
    const globalRulesList = document.getElementById('global-rules-list');
    if (!globalRulesList) return;

    globalRulesList.innerHTML = '';
    if (globalRules.length === 0) {
        globalRulesList.innerHTML = `<li>${t('noRemoteRules')}</li>`;
    } else {
        globalRules.forEach(rule => {
            const li = document.createElement('li');
            const nameAndTagsContainer = document.createElement('div');
            nameAndTagsContainer.style.display = 'flex';
            nameAndTagsContainer.style.alignItems = 'center';

            const span = document.createElement('span');
            span.textContent = rule.name;
            nameAndTagsContainer.appendChild(span);

            if (rule.tags && rule.tags.length > 0) {
                rule.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'tag';
                    tagSpan.textContent = tag;
                    nameAndTagsContainer.appendChild(tagSpan);
                });
            }
            // 显示规则来源编辑器类型
            if (rule.editorType) {
                const editorTypeSpan = document.createElement('span');
                editorTypeSpan.className = 'tag';
                editorTypeSpan.textContent = `${t('source')}: ${rule.editorType}`;
                nameAndTagsContainer.appendChild(editorTypeSpan);
            }
            li.appendChild(nameAndTagsContainer);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '8px';

            const addProjectButton = document.createElement('button');
            addProjectButton.className = 'add-to-project-button'; // Use new class for blue button
            addProjectButton.textContent = t('addToProject');
            addProjectButton.onclick = () => {
                if (projectRulesLoading) {
                    projectRulesLoading.style.display = 'block';
                }
                vscode.postMessage({ command: 'addGlobalRuleToProject', ruleName: rule.name });
            };
            buttonGroup.appendChild(addProjectButton);


            const deleteGlobalButton = document.createElement('button');
            deleteGlobalButton.className = 'delete-button';
            deleteGlobalButton.textContent = t('delete');
            deleteGlobalButton.onclick = () => {
                vscode.postMessage({ command: 'deleteGlobalRule', ruleName: rule.name });
            };
            buttonGroup.appendChild(deleteGlobalButton);

            li.appendChild(buttonGroup);
            globalRulesList.appendChild(li);
        });
    }
}

try {

    console.log('webview script.js 已加载，设置消息监听器');

    // 通知后端 webview 已准备好
    console.log('通知后端 webview 已准备好');
    vscode.postMessage({ command: 'webviewReady' });

    window.addEventListener('message', event => {
        console.log('webview 收到消息事件:', event);
        try {
            const message = event.data;
            console.log('解析的消息数据:', message);
            console.log('消息的 command 字段:', message.command);
            console.log('command 类型:', typeof message.command);
            switch (message.command) {
                case 'rulesList': {
                    console.log('前端收到 rulesList 消息:', message);
                    const rulesListContainer = document.getElementById('project-rules-list-container');
                    const rulesList = document.getElementById('rules-list');
                    const loadingIndicator = document.getElementById('project-rules-loading');

                    if (!rulesListContainer || !rulesList || !loadingIndicator) {
                        console.log('找不到必要的DOM元素');
                        return;
                    }

                    console.log('开始更新规则列表，规则数量:', message.rules.length);
                    loadingIndicator.style.display = 'none'; // 隐藏加载指示器
                    rulesList.innerHTML = ''; // 清空现有列表

                    if (message.rules.length === 0) {
                        rulesList.innerHTML = `<li>${t('noRulesFound')}</li>`;
                    } else {
                        message.rules.forEach(rule => { // rule 现在是 ProjectRule 对象
                            const li = document.createElement('li');
                            const span = document.createElement('span');
                            span.textContent = rule.fullPath; // 显示完整路径
                            li.appendChild(span);

                            const buttonGroup = document.createElement('div');
                            buttonGroup.className = 'button-group';

                            const editButton = document.createElement('button');
                            editButton.className = 'edit-button';
                            editButton.setAttribute('data-filename', rule.fileName); // 存储纯文件名
                            editButton.setAttribute('data-editortype', rule.editorType); // 存储编辑器类型
                            editButton.textContent = t('edit');
                            editButton.setAttribute('data-action', 'edit'); // 添加动作标识
                            buttonGroup.appendChild(editButton);

                            const saveAsGlobalButton = document.createElement('button');
                            saveAsGlobalButton.className = 'add-to-project-button';
                            saveAsGlobalButton.setAttribute('data-filename', rule.fileName); // 存储纯文件名
                            saveAsGlobalButton.setAttribute('data-editortype', rule.editorType); // 存储编辑器类型
                            saveAsGlobalButton.setAttribute('data-action', 'saveToRemote'); // 添加动作标识
                            saveAsGlobalButton.textContent = t('saveToRemote');
                            buttonGroup.appendChild(saveAsGlobalButton);

                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'delete-button';
                            deleteButton.setAttribute('data-filename', rule.fileName); // 存储纯文件名
                            deleteButton.setAttribute('data-editortype', rule.editorType); // 存储编辑器类型
                            deleteButton.setAttribute('data-action', 'delete'); // 添加动作标识
                            deleteButton.textContent = t('delete');
                            buttonGroup.appendChild(deleteButton);

                            li.appendChild(buttonGroup);
                            rulesList.appendChild(li);
                        });

                        document.querySelectorAll('.button-group button').forEach(button => {
                            button.addEventListener('click', () => {
                                const fileName = button.getAttribute('data-filename'); // 获取纯文件名
                                const editorType = button.getAttribute('data-editortype'); // 获取编辑器类型
                                const action = button.getAttribute('data-action'); // 获取动作标识
                                if (fileName && editorType && action) {
                                    if (action === 'edit') {
                                        vscode.postMessage({ command: 'editRule', ruleName: fileName, editorType: editorType });
                                    } else if (action === 'saveToRemote') {
                                        vscode.postMessage({ command: 'saveRuleAsGlobal', ruleName: fileName, editorType: editorType });
                                    } else if (action === 'delete') {
                                        if (projectRulesLoading) {
                                            projectRulesLoading.style.display = 'block';
                                        }
                                        vscode.postMessage({ command: 'deleteRule', ruleName: fileName, editorType: editorType });
                                    }
                                }
                            });
                        });
                    }
                    break;
                }
                case 'globalRulesList': {
                    renderGlobalRules(message.globalRules || []);
                    break;
                }
                // case 'setCurrentEditorType': {
                //     currentEditorType = message.editorType;
                //     const editorInfoDiv = document.getElementById('current-editor-info');
                //     if (editorInfoDiv) {
                //         let folderInfo = '';
                //         if (currentEditorType === 'Windsurf') {
                //             folderInfo = '(规则文件在项目根目录)';
                //         } else {
                //             folderInfo = `(规则文件夹: .${currentEditorType.toLowerCase()}rules)`;
                //         }
                //         editorInfoDiv.textContent = '当前管理规则的编辑器类型: ' + currentEditorType + folderInfo;
                //     }
                //     // 重新加载规则列表以反映当前编辑器类型
                //     if (projectRulesLoading) {
                //         projectRulesLoading.style.display = 'block';
                //     }
                //     vscode.postMessage({ command: 'getRules' });
                //     break;
                // }
                default: {
                    console.log('未知的消息命令:', message.command);
                    console.log('完整消息:', message);
                    break;
                }
            }
        } catch (error) {
            handleError(error);
        }
    });

    const createButton = document.getElementById('create-rule-button');
    const ruleTypeSelect = document.getElementById('rule-type-select');
    const fileFormatSelect = document.getElementById('file-format-select');

    if (ruleTypeSelect) {
        ruleTypeSelect.addEventListener('change', updateFileFormatVisibility);
        // 初始化显示状态
        updateFileFormatVisibility();
    }

    if (createButton && ruleTypeSelect && fileFormatSelect) {
        createButton.addEventListener('click', () => {
            const selectedEditorType = ruleTypeSelect.value;
            const selectedFileFormat = fileFormatSelect.value;

            if (projectRulesLoading) {
                projectRulesLoading.style.display = 'block';
            }

            vscode.postMessage({
                command: 'createRule',
                editorType: selectedEditorType,
                fileFormat: selectedFileFormat
            });
        });
    }

    const searchInput = document.getElementById('search-input');
    const searchSourceSelect = document.getElementById('search-source-select'); // 获取来源选择框
    const searchButton = document.getElementById('search-button');

    if (searchButton && searchInput && searchSourceSelect) {
        const performSearch = () => {
            const query = searchInput.value;
            const source = searchSourceSelect.value; // 获取来源值
            vscode.postMessage({ command: 'searchGlobalRules', searchQuery: query, searchSource: source });
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        searchSourceSelect.addEventListener('change', performSearch); // 来源选择框变化时也触发搜索
    }

    // 移除重复的初始化代码，现在通过 webviewReady 消息处理
} catch (error) {
    handleError(error);
}
