const JobGrapeCollector = {
    timeout: undefined,
    blip: undefined,
    marker: undefined,
    colshape: undefined,
    vehicle: undefined
};

mp.events.add("time.remove.back.grapecollector", (player) => {
    try {
        if (JobGrapeCollector.timeout !== undefined) {
            clearTimeout(JobGrapeCollector.timeout);
            delete JobGrapeCollector.timeout;
        }
    } catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
let oshape = mp.colshapes.newSphere(-1853.86, 2093.4, 140.2, 1);
let marker;

mp.events.add('createJobGrapeCollectorRoom', (type) => {
    try {
        if (type === false)
            marker.destroy();
        else
            marker = mp.markers.new(20, new mp.Vector3(-1855.48, 2091.78, 140.36), 1, {
                visible: true,
                color: [255, 0, 0, 180],
                rotation: 180
            });
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});

mp.events.add('create.job.grapecollector.vehicle', (vehicle) => {
    try {
        JobGrapeCollector.vehicle = vehicle;
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('time.add.back.grapecollector', (time) => {
    try {
        if (JobGrapeCollector.timeout === undefined) {
            JobGrapeCollector.timeout = setTimeout(() => {
                mp.events.callRemote("leave.grapecollector.job");
            }, time);
        }
    } catch (err) {
        mp.game.graphics.notify(err);
        return;
    }
});
mp.events.add('create.job.grapecollector.mark', (posx, posy, posz, type) => {
    try {
        deleteData();
        if (type === true) {
            JobGrapeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
                alpha: 255,
                color: 1,
                name: "Пункт назначения"
            });
            JobGrapeCollector.blip.setRoute(true);
            JobGrapeCollector.blip.setRouteColour(1);
            JobGrapeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.3), 0.8, {
                visible: true,
                dimension: 0,
                color: [255, 0, 0, 180]
            });
            JobGrapeCollector.colshape = mp.colshapes.newSphere(posx, posy, posz, 1);
        }
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('createJobNeedGrapeCollectorMarkBlip', (posx, posy, posz) => {
    try {
        deleteData();
        JobGrapeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.4), 4, {
            visible: true,
            dimension: 0,
            color: [255, 0, 0, 110]
        });
        JobGrapeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
            alpha: 255,
            color: 1
        });
        JobGrapeCollector.blip.setRoute(true);
        JobGrapeCollector.blip.setRouteColour(1);
        JobGrapeCollector.colshape = mp.colshapes.newSphere(posx, posy, posz, 2);
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});
mp.events.add('createJobGrapeCollectorMarkBlip', (type, type2, posx, posy, posz, rotation) => {
    try {
        deleteData();
        if (type === true) {
            JobGrapeCollector.marker = mp.markers.new(1, new mp.Vector3(posx, posy, posz - 1.2), 1, {
                visible: true,
                dimension: 0,
                color: [255, 0, 0, 180]
            });
            JobGrapeCollector.blip = mp.blips.new(1, new mp.Vector3(posx, posy, posz), {
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
    if (JobGrapeCollector.marker !== undefined) {
        JobGrapeCollector.marker.destroy();
        JobGrapeCollector.blip.setRoute(false);
        JobGrapeCollector.blip.destroy();
        delete JobGrapeCollector.marker, delete JobGrapeCollector.blip;
    }
    if (JobGrapeCollector.colshape !== undefined) {
        JobGrapeCollector.colshape.destroy();
        delete JobGrapeCollector.colshape;
    }
}
/*mp.events.add('create.job.grapecollector.load', () => {
    try {
        if (!JobGrapeCollector.vehicle) {
            mp.game.graphics.notify("~r~ТРАНСПОРТ НЕ ОБНАРУЖЕН!");
            return;
        }
        deleteData();
        let bonePos = JobGrapeCollector.vehicle.getWorldPositionOfBone(JobGrapeCollector.vehicle.getBoneIndexByName('platelight'));
        JobGrapeCollector.blip = mp.blips.new(1, new mp.Vector3(bonePos.x, bonePos.y), {
            alpha: 255,
            color: 1,
            name: "Пункт назначения"
        });
        JobGrapeCollector.marker = mp.markers.new(1, new mp.Vector3(bonePos.x, bonePos.y, bonePos.z - 1.25), 1.35, {
            visible: true,
            dimension: 0,
            color: [255, 0, 0, 180]
        });
        JobGrapeCollector.colshape = mp.colshapes.newSphere(bonePos.x, bonePos.y, bonePos.z, 1.35);
    } catch (err) {
        mp.game.graphics.notify("~r~" + err);
        return;
    }
});*/
mp.events.add('startGrapeCollectorUnload', () => {
    if (JobGrapeCollector.vehicle) {
        JobGrapeCollector.vehicle.freezePosition(true);
        setTimeout(() => {
            if (JobGrapeCollector.vehicle) JobGrapeCollector.vehicle.freezePosition(false);
            mp.events.callRemote("stop.grapecollector.unload");
        }, 7000);
    }
});
mp.events.add('playerEnterColshape', (shape) => {

    if (shape === oshape){
      mp.events.call("prompt.show", `Нажмите <span>Е</span> для взаимодействия`);
    }

    //else if (shape === JobGrapeCollector.colshape) mp.events.callRemote("use.grapecollectorfunctions.job");
});
mp.events.add('client.job.cursor.cancel', () => {
    mp.gui.cursor.show(false, false);
});
mp.keys.bind(0x45, false, function() { // E key
    if (mp.players.local.getVariable("keydownevariable") != undefined) {
        if (mp.game.gameplay.getDistanceBetweenCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, -1853.86, 2093.4, 140.2) < 4) {
            mp.gui.cursor.show(true, true);
            if (mp.players.local.getVariable("keydownevariable") == true){
                mp.events.call("choiceMenu.show", "accept_job_grapecollector", {
                    name: "уволиться с Виноградника?"
                });
              }
            else{
                mp.events.call("choiceMenu.show", "accept_job_grapecollector", {
                    name: "устроиться на Виноградник?"
                });
              }
        }
    }
});
