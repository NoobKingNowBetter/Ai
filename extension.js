const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class EliteCodeAIProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
    }

    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'toast':
                    vscode.window.showInformationMessage(data.value);
                    break;
                case 'error':
                    vscode.window.showErrorMessage(data.value);
                    break;
                case 'insertCode':
                    this._insertCode(data.value);
                    break;
                case 'getActiveCode':
                    this._sendActiveCode();
                    break;
            }
        });
    }

    _insertCode(code) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, code);
            });
            vscode.window.showInformationMessage('Code inserted into editor!');
        } else {
            vscode.window.showErrorMessage('No active text editor to insert code.');
        }
    }

    _sendActiveCode() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const code = editor.document.getText(editor.selection) || editor.document.getText();
            const lang = editor.document.languageId;
            this._view.webview.postMessage({ type: 'activeCode', value: { code, lang } });
        } else {
            this._view.webview.postMessage({ type: 'activeCode', value: null });
        }
    }

    _getHtmlForWebview(webview) {
        // Read index.html
        const htmlPath = path.join(this._extensionUri.fsPath, 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Provide paths to resources
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'style.css'));
        const localAiUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'local-ai.js'));
        const aiEngineUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'ai-engine.js'));
        const appUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'app.js'));

        // Replace asset links in HTML
        htmlContent = htmlContent.replace('href="style.css"', `href="${styleUri}"`);
        htmlContent = htmlContent.replace('src="local-ai.js"', `src="${localAiUri}"`);
        htmlContent = htmlContent.replace('src="ai-engine.js"', `src="${aiEngineUri}"`);
        htmlContent = htmlContent.replace('src="app.js"', `src="${appUri}"`);

        return htmlContent;
    }
}

function activate(context) {
    const provider = new EliteCodeAIProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("elitecode.aiView", provider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('elitecode.start', () => {
            vscode.commands.executeCommand('workbench.view.extension.elitecode-ai-sidebar');
        })
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
