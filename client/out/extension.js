"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const net_1 = require("net");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
// for debugging via TCP
function createStream() {
    return new Promise((resolve, reject) => {
        const socket = new net_1.Socket();
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
function activate(context) {
    const folders = vscode_1.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        vscode_1.window.showErrorMessage('Open project folder to use HAPET LSP.');
        return;
    }
    const rootPath = folders[0].uri.fsPath;
    const filesInRoot = fs.readdirSync(rootPath);
    const projectFile = filesInRoot.find(f => f.endsWith('.hptproj'));
    if (!projectFile) {
        vscode_1.window.showErrorMessage('Project file .hptproj could not be found in workspace.');
        return;
    }
    const projectFilePath = path.join(rootPath, projectFile);
    const serverOptions = {
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
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'hapet' }],
    };
    client = new node_1.LanguageClient('hapetLanguageServer', 'HAPET Language Server', serverOptions, clientOptions);
    client.start();
}
function deactivate() {
    return client?.stop();
}
//# sourceMappingURL=extension.js.map