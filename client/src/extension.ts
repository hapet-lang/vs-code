import * as path from 'path';
import * as fs from 'fs';
import * as net from 'net';
import { Socket } from 'net';
import * as vscode from 'vscode';
import { workspace, window, ExtensionContext } from 'vscode';
import { ChildProcess, spawn } from 'child_process';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, StreamInfo } from 'vscode-languageclient/node';

let client: LanguageClient;

// for debugging via TCP
function createStream(): Promise<StreamInfo> {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    socket.on('error', (err) => {
      reject(err);
    });
    socket.connect(5007, '127.0.0.1', () => {
      resolve({
        reader: socket,
        writer: socket
      });
    });
  });
}

export function activate(context: ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('hapet lsp');
    outputChannel.show(true);
    outputChannel.appendLine('Starting lsp...');

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

    try {
        require('child_process').execSync('hapet --version', { encoding: 'utf8' });
        outputChannel.appendLine('hapet compiler found');
    } catch (e) {
        outputChannel.appendLine('hapet NOT found');
    }

    const serverOptions: ServerOptions = {
        command: 'hapet',
        args: ['lsp', projectFilePath],
        options: {
            shell: true,
            env: process.env
        }
    };

    // for debugging via TCP
    // const serverOptions: ServerOptions = () => {
    //     return createStream();
    // };
    
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'hapet' }],
        outputChannel: outputChannel
    };
    
    client = new LanguageClient('hapetLanguageServer', 'HAPET Language Server', serverOptions, clientOptions);
    client.start();

    outputChannel.appendLine('hapet lsp started');
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}