import * as path from 'path';
import * as fs from 'fs';
import * as net from 'net';
import { Socket } from 'net';
import * as vscode from 'vscode';
import { workspace, window, ExtensionContext } from 'vscode';
import { ChildProcess, spawn } from 'child_process';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, StreamInfo } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const folders = workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        window.showErrorMessage('Open project folder to use HAPET LSP.');
        return;
    }  

    const rootPath = folders[0].uri.fsPath;
    const filesInRoot = fs.readdirSync(rootPath);
    const projectFile = filesInRoot.find(f => f.endsWith('.hptproj'));
    if (!projectFile) {
        window.showErrorMessage('Project file .hptproj could not be found in workspace.');
        return;
    }
    const projectFilePath = path.join(rootPath, projectFile);

    const serverOptions: ServerOptions = {
        command: 'hapet',
        args: ['lsp', projectFilePath],
        options: {
            shell: true,
            env: process.env
        }
    };
    
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'hapet' }],
    };
    
    client = new LanguageClient('hapetLanguageServer', 'HAPET Language Server', serverOptions, clientOptions);
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}