
/* Хранение информации
  player.job - работа ( 1 = такси)
  player.officer - статус работы;
  vehicle.officer - хранение владельца такси.
*/
const PoliceContain = {
    orders: []
}
// Класс для заказа
class PoliceOrder {
    constructor(client_name, officer_name, position, distance, status, money) {
        this.client_name = client_name;
        this.officer_name = officer_name;
        this.start_position = position;
        this.distance = distance;
        this.status = status;
        this.money = money;
    }
}
// Получаем все из нужного класса
function getPoliceOrder(name, type) {
    try {
        for (let i = 0; i < PoliceContain.orders.length; i++) {
            if (type === "client") {
                if (PoliceContain.orders[i].client_name == name) {
                    return PoliceContain.orders[i];
                }
            } else {
                if (PoliceContain.orders[i].officer_name == name) {
                    return PoliceContain.orders[i];
                }
            }
        }
        return undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}
// Подгружаем ТС
console.log("[Faction] Police in Los Santos started!");

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}
// Ивенты
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
    if (vehicle.owner === -1 && seat === -1) {
        if (player.faction === 2) {
            if (vehicle.officer !== undefined) {
                if (!mp.players.exists(vehicle.officer)) delete vehicle.officer;
                else if (vehicle.officer.officer != vehicle) delete vehicle.officer;
                else if (vehicle.officer === player) {
                    player.call("control.police.menu", [true, true]);
                } else {
                    player.removeFromVehicle();
                    player.notifyWithPicture('Помощь', 'Downtown Cab Co.', 'Данный транспорт уже занят.', 'CHAR_police');
                }
            } else {
                if (player.officer !== undefined) {
                    player.removeFromVehicle();
                    player.notifyWithPicture('Помощь', 'Downtown Cab Co.', 'У вас уже есть используемый транспорт.', 'CHAR_police');
                } else {
                    if (!haveLicense(player, vehicle)) return;
                    player.call("show.police.menu", [player.name]);
                    player.notifyWithPicture('Подсказка', 'Downtown Cab Co.', 'Нажмите ~y~"ВОЙТИ" ~w~, чтобы начать рабочий день. \n( ~y~alt ~w~- курсор )', 'CHAR_police');
                    vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                }
            }
        }
    } else if (vehicle.owner === -1 && seat !== -1) {
        if (vehicle.officer === undefined) {
            player.removeFromVehicle();
            player.notifyWithPicture('Помощь', 'Downtown Cab Co.', 'Данное ~y~такси ~w~не работает.', 'CHAR_police');
        } else {
            if (player.officer === undefined) {
                if (getPoliceOrder(vehicle.officer.name, "officer") !== undefined && getPoliceOrder(vehicle.officer.name, "officer").client_name !== player.name) {
                    player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Таксист на данный момент ~y~занят ~w~другим заказом.', 'CHAR_police');
                } else {
                    let torder = getPoliceOrder(player.name, "client");
                    if (torder !== undefined)
                    if (torder.officer_name !== vehicle.officer.name) cancelpolice(player, false);
                    player.notifyWithPicture('Помощь', 'Downtown Cab Co.', 'Поставьте метку на карте, куда хотите отправиться и нажмите ~y~E', 'CHAR_police');
                }
            } else {
                player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Сначала ~y~закончите ~w~рабочий день.', 'CHAR_police');
            }
        }
    }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
    if (vehicle.owner === -1) {
        if (vehicle.officer !== undefined && player.officer === undefined) {
            if (player.goingpolice === vehicle.officer) { // && player.goingpolice.vehicle === vehicle
                let order = getPoliceOrder(player.name, "client");
                let dist = vehicle.dist(order.start_position);
                let money;
                if (order.distance < dist)
                    money = 0;
                else
                    money = Math.trunc((order.distance - dist) * mp.economy["police_salary"].value);

                if ((order.distance + dist) <= (order.distance + 30)) money = order.money;
                player.goingpolice.call("close.police.control");
                player.goingpolice.call("cancel.police.order", [false]);
                PoliceContain.orders.splice(PoliceContain.orders.indexOf(order), 1);
                player.utils.setMoney(player.money - money);
                player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы заплатили ~g~$' + money, 'CHAR_police');
                player.goingpolice.utils.setMoney(player.goingpolice.money + money);
                player.goingpolice.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Клиент заплатил ~g~$' + money, 'CHAR_police');
                player.goingpolice.call("update.police.stats", [money]);
                delete player.goingpolice;
            }
        }
        if (player.job === 1) {
            if (vehicle.officer === undefined && player.officer === undefined) {
                player.call("close.police.menu");
            } else if (vehicle.officer == player) {
                player.notifyWithPicture('Помощь', 'Downtown Cab Co.', 'У вас есть ~y~60 ~w~секунд, чтобы вернуться в транспорт.', 'CHAR_police');
                player.call("control.police.menu", [false, false]);
            }
        }
    }
});
mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
    let vehicle = player.vehicle;
    if (vehicle) {
        if (vehicle.officer !== undefined) {
            if (vehicle.officer === player) {
                endJobDay(player);
            }
        }
    }
    if (getPoliceOrder(player.name, "client")) cancelpolice(player, false);
});
mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try {
        if (!player.vehicle && shape == jobpoliceColShape) player.call("getpoliceJobStatus", [player.job === 1 ? true : false]);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    try {
        if (shape == jobpoliceColShape) player.call("getpoliceJobStatus", ["cancel"]);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("set.police.waypoint", (player, tname, dist, x, y, z) => {
    try {
        let money = Math.trunc(dist * mp.economy["police_salary"].value);
        if (player.money < money) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'У вас недостаточно денег! Стоимость поездки ~g~$' + money, 'CHAR_police');
            return;
        }
        let order = getPoliceOrder(player.name, "client");
        if (order === undefined) {
            let order = new PoliceOrder(player.name, tname, new mp.Vector3(x, y, z), dist, true, money);
            PoliceContain.orders.push(order);
        } else {
            order.money = money;
            order.distance = dist;
            order.status = true;
            order.start_position = new mp.Vector3(x, y, z);
            order.officer_name = tname;
        }

        let target = getPlayerByName(tname);
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'В конце поездки вы заплатите ~g~$' + money, 'CHAR_police');
        if (target !== undefined) {
            target.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Отвезите клиента в требуемую точку.', 'CHAR_police');
            target.call("get.police.waypoint.driver", [player.name, money, new mp.Vector3(x, y, z)]);
        }
        player.goingpolice = target;
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("cancels.police.order", (player) => {
    try {
        let order = getPoliceOrder(player.name, "officer");
        if (order !== undefined) {
            player.call("cancel.police.order", [false]);
            let target = getPlayerByName(order.client_name);
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы отменили вызов.', 'CHAR_police');
            if (target !== undefined) {
                target.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Таксист отменил вызов.', 'CHAR_police');
                target.call("delete.police.player.colshape");
            }
            if (order.status === false) {
                PoliceContain.orders.splice(PoliceContain.orders.indexOf(order), 1);
            } else {
                target.removeFromVehicle();
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("end.police.day", (player) => {
    try {
        endJobDay(player);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("job.police.agree", (player) => {
    try {
        if (player.job !== 0 && player.job !== 1) {
            player.utils.warning("Вы уже где-то работаете!");
            return;
        }

        if (player.job === 1) {
            if (player.officer !== undefined) {
                player.utils.error("Вы не можете уволиться из таксопарка, не закончив рабочий день!");
                return;
            }
            player.utils.success("Вы уволились из таксопарка!");
            player.utils.changeJob(0);
            player.call("setpoliceJobStatus", [false]);
            delete player.officer;
        } else {
            if (mp.convertMinutesToLevelRest(player.minutes).level < 2) return player.utils.error("Вы не достигли 2 уровня!");
            player.utils.success("Вы устроились в таксопарк!");
            player.utils.changeJob(1);
            player.notifyWithPicture('Подсказка', 'Downtown Cab Co.', 'Выберите свободный транспорт и начинайте рабочий день.', 'CHAR_police');
            player.call("setpoliceJobStatus", [true]);
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("accept.police.day", (player) => {
    try {
        let pveh = player.vehicle;
        if (player.job === 1 && pveh) {
            if (pveh.owner === -1) {
                pveh.officer = player;
                player.officer = pveh;
                cancelpolice(player, false);
                player.notifyWithPicture('Информация', 'Downtown Cab Co.', 'Вы ~y~начали ~w~рабочий день.', 'CHAR_police');
                player.call("update.police.orders", [JSON.stringify(PoliceContain.orders)]);
                player.call("update.police.interval", [true]);
                return;
            }
        }

        player.notifyWithPicture('Информация', 'Downtown Cab Co.', 'Вы ~r~не можете ~w~начать рабочий день.', 'CHAR_police');
        player.call("close.police.menu");
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("key.police.down.numpad_zero", (player) => {
    try {
        let vehicle = player.vehicle;
        if (vehicle) {
            if (vehicle.owner === -1 && player.seat === -1) {
                if (player.officer !== undefined && player.officer === player.vehicle) player.call("displace.police.menu");
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("key.police.down.e", (player) => {
    try {
        if (player.vehicle) {
            if (player.vehicle.owner === -1) {
                if (player.officer === undefined) {
                    if (player.vehicle.officer !== undefined && player.vehicle.officer.vehicle !== undefined) {
                        let order = getPoliceOrder(player.vehicle.officer.name, "officer");
                        if (order === undefined || (order !== undefined && order.status === false && order.client_name === player.name)) {
                            player.call("get.police.waypoint", [player.vehicle.officer.name]);
                        } else {
                            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Таксист на данный момент ~y~занят ~w~другим заказом.', 'CHAR_police');
                        }
                    }
                } else {
                    if (player.seat !== -1) {
                        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Сначала закончите рабочий день.', 'CHAR_police');
                        return;
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("update.police.orders", (player) => {
    try {
        player.call("update.police.orders", [JSON.stringify(PoliceContain.orders)]);
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("enter.police.colshape", (player) => {
    try {
        if (player.job === 1) {
            if (player.vehicle === player.officer && player.vehicle !== undefined) {
                let order = getPoliceOrder(player.name, "officer");
                if (order !== undefined) {
                    let target = getPlayerByName(order.client_name);
                    player.call("destroy.police.colshape");
                    if (target === undefined) return;

                    player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~приехали ~w~на точку вызова, ожидайте клиента.', 'CHAR_police');
                    target.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Таксист ~y~приехал ~w~на точку вызова, садитесь в транспорт.', 'CHAR_police');
                    target.call("delete.police.player.colshape");
                }
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("cancel.police.player", (player) => {
    try {
        cancelpolice(player, false);
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вызов был отменен, вы ~y~слишком далеко ~w~от места вызова!', 'CHAR_police');
    } catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("take.police.order", (player, name) => {
    try {
        let target = getPlayerByName(name);
        if (getPoliceOrder(name, "client") === undefined) return;

        if (getPoliceOrder(player.name, "officer") !== undefined) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Сначала завершите предыдущий заказ.', 'CHAR_police');
            return;
        }

        if (target === undefined || getPoliceOrder(name, "client").officer_name !== undefined) {
            deleteOrderForofficer(name);
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Данный заказ невозможно принять.', 'CHAR_police');
            return;
        }


        getPoliceOrder(name, "client").officer_name = player.name;
        deleteOrderForofficer(target.name);
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы приняли вызов ~y~' + name, 'CHAR_police');
        target.notifyWithPicture('Оператор', 'Downtown Cab Co.', '~y~' + player.name + ' ~w~принял ваш вызов.', 'CHAR_police');
        player.call("accept.police.order", [target.position]);
    } catch (err) {
        console.log(err);
        return;
    }
});
// Functions
function recallpolice(player) {
  if (getPoliceOrder(player.name, "client") !== undefined) cancelpolice(player, true);
  else callpolice(player);
}

function callpolice(player) {
    try {
        if (player.vehicle) {
            if (player.vehicle.owner === -1) {
                player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~не можете ~w~вызвать такси!', 'CHAR_police');
                return;
            }
        }

        if (getPoliceOrder(player.name, "client") !== undefined) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы уже вызвали такси, ожидайте!', 'CHAR_police');
            return;
        }

        if (player.officer !== undefined) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~не можете ~w~вызвать такси!', 'CHAR_police');
            return;
        }

        let order = new PoliceOrder(player.name, undefined, player.position, undefined, false, 0);
        PoliceContain.orders.push(order);
        player.call("create.police.player.colshape");
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~вызвали ~w~такси, ожидайте!', 'CHAR_police');
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Если ~y~отойдёте ~w~слишком далеко от места вызова, вызов будет отменен!', 'CHAR_police');
    } catch (err) {
        console.log(err);
        return;
    }
}
function cancelpolice(player, type) {
    try {
        let order = getPoliceOrder(player.name, "client");

        if (order === undefined) {
            if (type) player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы не вызывали такси!', 'CHAR_police');
            return;
        }

        if (player.vehicle && type) {
            if (player.vehicle.owner === -1) {
                player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~не можете ~w~отменить заказ!', 'CHAR_police');
                return;
            }
        }

        if (order.officer_name !== undefined) {
            let target = getPlayerByName(order.officer_name);
            if (player.vehicle) {
                if (player.vehicle === target.officer && target.officer === undefined) {
                    if (type) player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~не можете ~w~отменить заказ!', 'CHAR_police');
                    return;
                }
            }
            if (target !== undefined) {
                target.notifyWithPicture('Оператор', 'Downtown Cab Co.', '~y~' + player.name + ' ~w~отменил заказ.', 'CHAR_police');
                target.call("close.police.control");
                target.call("cancel.police.order", [false]);
            }
        }

        PoliceContain.orders.splice(PoliceContain.orders.indexOf(order), 1);
        deleteOrderForofficer(player.name);
        player.call("delete.police.player.colshape");
        if (type) player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~отменили ~w~вызов!', 'CHAR_police');
    } catch (err) {
        console.log(err);
        return;
    }
}

function getPlayerByName(name) {
    try {
        let rplayer;
        mp.players.forEach(
            (player, id) => {
                if (player.name === name) rplayer = player;
            },
        );
        return rplayer;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

function deleteOrderForofficer(name) {
    try {
        mp.players.forEach(
            (player, id) => {
                if (player.job === 1 && player.officer !== undefined) {
                    player.call('remove.police.order', [name]);
                }
            },
        );
    } catch (err) {
        console.log(err);
        return;
    }
}

function endJobDay(player) {
    try {
        if (player.job === 1) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~закончили ~w~рабочий день!', 'CHAR_police');
            player.call("close.police.menu");
            player.call("cancel.police.order", [true]);
            if (player.officer !== undefined) {
                let order_tax = getPoliceOrder(player.name, "officer");
                if (order_tax !== undefined) {
                    let target = getPlayerByName(order_tax.client_name);
                    if (target !== undefined) {
                        target.notifyWithPicture('Оператор', 'Downtown Cab Co.', '~y~' + player.name + ' ~w~отменил заказ.', 'CHAR_police');
                        PoliceContain.orders.splice(PoliceContain.orders.indexOf(order_tax), 1);
                        if (target.vehicle === player.officer) player.removeFromVehicle();
                    }
                }

                let vehicle = player.officer;
                if (player.vehicle === vehicle) player.removeFromVehicle();
                removeAllHumansFromVehicle(vehicle);
                delete vehicle.officer;
                delete player.officer;

                setTimeout(() => {
                    try {
                        vehicle.repair();
                        vehicle.dimension = 0;
                        vehicle.position = vehicle.spawnPos;
                        vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
                        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
                        vehicle.engine = false;
                    } catch (err) {
                        console.log(err);
                    }
                }, 200);
            }
        }
    } catch (err) {
        console.log(err);
        return;
    }
}

function removeAllHumansFromVehicle(vehicle) {
    try {
        let array = vehicle.getOccupants();
        for (let i = 0; i < array.length; i++) array[i].removeFromVehicle();
    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports.callpolice = callpolice;
module.exports.cancelpolice = cancelpolice;
module.exports.recallpolice = recallpolice;
