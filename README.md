# *hapet* language support for Visual Studio Code  
A Visual Studio Code extension that provides rich language support for **hapet**. Powered by a Language Server Protocol (LSP) server, this extension integrates with [**hapet compiler**](https://github.com/hapet-lang/hapet) to provide rich type information and a faster, more reliable **hapet** experience.  

## Recommended Install and Usage  
- Install [**hapet compiler**](https://hapetlang.com/#downloads) to your computer;
- Install [**hapet extension**](https://marketplace.visualstudio.com/items?itemName=crackanddie.hapet-vscode) for Visual Studio Code;
- Open a folder/workspace that contains a **hapet** project (.hptproj) and the extension will activate.

## Running from source

```bash
npm install -g typescript
npm install --global yo generator-code
npm install vscode-languageclient

npm run compile
```

