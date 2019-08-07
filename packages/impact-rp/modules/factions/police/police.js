mp.events.add("take.police.order", (player, name) => {
    try {
        let target = getPlayerByName(name);
        if (getPoliceOrder(name, "client") === undefined) return;

        if (getPoliceOrder(player.name, "officer") !== undefined) {
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Сначала завершите предыдущий заказ.', 'CHAR_CALL911');
            return;
        }

        if (target === undefined || getPoliceOrder(name, "client").officer_name !== undefined) {
            deleteOrderForofficer(name);
            player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Данный заказ невозможно принять.', 'CHAR_CALL911');
            return;
        }


        getPoliceCall(name, "client").officer_name = player.name;
        deleteOrderForofficer(target.name);
        player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы приняли вызов ~y~' + name, 'CHAR_CALL911');
        target.notifyWithPicture('Оператор', 'Downtown Cab Co.', '~y~' + player.name + ' ~w~принял ваш вызов.', 'CHAR_CALL911');
        player.call("accept.police.order", [target.position]);
    } catch (err) {
        console.log(err);
        return;
    }
});
"police.addCall": (player, text) =>  {
      // TODO: Проверка на наличие мобилы.

      mp.players.forEach((rec) => {
          if (mp.factions.isPoliceFaction(rec.faction)) {
              rec.call(`tablet.police.addCall`, [{
                  id: player.id,
                  name: player.name,
                  pos: player.position,
                  message: text
              }]);
          }
      });
      player.policeCallTime = new Date().getTime();
      player.utils.success(`Вызов отправлен!`);
  },
    //cancelPolice(player, true);
  //}
//  else{
    //callPolice(player);
  //}



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
module.exports.recallPolice = recallPolice;
"police.addCall": (player, text) => {
    // TODO: Проверка на наличие мобилы.

    mp.players.forEach((rec) => {
        if (mp.factions.isPoliceFaction(rec.faction)) {
            rec.call(`tablet.police.addCall`, [{
                id: player.id,
                name: player.name,
                pos: player.position,
                message: text
            }]);
        }
    });
    player.policeCallTime = new Date().getTime();
    player.utils.success(`Вызов отправлен!`);
},
"police.acceptCall": (player, playerId) => {
    if (!mp.factions.isPoliceFaction(player.faction)) return player.utils.error(`Вы не сотрудник порядка!`);
    var rec = mp.players.at(playerId);
    if (!rec) return player.utils.error(`Гражданин не найден!`);
    if (!rec.policeCallTime) return player.utils.error(`Вызов принят/отклонен другим полицейским!`);

    mp.players.forEach((rec) => {
        if (mp.factions.isPoliceFaction(rec.faction)) {
            rec.call(`tablet.police.removeCall`, [playerId]);
        }
    });

    delete rec.policeCallTime;
    player.utils.success(`Вызов принят!`);
    rec.utils.success(`${player.name} принял Ваш вызов!`);
},
