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
function recallPolice(player) {
  if (getPoliceCall(player.name, "client") !== undefined) cancelPolice (player, true);{
  player.notifyWithPicture('Оператор', 'Downtown Cab Co.', 'Вы ~y~вызвали ~w~полицию, ожидайте!', 'CHAR_police');
  }

  else callPolice(player);
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
