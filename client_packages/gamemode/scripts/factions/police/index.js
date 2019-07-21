let CEF; // ЗАМЕНИТЬ ПРИ ПОДКЛЮЧЕНИИ К БРАУЗЕРУ.
let keyDownE;
const PoliceUI = {
  type: true,
  colshape: undefined,
  colshape_go: undefined,
  marker: undefined,
  blip: undefined,
  blacklist: [],
  orders_today: 0,
  earnmoney_today: 0,
  stats_today: 0,
  interval: undefined,
  time: -1
};
const Natives = {
    GET_BLIP_INFO_ID_ITERATOR: '0x186E5D252FA50E7D',
    GET_FIRST_BLIP_INFO_ID: '0x1BEDE233E6CD2A1F',
    GET_BLIP_INFO_ID_TYPE: '0xBE9B0959FFD0779B',
    GET_NEXT_BLIP_INFO_ID: '0x14F96AA50D6FBEA7',
    DOES_BLIP_EXIST: '0xA6DB27D19ECBB7DA',
};

mp.events.add('update.police.stats', (money) => {
 PoliceUI.orders_today++;
 PoliceUI.earnmoney_today += money;
 if (CEF) CEF.execute(`app.updatepoliceStats(${PoliceUI.orders_today}, ${PoliceUI.earnmoney_today});`);
});

mp.events.add('clear.police.filtration', (type) => {
  PoliceUI.blacklist = [];
  mp.game.ui.notifications.showWithPicture('Информация', 'LSPD', 'Вы ~y~сбросили ~w~фильтрацию заказов.', 'CHAR_police');
});

mp.events.add('add.police.filtration', (name) => {
  if (!PoliceUI.blacklist.includes(name)) {
    PoliceUI.blacklist.push(name);
    mp.game.ui.notifications.showWithPicture('Информация', 'LSPD',  '~y~' + name + ' ~w~добавлен в фильтрацию и не будет отображаться.', 'CHAR_police');
  }
});

mp.events.add('show.police.menu', (name) => {
  if (!CEF) {
    CEF = mp.browsers.new("package://gamemode/scripts/jobs/police/ui/panel/index.html");
    CEF.execute(`app.setNameForPassword('${name}')`);
  }
});
mp.events.add('control.police.menu', (type, del) => {
  if (type === true) {
    if (CEF) CEF.execute("document.getElementById('app').style.display = 'block';");
    if (del === true) PoliceUI.time = -1;
  } else {
    if (CEF) CEF.execute("document.getElementById('app').style.display = 'none';");
    if (del === false) PoliceUI.time = 10; // 10 * 6 = 60 секунд
  }
});

mp.events.add('cant.finish.police.job', () => {
  mp.game.ui.notifications.showWithPicture('Информация', 'LSPD', 'Вы ~y~не завершили ~w~вызов.', 'CHAR_police');
});

mp.events.add('remove.police.order', (name) => {
  //if (CEF) CEF.execute(`app.removeFrompolice('${name}')`);
});

mp.events.add('take.police.order', (name) => {
  mp.events.callRemote('take.police.order', name);
});

mp.events.add('accept.police.order', (pos) => {
    PoliceUI.blip = mp.blips.new(280, pos, { alpha: 255, color: 5, scale: 0.9, name: "Клиент" });
    PoliceUI.blip.setRoute(true);
    PoliceUI.blip.setRouteColour(5);
    PoliceUI.colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 6);
    PoliceUI.marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
    if (CEF) {
       CEF.execute(`app.setselect();`);
       CEF.execute(`app.startTime(${0}, "${getZoneName(pos)}");`);
    }
});

mp.events.add('destroy.police.colshape', () => {
  if (PoliceUI.blip !== undefined) {
    PoliceUI.blip.setRoute(false);
    PoliceUI.blip.destroy();
  }
  if (PoliceUI.colshape_go !== undefined) PoliceUI.colshape_go.destroy();
  if (PoliceUI.marker !== undefined) PoliceUI.marker.destroy();
  if (PoliceUI.colshape !== undefined) PoliceUI.colshape.destroy();
  delete PoliceUI.blip, delete PoliceUI.colshape, delete PoliceUI.colshape_go, delete PoliceUI.marker;
});
mp.keys.bind(0x60, false, function () { // Numpad 0
  if (mp.players.local.vehicle && PoliceUI.interval !== undefined) mp.events.callRemote("key.police.down.numpad_zero");
});
mp.events.add('playerEnterColshape', (shape) => {
    if (shape === PoliceUI.colshape && mp.players.local.vehicle) mp.events.callRemote("enter.police.colshape");
});
mp.events.add('playerExitColshape', (shape) => {
    if (shape === PoliceUI.colshape_go) mp.events.callRemote("cancel.police.player");
});
mp.events.add('displace.police.menu', () => {
  if (PoliceUI.type === true) {
     if (CEF) CEF.execute('app.policePage = false;');
     PoliceUI.type = false;
  } else {
     if (CEF) CEF.execute('app.policePage = true;');
     PoliceUI.type = true;
  }
});
mp.events.add('delete.police.player.colshape', () => {
  if (PoliceUI.colshape_go !== undefined) PoliceUI.colshape_go.destroy();
  if (PoliceUI.marker !== undefined) PoliceUI.marker.destroy();
  delete PoliceUI.colshape_go, delete PoliceUI.marker;
});
mp.events.add('create.police.player.colshape', () => {
  PoliceUI.marker = mp.markers.new(1, new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z - 1.5), 12, { visible: true, dimension: 0, color: [255, 0, 0, 40] });
  PoliceUI.colshape_go = mp.colshapes.newSphere(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 6);
});

