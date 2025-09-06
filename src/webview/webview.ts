import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // 尝试多个可能的路径，以兼容开发和生产环境
    let htmlPath: string;
    let webviewDir: string;

    // 首先尝试 src/webview 路径（开发环境）
    const srcWebviewPath = path.join(extensionUri.fsPath, 'src', 'webview', 'index.html');
    if (fs.existsSync(srcWebviewPath)) {
        htmlPath = srcWebviewPath;
        webviewDir = 'src/webview';
    } else {
        // 如果不存在，尝试 out/webview 路径（生产环境）
        const outWebviewPath = path.join(extensionUri.fsPath, 'out', 'webview', 'index.html');
        if (fs.existsSync(outWebviewPath)) {
            htmlPath = outWebviewPath;
            webviewDir = 'out/webview';
        } else {
            // 最后尝试根目录下的 webview 路径
            htmlPath = path.join(extensionUri.fsPath, 'webview', 'index.html');
            webviewDir = 'webview';
        }
    }

    let html: string;
    try {
        html = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
        console.error('无法读取 HTML 文件:', error);
        // 返回一个基本的错误页面
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>规则管理</title>
            </head>
            <body>
                <h1>加载错误</h1>
                <p>无法加载规则管理面板。请检查扩展安装是否正确。</p>
                <p>错误详情: ${error}</p>
            </body>
            </html>
        `;
    }

    // 构建资源 URI，使用检测到的目录
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, webviewDir, 'styles.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, webviewDir, 'script.js'));
    // 添加i18n资源URI
    const i18nUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, webviewDir, 'i18n.js'));
    const cspSource = webview.cspSource;

    html = html.replace(/{{cspSource}}/g, cspSource);
    html = html.replace(/{{styleUri}}/g, styleUri.toString());
    html = html.replace(/{{scriptUri}}/g, scriptUri.toString());
    html = html.replace(/{{i18nUri}}/g, i18nUri.toString());

    return html;
}
