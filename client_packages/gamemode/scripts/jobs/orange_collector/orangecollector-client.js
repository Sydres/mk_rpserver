const JobOrangeCollector = {
    timeout: undefined,
    blip: undefined,
    marker: undefined,
    keyDownE: undefined,
    colshape: undefined,
    vehicle: undefined
};



mp.events.add("time.remove.back.orangecollector", (player) => {
    try {
        if (JobOrangeCollector.timeout !== undefined) {
            clearTimeout(JobOrangeCollector.timeout);
            delete JobOrangeCollector.timeout;
        }
    } catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
let oshape = mp.colshapes.newSphere(404.85, 6526.34, 27.68, 1);
let marker;

mp.events.add('createJobOrangeCollectorRoom', (type) => {
    try {
        if (type === false)
            marker.destroy();
        else
            marker = mp.markers.new(20, new mp.Vector3(400.39, 6524.21, 27.84), 1, {
                visible: true,
                color: [255, 0, 0, 180],
                rotation: 180
            });
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});

mp.events.add('create.job.orangecollector.vehicle', (vehicle) => {
    try {
        JobOrangeCollector.vehicle = vehicle;
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('time.add.back.orangecollector', (time) => {
    try {
        if (JobOrangeCollector.timeout === undefined) {
            JobOrangeCollector.timeout = setTimeout(() => {
                mp.events.callRemote("leave.orangecollector.job");
            }, time);
        }
    } catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('create.job.orangecollector.mark', (posx, posy, posz, type) => {
    try {
        deleteData();
        if (type === true) {
            JobOrangeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
                alpha: 255,
                color: 1,
                name: "Пункт назначения"
            });
            JobOrangeCollector.blip.setRoute(true);
            JobOrangeCollector.blip.setRouteColour(1);
            JobOrangeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.3), 0.8, {
                visible: true,
                dimension: 0,
                color: [255, 0, 0, 180]
            });
            JobOrangeCollector.colshape = mp.colshapes.newSphere(posx, posy, posz, 1);
        }
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('createJobNeedOrangeCollectorMarkBlip', (posx, posy, posz) => {
    try {
        deleteData();
        JobOrangeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.4), 4, {
            visible: true,
            dimension: 0,
            color: [255, 0, 0, 110]
        });
        JobOrangeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
            alpha: 255,
            color: 1
        });
        JobOrangeCollector.blip.setRoute(true);
        JobOrangeCollector.blip.setRouteColour(1);
        JobOrangeCollector.colshape = mp.colshapes.newSphere(posx, posy, posz, 2);
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('createJobOrangeCollectorMarkBlip', (type, type2, posx, posy, posz, rotation) => {
    try {
        deleteData();
        if (type === true) {
            JobOrangeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.2), 1, {
                visible: true,
                dimension: 0,
                color: [255, 0, 0, 180]
            });
            JobOrangeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
                alpha: 255,
                color: 38
            });
        }
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});

function deleteData() {
    if (JobOrangeCollector.marker !== undefined) {
        JobOrangeCollector.marker.destroy();
        JobOrangeCollector.blip.setRoute(false);
        JobOrangeCollector.blip.destroy();
        delete JobOrangeCollector.marker, delete JobOrangeCollector.blip;
    }
    if (JobOrangeCollector.colshape !== undefined) {
        JobOrangeCollector.colshape.destroy();
        delete JobOrangeCollector.colshape;
    }
}
mp.events.add('create.job.orangecollector.load', () => {
    try {
        if (!JobOrangeCollector.vehicle) {
            mp.game.graphics.notify("~r~ТРАНСПОРТ НЕ ОБНАРУЖЕН!");
            return;
        }
        deleteData();
        let bonePos = JobOrangeCollector.vehicle.getWorldPositionOfBone(JobOrangeCollector.vehicle.getBoneIndexByName('platelight'));
        JobOrangeCollector.blip = mp.blips.new(1, new mp.Vector3(bonePos.x, bonePos.y), {
            alpha: 255,
            color: 1,
            name: "Пункт назначения"
        });
        JobOrangeCollector.marker = mp.markers.new(1, new mp.Vector3(bonePos.x, bonePos.y, bonePos.z - 1.25), 1.35, {
            visible: true,
            dimension: 0,
            color: [255, 0, 0, 180]
        });
        JobOrangeCollector.colshape = mp.colshapes.newSphere(bonePos.x, bonePos.y, bonePos.z, 1.35);
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('startOrangeCollectorUnload', () => {
    if (JobOrangeCollector.vehicle) {
        JobOrangeCollector.vehicle.freezePosition(true);
        setTimeout(() => {
            if (JobOrangeCollector.vehicle) JobOrangeCollector.vehicle.freezePosition(false);
            mp.events.callRemote("stop.orangecollector.unload");
        }, 7000);
    }
});

mp.events.add('setOrangeJobStatus', (status) => {

  JobOrangeCollector.keyDownE = status;

 });
mp.events.add('getOrangeJobStatus', (status) => {
  if (status !== "cancel") {
    JobOrangeCollector.keyDownE = status;

  } else {
    JobOrangeCollector.keyDownE = null;
  }
});

mp.events.add('playerEnterColshape', (shape) => {

    if (shape === oshape){
      mp.events.call("prompt.show", `Нажмите <span>Е</span> для взаимодействия`);

    }

    else if (shape === JobOrangeCollector.colshape){
      mp.events.callRemote("use.orangecollectorfunctions.job");
  }
});

mp.events.add('client.job.cursor.cancel', () => {
    mp.gui.cursor.show(false, false);
});

/*mp.keys.bind(0x45, false, function() { // E key
        if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -1855, 2092.3, 140.32) < 4) {
        if (shape === oshape){
            mp.gui.cursor.show(true, true);
            if (mp.players.local.getVariable("keydownevariable") == true){
                mp.events.call("choiceMenu.show", "accept_job_orangecollector", {
                    name: "уволиться с Виноградника?"
                });
              }
            else{
                mp.events.call("choiceMenu.show", "accept_job_orangecollector", {
                    name: "устроиться на Виноградник?"
                });
              }
        }
      }
});*/

mp.keys.bind(0x45, false, function () { // E key
	if (JobOrangeCollector.keyDownE !== undefined) {
		if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 404.85, 6526.34, 27.68, true) < 4) {
      mp.gui.cursor.show(true, true);
      if (JobOrangeCollector.keyDownE === true) {
          mp.events.call("choiceMenu.show", "accept_job_orangecollector", {name: "уволиться с Апельсиновой фермы?"});
      } else {
					mp.events.call("choiceMenu.show", "accept_job_orangecollector", {name: "устроиться на Апельсиноввую ферму?"});
      }
		}
	}
});
