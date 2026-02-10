const {app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require ("path");
const fs = require("fs/promises");
const { fileURLToPath } = require("url");
const { defaultApp } = require("process");

function createWindow(){
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", ()=> {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("dialog:openFile", async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            { name: "Code", extensions: ["py", "js", "ts", "html", "css", "txt", "json", "md" ]},
            { name: "All Files", extensions: ["*"]}
        ]
    });
    if (canceled || filePaths.length === 0) return null;
    const filePath = filePaths[0];
    const contents = await fs.readFile(filePath, "utf8");
    return {filePath, contents };
});

ipcMain.handle("file:save", async (_event, { filePath, contents }) =>{
    await fs.writeFile(filePath, contents, "utf8");
    return {ok : true};
});

ipcMain.handle("dialog:saveAs", async (_event, { defaultPath, contents }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: defaultPath || "untitled.txt"
    });
    if (canceled || !filePath) return null;
    await fs.writeFile(filePath, contents, "utf8");
    return { filePath};
});

