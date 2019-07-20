const chokidar = require('chokidar')
const fs = require('fs')

let watcher = chokidar.watch(['client_packages', 'packages'])
let players = {}

mp.events.addCommand('hot', player => {
  if (players[player.id]) {
    delete players[player.id]
    console.log('Hot loader: ' + player.name + ' stopped listening')
    player.outputChatBox('[Hot Loader] Stopped Clientside')
    return
  }
  player.outputChatBox('[Hot Loader] Started Clientside')
  console.log('Hot loader: ' + player.name + ' is listening')
  players[player.id] = player
})

let lastEval
watcher.on('ready', () => {
  console.log('Hot loader is watching :)')
  watcher.on('change', path => {
    if (!path.endsWith('.js')) return
    // 1 sec delay to fix sending code twice
    if (lastEval && (Date.now() - lastEval) < 1000 ) return
    lastEval = Date.now()
    // console.log(`Hot loader: Changed >> ${path}`)
    
    let file = fs.readFileSync(path)
    file = file.toString()
    
    if (path.substring(0, 8) == 'packages') {
      try {
        eval(file)
      } catch (error) {
        console.error('[HOT LOADER] Error: ', error)
      }
      return
    }

    if (Object.keys(players).length <= 0) return

    // remove comments
    let reg = new RegExp(/(?:(?:^|\s)\/\/(.+?)$)|(?:\/\*(.*?)\*\/)/, 'gms')
    file = file.replace(reg, '')
    // remove let, const to prevent errors
    file = file.replace(/let|const/g,'')

    // remove doublicate variables
    let script = ''
    let re = /\s?((\$|_)?\w+) =/g
    while ((arr = re.exec(file)) !== null) {
      script+= `try {
        if (${arr[1]}) {
          if (${arr[1]}.destroy)
            ${arr[1]}.destroy()
          ${arr[1]} = null
        }
      } catch (e) {}\n`
    }
    script += file
    Object.keys(players).forEach(id => {
      players[id].eval(script)
    })
  })
})