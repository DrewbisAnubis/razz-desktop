const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("razz", {
    openFile: () => ipcRenderer.invoke("dialog:openFile"),
    saveFile: (payload) => ipcRenderer.invoke("file:save", payload),
    saveAs: (payload) => ipcRenderer.invoke("dialog:saveAs", payload)
});