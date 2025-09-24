"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental, // ← ИСПРАВЛЕННАЯ СТРОКА
            // Добавьте другие возможности по мере необходимости
            completionProvider: {
                resolveProvider: true
            },
            hoverProvider: true,
            definitionProvider: true
        }
    };
});
connection.onInitialized(() => {
    console.log('Hapet Language Server is initialized');
});
// Обработчик изменений документа
documents.onDidChangeContent(change => {
    const text = change.document.getText();
    console.log(`Document changed: ${change.document.uri}`);
    // Здесь будет ваша логика анализа Hapet кода
    // Например, проверка синтаксиса, сбор информации и т.д.
});
// Запуск сервера
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map