const { resolve} = require('path')
const { app, Menu, Tray } = require('electron')

let tray = null
app.whenReady().then(() => {
  tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'View Settings', type: 'radio' },
    { label: 'This is checked', type: 'radio', checked: true },
    { label: 'Exit', type: 'radio' }    
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})
