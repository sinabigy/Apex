const {ipcRenderer, contextBridge} = require("electron")

contextBridge.exposeInMainWorld("api", {
    sendMessage: (msg) => ipcRenderer.invoke("hello", msg),
});

