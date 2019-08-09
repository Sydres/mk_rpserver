const RentInfo = {
   timer: undefined
}

mp.blips.new(494, new mp.Vector3(-170.63, -1433.45, 30.89), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});
mp.blips.new(494, new mp.Vector3(-155.93, -179.8, 43.78), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});
mp.blips.new(494, new mp.Vector3(-2971.72, 350.49, 14.77), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});
mp.blips.new(494, new mp.Vector3(-155.93, -179.8, 43.78), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});
mp.blips.new(494, new mp.Vector3(-1629.9, -973.2, 13), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});
mp.blips.new(494, new mp.Vector3(-290, - 747.8, 34), {color: 60,name: "Аренда транспорта", shortRange: true, scale: 0.7});



mp.events.add('start.rent.vehicle', (price) => {
 let vehicle = mp.players.local.vehicle;
 if (vehicle) {
   vehicle.freezePosition(true);
   let items = [{ text: "Арендовать транспорт - $" + price }, { text: "Закрыть" } ];
   mp.events.call("selectMenu.setSpecialItems", "rent_faggio", items);
   mp.events.call("selectMenu.show", "rent_faggio");
 }
});

mp.events.add('stop.rent.vehicle', (type) => { stopRent(type); });

function stopRent(status) {
  let vehicle = mp.players.local.vehicle;
  mp.events.call("selectMenu.hide", "rent_faggio");
  if (vehicle) {
    vehicle.freezePosition(false);
    if (status) mp.players.local.taskLeaveVehicle(vehicle.handle, 16);
  }
}

mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
	if (menuName === "rent_faggio") {
    if (itemName === "Закрыть") {
      stopRent(true);
      mp.events.call("selectMenu.hide", "rent_faggio");
    } else {
      mp.events.call("selectMenu.hide", "rent_faggio");
      mp.events.callRemote("rent.vehicle.faggio");
    }
	}
});
mp.events.add('control.rent.vehicle.time', (time) => {
  if (time === 0) {
    if (RentInfo.timer !== undefined) {
      clearTimeout(RentInfo.timer);
      delete RentInfo.timer;
    }
    return;
  }

  if (RentInfo.timer === undefined) {
    RentInfo.timer = setTimeout(() => {
      mp.events.callRemote("delete.vehicle.faggio.rent");
    }, time);
  }
});
