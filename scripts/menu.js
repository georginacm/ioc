
const { Menu} = require('electron')

module.exports = {
  renderMenu: function() {
    const template = [
      {
        label: 'Test_Georgina',
        submenu: [
          {
          label: 'web ioc',
          click () { require('electron').shell.openExternal('https://ioc.xtec.cat') }
          },
          {role: 'selectall'}
        ]
      },
      {
        label: 'Activitats',
        submenu: [
          {role: 'reload'},
          {role: 'forcereload'},
          {role: 'toggledevtools'}
        ]
      },
      {
        label: 'Contacte',
        submenu: [
          {
            label: 'Learn More',
            click () {openAboutWindow();}
          }
        ]
      }
    ]

      // Edit menu
      template[1].submenu.push(
        {type: 'separator'},
        {
          label: 'Speech',
          submenu: [
            {role: 'startspeaking'},
            {role: 'stopspeaking'}
          ]
        }
      )

      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)

      var newWindow = null;

      function openAboutWindow() {
         if (newWindow) {
          newWindow.focus()
          return;
        }

        newWindow = new BrowserWindow({
         height: 185,
         resizable: false,
         width: 270,
         title: "",
         minimizable: false,
         fullscreenable: false
        });

        newWindow.loadURL('file://' + __dirname + 'templates/contacte.html');

         newWindow.on('closed', function () {
         newWindow = null;
        });
      }

    }

}
