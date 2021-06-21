const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");
const os = require("os");
const md5 = require("md5");
const https = require('https');
const si = require('systeminformation');
const download_url = "https://playapex.net/static/RSPS/Apex-client.jar?time="+Date.now();
const homedirectory = os.homedir();
const directory = `${homedirectory}/Apex-client.jar`;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 995,
    height: 599,
    show: false,
    webPreferences: {
      preload: __dirname + "/preload.js",
      devTools: false
    }
  });


  mainWindow.on("ready-to-show", () => mainWindow.show())


  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setResizable(false);

  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
};

ipcMain.handle("hello", async (handler, args) => {
  const handleBooleans = {error: false, isJREInstalled: true, isHTTPSBlocked: false}
  // get the requirememts object
  const result = await checkFiles();

  if (!result.isJavaInstalled) {
      handleBooleans.isJREInstalled = false
      return handleBooleans
  }

  if (result.isHttpsGettingBlocked) {
    handleBooleans.isHTTPSBlocked = true
      return handleBooleans
  }

  if (!result.isMD5TheSame || !result.isFileAvailable || result.isPathCorrupted) {
    try {
      const download_result = await downloadEXE(directory);
      var child = require('child_process').spawn(
        'java', ['-jar', `${directory}`, '']
      )
      return handleBooleans
    } catch (err) {
      handleBooleans.error = true
      return handleBooleans
    }
  }

  if (result.isMD5TheSame || result.isFileAvailable || !result.isPathCorrupted) {
    var child = require('child_process').spawn(
      'java', ['-jar', `${directory}`, '']
    )
  }
  
    // else install it

  // check for java and if installed then continue
    // install it or tell user to install it 
  console.log(result)
  
  return result;
});

async function checkFiles () {

  const requirementCheck = {isJavaInstalled: false, isMD5TheSame: false, isFileAvailable: false, isPathCorrupted: false, isHttpsGettingBlocked: false}
  const data = await si.versions()

  let exist = fs.existsSync(directory);
  let fileData;

  requirementCheck.isFileAvailable = exist

  if (data.java.length === 0) {
    requirementCheck.isJavaInstalled = false;
  } else {
    console.log(data.java)
    requirementCheck.isJavaInstalled = true;
  }

  if (!exist) {
    requirementCheck.isFileAvailable = false
  }

  try {
    fileData = fs.readFileSync(directory);
  } catch (err ) {
    requirementCheck.isPathCorrupted = true;
    return requirementCheck
  }

  const fileHash = md5(fileData);

  let d;

  try {
    d = await getHash();
  } catch(err) {
    requirementCheck.isHttpsGettingBlocked = true;
    return requirementCheck
  }
  const serverHash = d.toString();

  if (serverHash === fileHash) {
    requirementCheck.isMD5TheSame = true;
    console.log("3");
  } else {
    requirementCheck.isMD5TheSame = false;
    console.log("4");
  }
  return requirementCheck
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// Check for installer to fionisu


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function getHash () {

  const options = {
    hostname: "playapex.net",
    port: 443,
    path: "/static/RSPS/client_hash.txt?time="+Date.now(),
    method: 'GET'
  }
  
  return new Promise((result, rej) => {
    const req = https.request(options, (res) => {

      console.log(`statusCode: ${res.statusCode} - Status Recieved`)

      res.on('data', (d) => {
        console.log(d.toString());
        result(d);
      })
    });

    req.on('error', err => {
      console.log("5");
      rej(err);
    });

    req.end();
  })
};

async function downloadEXE (destLocation) {
  return new Promise((success, reject) => {

    let file = fs.createWriteStream(destLocation);

    let request = https.get("https://playapex.net/static/RSPS/Apex-client.jar", function(response) {
      response.pipe(file);
      file.on('finish', function() {
        console.log("finished Downloading")
        success(file.path);
      });
    }).on('error', function(err) { // Handle errors
      console.log(err)
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  });
 // var SAVE_LOCATION = System.getProperty("user.home") + File.separator + "Apex-client.jar";

}