// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type * as vscode from "vscode";
import { execSync } from "child_process";

let server: ReturnType<(typeof import("./app.ts"))["startServer"]>;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
    // bailout if the data bridge is not enabled
    const dataBridgeEnvVar = execSync("echo $DATA_BRIDGE_ENABLED").toString().trim();
    if (!["1", "true"].includes(dataBridgeEnvVar)) {
        return;
    }

    // import only if the extension should be activated
    const [{ startServer }, { default: logger }, { default: CommandRegistry }] = await Promise.all([
        import("./app.ts"),
        import("./service/logger.ts"),
        import("./service/commands.ts"),
    ]);

    const commandRegistry = new CommandRegistry(context);

    commandRegistry.registerCommands();

    server = startServer();
    logger.info("Data Bridge extension activated and server started");

    context.subscriptions.push(logger);
}

// This method is called when your extension is deactivated
export async function deactivate() {
    if (server) {
        const logger = await import("./service/logger.ts").then((module) => module.default);
        logger.info("Shutting down HTTP server");
        server.close();
    }
}
