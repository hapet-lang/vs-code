import { createConnection, TextDocuments, ProposedFeatures, TextDocumentSyncKind } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental, // ← ИСПРАВЛЕННАЯ СТРОКА
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