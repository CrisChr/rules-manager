/* global acquireVsCodeApi, document, window */

const vscode = acquireVsCodeApi();
//let currentEditorType = ''; // 存储当前编辑器类型
let projectRulesLoading; // 声明为全局变量

// 初始化 projectRulesLoading 变量
document.addEventListener('DOMContentLoaded', () => {
    projectRulesLoading = document.getElementById('project-rules-loading');
});

const handleError = (error) => {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    document.body.innerHTML = '<h1>Webview 错误</h1><p>' + errorMessage + '</p><p>请尝试重新启动 VS Code。</p>';
    console.error('Webview JavaScript 错误:', error);
};

// 渲染全局规则列表
function renderGlobalRules(globalRules) {
    const globalRulesList = document.getElementById('global-rules-list');
    if (!globalRulesList) return;

    globalRulesList.innerHTML = '';
    if (globalRules.length === 0) {
        globalRulesList.innerHTML = '<li>没有找到全局规则。</li>';
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
                editorTypeSpan.textContent = '来源: ' + rule.editorType;
                nameAndTagsContainer.appendChild(editorTypeSpan);
            }
            li.appendChild(nameAndTagsContainer);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '8px';

            const addProjectButton = document.createElement('button');
            addProjectButton.className = 'add-to-project-button'; // Use new class for blue button
            addProjectButton.textContent = '添加到项目';
            addProjectButton.onclick = () => {
                if (projectRulesLoading) {
                    projectRulesLoading.style.display = 'block';
                }
                vscode.postMessage({ command: 'addGlobalRuleToProject', ruleName: rule.name });
            };
            buttonGroup.appendChild(addProjectButton);


            const deleteGlobalButton = document.createElement('button');
            deleteGlobalButton.className = 'delete-button';
            deleteGlobalButton.textContent = '删除';
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
                        rulesList.innerHTML = '<li>没有找到规则文件。</li>';
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
                            editButton.textContent = '编辑';
                            buttonGroup.appendChild(editButton);

                            const saveAsGlobalButton = document.createElement('button');
                            saveAsGlobalButton.className = 'add-to-project-button';
                            saveAsGlobalButton.setAttribute('data-filename', rule.fileName); // 存储纯文件名
                            saveAsGlobalButton.setAttribute('data-editortype', rule.editorType); // 存储编辑器类型
                            saveAsGlobalButton.textContent = '保存到远程';
                            buttonGroup.appendChild(saveAsGlobalButton);

                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'delete-button';
                            deleteButton.setAttribute('data-filename', rule.fileName); // 存储纯文件名
                            deleteButton.setAttribute('data-editortype', rule.editorType); // 存储编辑器类型
                            deleteButton.textContent = '删除';
                            buttonGroup.appendChild(deleteButton);

                            li.appendChild(buttonGroup);
                            rulesList.appendChild(li);
                        });

                        document.querySelectorAll('.button-group button').forEach(button => {
                            button.addEventListener('click', () => {
                                const fileName = button.getAttribute('data-filename'); // 获取纯文件名
                                const editorType = button.getAttribute('data-editortype'); // 获取编辑器类型
                                if (fileName && editorType) {
                                    if (button.textContent === '编辑') {
                                        vscode.postMessage({ command: 'editRule', ruleName: fileName, editorType: editorType });
                                    } else if (button.textContent === '保存到远程') {
                                        vscode.postMessage({ command: 'saveRuleAsGlobal', ruleName: fileName, editorType: editorType });
                                    } else if (button.textContent === '删除') {
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
    const fileFormatGroup = document.getElementById('file-format-group');

    // 根据规则类型显示/隐藏文件格式选择
    function updateFileFormatVisibility() {
        if (ruleTypeSelect && fileFormatGroup) {
            const selectedType = ruleTypeSelect.value;
            if (selectedType === 'Windsurf') {
                // Windsurf 规则不需要选择文件格式
                fileFormatGroup.style.display = 'none';
            } else {
                fileFormatGroup.style.display = 'block';
            }
        }
    }

    if (ruleTypeSelect) {
        ruleTypeSelect.addEventListener('change', updateFileFormatVisibility);
        // 初始化显示状态
        updateFileFormatVisibility();
    }

    if (createButton && ruleTypeSelect && fileFormatSelect) {
        createButton.addEventListener('click', () => {
            const selectedEditorType = ruleTypeSelect.value;
            const selectedFileFormat = selectedEditorType === 'Windsurf' ? null : fileFormatSelect.value;

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

    vscode.postMessage({ command: 'getGlobalRules' }); // 初始加载全局规则

    // 初始加载项目规则时显示加载中
    if (projectRulesLoading) {
        projectRulesLoading.style.display = 'block';
    }
    vscode.postMessage({ command: 'getRules' }); // 初始加载项目规则
} catch (error) {
    handleError(error);
}
