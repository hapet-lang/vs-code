import * as path from 'path';
import { Socket } from 'net';
import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, StreamInfo } from 'vscode-languageclient/node';

let client: LanguageClient;

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
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    
    const serverOptions: ServerOptions = () => {
        return createStream();
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