mp.keys.bind(0x60, false, function () { // Numpad 0
  if (mp.players.local.vehicle && PoliceUI.interval !== undefined) mp.events.callRemote("key.police.down.numpad_zero");
});

mp.events.add('displace.police.menu', () => {
  if (PoliceUI.type === true) {
     if (CEF) CEF.execute('app.policePage = false;');
     PoliceUI.type = false;
  } else {
     if (CEF) CEF.execute('app.policePage = true;');
     PoliceUI.type = true;
  }
});
mp.events.add('update.police.interval', (type) => {
  if (type) {
    PoliceUI.interval = setInterval(() => {
       mp.events.callRemote("update.police.orders");
       if (PoliceUI.time > -1) PoliceUI.time--;
       if (PoliceUI.time === 0) {
         mp.events.callRemote("end.police.day");
         return;
       }
    }, 6000);
  } else {
    clearInterval(PoliceUI.interval);
    delete PoliceUI.interval;
  }
});
mp.events.add('update.police.orders', (arr) => {
  let orders = JSON.parse(arr);
  orders.forEach(function(order) {
    if (!PoliceUI.blacklist.includes(order.client_name) && order.policest_name === undefined) {
      if (CEF) CEF.execute(`app.addTopolice('${order.client_name}', '${Math.trunc(mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, order.start_position.x, order.start_position.y, order.start_position.z, true))}');`);
    }
  });
});
mp.events.add('get.police.waypoint.driver', (name, money, pos) => {
     if (PoliceUI.blip !== undefined) {
       PoliceUI.blip.setRoute(false);
       PoliceUI.blip.destroy();
     }
     if (PoliceUI.colshape !== undefined) PoliceUI.colshape.destroy();
     if (PoliceUI.marker !== undefined) PoliceUI.marker.destroy();
     delete PoliceUI.blip, delete PoliceUI.colshape, delete PoliceUI.marker;

     PoliceUI.blip = mp.blips.new(1, pos, { alpha: 255, color: 5, scale: 0.9, name: "Пункт назначения" });
     PoliceUI.blip.setRoute(true);
     PoliceUI.blip.setRouteColour(5);

     if (CEF) CEF.execute(`app.setInfo("${name}", ${money}, "${getZoneName(pos)}");`);
});
mp.events.add('get.police.waypoint', (target) => {
   let pos = getWaypointPosition();
   if (pos === undefined) {
     mp.game.ui.notifications.showWithPicture('Информация', 'LSPD', 'Вы ~y~не установили ~w~метку на карте.', 'CHAR_police');
     return;
   }

   let dist = mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, pos.x, pos.y, 0, false);
   mp.events.callRemote("set.police.waypoint", target, dist, pos.x, pos.y, mp.players.local.position.z);
});

mp.events.add('cancel.police.order', (type) => {
  if (PoliceUI.blip !== undefined) {
    PoliceUI.blip.setRoute(false);
    PoliceUI.blip.destroy();
  }
  if (PoliceUI.colshape !== undefined) PoliceUI.colshape.destroy();
  if (PoliceUI.marker !== undefined) PoliceUI.marker.destroy();
  if (PoliceUI.interval !== undefined && type === true) clearInterval(PoliceUI.interval);
  PoliceUI.type = true;
  if (type === true) {
    PoliceUI.blacklist = [];
    PoliceUI.time = -1;
  }
  delete PoliceUI.blip, delete PoliceUI.colshape, delete PoliceUI.marker, delete PoliceUI.interval;
});
mp.events.add('close.police.control', () => {
  if (CEF) CEF.execute(`app.deleteselect()`);
});
mp.events.add('close.police.menu', () => {
  if (CEF) {
    CEF.destroy();
    CEF = null;
    // При подключение в браузер удалять все бесполезное с меню.
  }
});

// Functions
function getZoneName(vector) {
    const getStreet = mp.game.pathfind.getStreetNameAtCoord(vector.x, vector.y, vector.z, 0, 0);
    zoneName = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(vector.x, vector.y, vector.z));
    streetName = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName);
    if (getStreet.crossingRoad && getStreet.crossingRoad !== getStreet.streetName) streetName += ` / ${mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad)}`;
    return zoneName;
}
function getWaypointPosition() {
    const interator = mp.game.invoke(Natives.GET_BLIP_INFO_ID_ITERATOR);
    let blipHandle = mp.game.invoke(Natives.GET_FIRST_BLIP_INFO_ID, interator);
    do {
        if (mp.game.invoke(Natives.GET_BLIP_INFO_ID_TYPE, blipHandle)) {
            return mp.game.ui.getBlipInfoIdCoord(blipHandle);
        }
        blipHandle = mp.game.invoke(Natives.GET_NEXT_BLIP_INFO_ID, interator);
    } while (mp.game.invoke(Natives.DOES_BLIP_EXIST, blipHandle));
    return undefined;
}
