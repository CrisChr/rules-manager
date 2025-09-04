import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const htmlPath = path.join(extensionUri.fsPath, 'src', 'webview', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'styles.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'src', 'webview', 'script.js'));
    const cspSource = webview.cspSource;

    html = html.replace(/{{cspSource}}/g, cspSource);
    html = html.replace(/{{styleUri}}/g, styleUri.toString());
    html = html.replace(/{{scriptUri}}/g, scriptUri.toString());

    return html;
}
