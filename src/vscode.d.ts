declare module 'vscode' {
    // 基本类型
    interface Disposable {
        dispose(): void;
    }

    interface ExtensionContext {
        extensionUri: Uri;
        subscriptions: Disposable[];
    }

    interface Uri {
        fsPath: string;
        joinPath(uri: Uri, ...pathSegments: string[]): Uri;
    }

    interface Event<T> {
        (listener: (e: T) => unknown, thisArgs?: unknown, disposables?: Disposable[]): Disposable;
    }

    interface Webview {
        cspSource: string;
        html: string;
        postMessage<T = unknown>(message: T): Thenable<boolean>;
        onDidReceiveMessage: Event<unknown>;
    }

    // 窗口和面板
    enum ViewColumn {
        One = 1
    }

    interface WebviewPanel {
        webview: Webview;
        dispose(): void;
        onDidDispose: Event<void>;
        reveal(viewColumn?: ViewColumn, preserveFocus?: boolean): void;
        visible: boolean;
        active: boolean;
    }

    interface TextDocument {
        uri: Uri;
        fileName: string;
        isUntitled: boolean;
        languageId: string;
        version: number;
        isDirty: boolean;
        isClosed: boolean;
        save(): Thenable<boolean>;
        eol: EndOfLine;
        lineCount: number;
        getText(range?: Range): string;
    }

    enum EndOfLine {
        LF = 1,
        CRLF = 2
    }

    interface Position {
        line: number;
        character: number;
    }

    interface Range {
        start: Position;
        end: Position;
    }

    interface TextEditor {
        document: TextDocument;
        selection: Selection;
        selections: Selection[];
        visibleRanges: Range[];
        options: TextEditorOptions;
        viewColumn?: ViewColumn;
    }

    interface Selection extends Range {
        anchor: Position;
        active: Position;
    }

    interface TextEditorOptions {
        tabSize?: number | string;
        insertSpaces?: boolean | string;
        cursorStyle?: TextEditorCursorStyle;
        lineNumbers?: TextEditorLineNumbersStyle;
    }

    enum TextEditorCursorStyle {
        Line = 1,
        Block = 2,
        Underline = 3,
        LineThin = 4,
        BlockOutline = 5,
        UnderlineThin = 6
    }

    enum TextEditorLineNumbersStyle {
        Off = 0,
        On = 1,
        Relative = 2
    }

    interface InputBoxOptions {
        value?: string;
        valueSelection?: [number, number];
        prompt?: string;
        placeHolder?: string;
        password?: boolean;
        ignoreFocusOut?: boolean;
        validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
    }

    interface MessageOptions {
        modal?: boolean;
    }

    interface WebviewOptions {
        enableScripts?: boolean;
        enableCommandUris?: boolean;
        retainContextWhenHidden?: boolean;
        localResourceRoots?: Uri[];
        portMapping?: WebviewPortMapping[];
    }

    interface WebviewPortMapping {
        webviewPort: number;
        extensionHostPort: number;
    }

    interface WebviewPanelOptions {
        enableFindWidget?: boolean;
        retainContextWhenHidden?: boolean;
    }

    interface WorkspaceFolder {
        uri: Uri;
        name: string;
        index: number;
    }
    
    // 命名空间函数和对象
    namespace window {
        function showErrorMessage(message: string, options?: MessageOptions, ...items: string[]): Thenable<string | undefined>;
        function showInformationMessage(message: string, options?: MessageOptions, ...items: string[]): Thenable<string | undefined>;
        function showWarningMessage(message: string, options?: MessageOptions, ...items: string[]): Thenable<string | undefined>;
        function showInputBox(options?: InputBoxOptions): Thenable<string | undefined>;
        function showTextDocument(document: TextDocument, column?: ViewColumn, preserveFocus?: boolean): Thenable<TextEditor>;
        function createWebviewPanel(
            viewType: string,
            title: string,
            showOptions: ViewColumn | { viewColumn: ViewColumn; preserveFocus?: boolean },
            options?: WebviewPanelOptions & WebviewOptions
        ): WebviewPanel;
    }

    namespace workspace {
        const workspaceFolders: WorkspaceFolder[] | undefined;
        function openTextDocument(uri: Uri | string): Thenable<TextDocument>;
        function createFileSystemWatcher(
            globPattern: GlobPattern,
            ignoreCreateEvents?: boolean,
            ignoreChangeEvents?: boolean,
            ignoreDeleteEvents?: boolean
        ): FileSystemWatcher;
    }

    namespace commands {
        function registerCommand(command: string, callback: (...args: unknown[]) => unknown, thisArg?: unknown): Disposable;
        function executeCommand<T = unknown>(command: string, ...rest: unknown[]): Thenable<T>;
    }

    // 文件系统监听器相关类型
    interface FileSystemWatcher extends Disposable {
        ignoreCreateEvents: boolean;
        ignoreChangeEvents: boolean;
        ignoreDeleteEvents: boolean;
        onDidCreate: Event<Uri>;
        onDidChange: Event<Uri>;
        onDidDelete: Event<Uri>;
    }

    type GlobPattern = string | RelativePattern;

    class RelativePattern {
        base: string;
        pattern: string;
        constructor(base: WorkspaceFolder | Uri | string, pattern: string);
    }
}
