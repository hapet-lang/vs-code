import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    
    const serverOptions: ServerOptions = {
        run: { command: 'hapet.exe',  args: ['lsp'] },
        debug: { command: 'hapet.exe', args: ['lsp'] }
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