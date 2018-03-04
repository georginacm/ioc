
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
            click () { require('electron').shell.openExternal('https://ioc.xtec.cat') }
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
    }

  }
