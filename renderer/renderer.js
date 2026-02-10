let currentPath = null;
const pathEl = document.getElementById("path");
const editor = document.getElementById("editor");
document.getElementById("open").addEventListener("click", async () => {
    const res = await window.razz.openFile();
    if (!res) return;
    currentPath = res.filePath;
    editor.value = res.contents;
    pathEl.textContent = currentPath;
});

document.getElementById("save").addEventListener("click", async() => {
    if (!currentPath) {
        alert("No file open. Use Save As.");
        return;
    }
    await window.razz.saveFile({ filePath: currentPath, contents: editor.value });
});

document.getElementById("saveAs").addEventListener("click", async() => {
    const res = await window.razz.saveAs({
        defaultPath: currentPath || "untitled.txt",
        contents: editor.value
    });
    if (!res) return;
    currentPath = res.filePath;
    pathEl.textContent = currentPath;
});