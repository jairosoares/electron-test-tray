const { resolve} = require('path')
const { app, Menu, Tray, systemPreferences, nativeTheme, clipboard, BrowserWindow, Notification, dialog } = require('electron');
const { get } = require('http');

const clippings = [];

const getIcon = () => {
  return process.platform === 'win32' ? 'iconTemplate@2x.ico' : 'iconTemplate.png';
};

let mainTray = {}
app.whenReady().then(() => {
  mainTray = new Tray(resolve(__dirname, 'assets', getIcon()))
  
  testEnvironment(mainTray);

  //Hides the dock icon if running on macOS
  if (app.dock) app.dock.hide();
  updateMenu(mainTray);
})

function testEnvironment(tray = mainTray) {
  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  } else {
    console.log('platform is ' + process.platform);
  }
  console.log('isDarkMode ? ' + nativeTheme.shouldUseDarkColors)
};

function updateMenu(tray = mainTray) {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Dialog', click() {openDialog()} },
    { label: 'View Settings', type: 'radio' },
    { label: 'Add Clipping', click() {addClipping(tray)}},
    { type: 'separator'},
    ...clippings.map((clipping, index) => ({label: clipping})),
    { type: 'separator'},
    
    { label: 'This is checked', type: 'radio', checked: true },
    { label: 'Exit', type: 'radio', click() {app.quit()} }    
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}

function openDialog() {
  //Ok! Select files
  dialog.showOpenDialog({properties: ['openFile', 'multiSelectioins']});
}

function addClipping (tray = mainTray) {
  const clipping = clipboard.readText();
  clippings.push(clipping);

  if (Notification.isSupported()) {
    let iconAddress = resolve(__dirname, 'assets', getIcon())
    const notif = {
      title:'Hi People',
      body: 'This is my clipboard:\n\n' + clipping,
      icon: iconAddress
    };
    const myNotification = new Notification(notif, {
      body:clipping
    });
    myNotification.on("click", () => {
      console.log('Im here!');
    });
    myNotification.show();
  }

  updateMenu(tray);
  return clipping;
};