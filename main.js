const { app, BrowserWindow } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html'); // 加载你的HTML文件

    // 在窗口关闭时触发
    mainWindow.on('closed', function () {
        app.quit();
    });
}

// 在Electron完成初始化并准备创建浏览器窗口时触发
app.whenReady().then(createWindow);

// 在所有窗口都关闭时触发
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// 在应用程序激活时（点击应用程序图标时在Dock中重新创建一个窗口）触发
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
