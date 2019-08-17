// Дополнительный элементы: player.jobubildercloth - статус ( одет / не одет ), player.money - деньги, player.emoney - деньги, которые накапливается при сдаче коробки, player.random_bush - отметка полученного значения.

const JobGrapeCollector = {
    joinjob: mp.colshapes.newSphere(-1855, 2092.3, 140.32, 1.0),
    cloth_col: mp.colshapes.newSphere(-1853.21, 2087.8, 140, 1.0),
    basket_col: mp.colshapes.newSphere(-1877, 2094.7, 140.3, 1.0),
    storage_col: mp.colshapes.newSphere(-1880.14, 2094.97,140.44, 1.0),
    storage: 1000,
    grapes: [10, 15],
    place_1: new mp.Vector3(382.85, 2909.74, 49.30), // Самосвал
    place_2: new mp.Vector3(1225.19, 1880.16, 78.89), // Цемент
    place_3: new mp.Vector3(-147.62, -952.64, 21.28), // Самосвал
    place_4: new mp.Vector3(-175.82, -1029.61, 27.27), // Цемент
    out_grapes_positions: [


      { x: -1824.36, y: 2144.16, z: 119.17, xs: 2.0, floor: 3 },
      { x: -1852.31, y: 2150.52, z: 119.54, xs: 2.0, floor: 3 },
      { x: -1853.57, y: 2141.55, z: 123.37, xs: 2.0, floor: 3 },
      { x: -1886.94, y: 2135.40, z: 125.98, xs: 2.0, floor: 3 },
      { x: -1867.87, y: 2133.92, z: 127.26, xs: 2.0, floor: 3 },
      { x: -1894.66, y: 2127.12, z: 127.57, xs: 2.0, floor: 3 },

      { x: -1859.71, y: 2128.57, z: 128.80, xs: 1.5, floor: 2 },
      { x: -1810.48, y: 2125.49, z: 129.30, xs: 1.5, floor: 2 },
      { x: -1837.11, y: 2122.13, z: 129.56, xs: 1.2, floor: 2 },
      { x: -1837.95, y: 2117.66, z: 131.74, xs: 1.2, floor: 2 },
      { x: -1874.73, y: 2121.40, z: 131.88, xs: 1.5, floor: 2 },
      { x: -1822.35, y: 2120.57, z: 132.19, xs: 1.5, floor: 2 },

      { x: -1873.36, y: 2120.67, z: 132.20, xs: 1.0, floor: 1 },
      { x: -1882.07, y: 2116.85, z: 133.28, xs: 1.0, floor: 1 },
      { x: -1831.75, y: 2115.36, z: 133.71, xs: 1.0, floor: 1 },
      { x: -1867.15, y: 2111.10, z: 135.02, xs: 1.0, floor: 1 },
      { x: -1882.01, y: 2107.76, z: 136.66, xs: 1.0, floor: 1 },
      { x: -1884.23, y: 2102.84, z: 138.05, xs: 1.0, floor: 1 }




    ],
    out_grapes_colshapes: [

        mp.colshapes.newSphere(-1824.36, 2144.16, 119.17, 1.0),
        mp.colshapes.newSphere(-1852.31, 2150.52, 119.54, 1.0),
        mp.colshapes.newSphere(-1853.57, 2141.55, 123.37, 1.0),
        mp.colshapes.newSphere(-1886.94, 2135.40, 125.98, 1.0),
        mp.colshapes.newSphere(-1867.87, 2133.92, 127.26, 1.0),
        mp.colshapes.newSphere(-1894.66, 2127.12, 127.57, 1.0),

        mp.colshapes.newSphere(-1859.71, 2128.57, 128.80, 1.0),
        mp.colshapes.newSphere(-1810.48, 2125.49, 129.30, 1.0),
        mp.colshapes.newSphere(-1837.11, 2122.13, 129.56, 1.0),
        mp.colshapes.newSphere(-1837.95, 2117.66, 131.74, 1.0),
        mp.colshapes.newSphere(-1874.73, 2121.404, 131.88, 1.0),
        mp.colshapes.newSphere(-1822.35, 2120.57, 132.19, 1.0),

        mp.colshapes.newSphere(-1873.36, 2120.67, 132.20, 1.0),
        mp.colshapes.newSphere(-1882.07, 2116.85, 133.28, 1.0),
        mp.colshapes.newSphere(-1831.75, 2115.36, 133.71, 1.0),
        mp.colshapes.newSphere(-1867.15, 2111.10, 135.02, 1.0),
        mp.colshapes.newSphere(-1882.01, 2107.76, 136.66, 1.0),
        mp.colshapes.newSphere(-1884.23, 2102.84, 138.05, 1.0)
    ]
};

mp.blips.new(285, new mp.Vector3(-1853.86, 2093.4, 140.2), { color: 61, name: 'Виноградник', scale: 1, shortRange: true}); // Блип на карте
//let jobcolshape = mp.colshapes.newSphere(-1855, 2092.3, 140.32, 1.5); // Колшейп для устройства на работу
//let jobclothcolshape = mp.colshapes.newSphere(-1853.21, 2087.8, 140, 1.0); // Колшейп для раздевалки
//let jobstorage_grape_itemcolshape = mp.colshapes.newSphere(-1877, 2094.7, 140.3, 1.0); // Колшейп корзины
//let grape_storage = mp.colshapes.newSphere(-1880.14, 2094.97,140.44, 1.0); // Колшейп точки сброса


mp.events.add("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 11) {
        if (player.jobubildercloth == true) {
            player.utils.info("Вы уволились из виногдарника!");
            if (player.emoney > 0) {
              player.utils.setMoney(player.money + player.emoney);
              player.utils.info(`Заработано: ${player.emoney}$`);
            }
            delete player.emoney;
            player.utils.changeJob(0);
            delete player.jobubildercloth;
            delete player.random_bush;
            delete player.body.denyUpdateView;
            player.call('createJobGrapeCollectorRoom', [false]);
            player.call("createJobGrapeCollectorMarkBlip", [ false, false, -1855.48, 2091.78,140.36 ]);
        }
        stopJobDay(player);
        leaveJob(player);
    }
});
mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
  if (player.job === 11) {
    leaveVehicle(player);
  }
});

mp.events.add("playerStartEnterVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
   if (player.random_bush > -1 && !player.grapecollector) stopBringingBasket(player);
});

function stopBringingBasket(player) {

  //player.random_bush = getRandomNumber(0, 17);
  //player.notify("Соберите виноград с ~g~ " + JobGrapeCollector.out_grapes_positions[player.random_bush].floor + "-го ~w~яруса!");
  //player.call("createJobGrapeCollectorMarkBlip", [ true, true, JobGrapeCollector.out_grapes_positions[player.random_bush].x, JobGrapeCollector.out_grapes_positions[player.random_bush].y, JobGrapeCollector.out_grapes_positions[player.random_bush].z ]);
  player.random_bush = JobGrapeCollector.out_grapes_positions[player.random_bush].floor;

  if (player.inside_basket == 5) {

    player.random_bush = getRandomNumber(0, 17);
    player.notify("Соберите виноград с ~g~ " + JobGrapeCollector.out_grapes_positions[player.random_bush].floor + "-го ~w~яруса!");
    player.call("createJobGrapeCollectorMarkBlip", [ true, true, JobGrapeCollector.out_grapes_positions[player.random_bush].x, JobGrapeCollector.out_grapes_positions[player.random_bush].y, JobGrapeCollector.out_grapes_positions[player.random_bush].z ]);

  }

if(player.inside_basket > 0 ){
  player.inside_basket = 0;
  player.grape_money = 0;

  player.utils.putObject();

  player.utils.takeObject("prop_fruit_basket");

  player.utils.warning(`Вы рассыпали весь виноград! Корзина пуста.`);
}else{

  player.utils.putObject();

  player.utils.takeObject("prop_fruit_basket");

  player.utils.info(`Не прыгайте, иначе можете рассыпать виноград, когда заполните корзину!`);
}



}
module.exports.stopBringingBasket = stopBringingBasket;

mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try
    {
        if (shape == JobGrapeCollector.joinjob && !player.vehicle) {
            if (player.job === 11){

              player.call("setGrapeJobStatus", [ true ]);
              }
            else{

              player.call("setGrapeJobStatus", [ false ]);
              }
        }
        if (shape == JobGrapeCollector.cloth_col && player.job === 11) {
          if (player.random_bush != -1) {
              player.utils.error("Сначала отнесите полную корзину на склад!");
              return;
          }

          if (player.jobubildercloth == true) {
              player.utils.success("Вы закончили рабочий день!");
              leaveVehicle(player);
          }
          changeGrapeCollectorClothes(player);
        }
        else if (shape == JobGrapeCollector.basket_col && player.jobubildercloth == true && player.job === 11) takeBasketGrapeCollector(player);

          else if (shape == JobGrapeCollector.storage_col && player.jobubildercloth == true && player.job === 11) leaveBasketGrapeCollector(player);

        else if (JobGrapeCollector.out_grapes_colshapes.includes(shape) && player.job === 11 && player.jobubildercloth == true) {
            let num = JobGrapeCollector.out_grapes_colshapes.indexOf(shape);
            if (num == player.random_bush){
              putBasketGrapeCollector(player);
              setTimeout(() => {

              }, 10000);
            }
        }
    }
    catch (err){
        console.log(err);
        return;
    }
});

mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    if (shape === JobGrapeCollector.joinjob) player.setVariable("keydownevariable", undefined);
});

mp.events.add("job.grapecollector.agree", (player) => {
    try
    {
        if (player.job !== 0 && player.job !== 11) {
          player.utils.warning("Вы уже где-то работаете!");
          return;
        }
        if (player.job === 11) {
            if (player.jobubildercloth == true) {
                player.utils.error("Вы ещё не закончили рабочий день!");
                return;
            }

            leaveJob(player);
        } else {
            player.utils.success("Вы устроились на виноградник!");
            player.utils.warning("Теперь переоденьтесь для начала рабочего дня!");
            player.utils.changeJob(11);
            player.random_bush = -1;
            player.call('createJobGrapeCollectorRoom', [true]); //создание раздевалки
            player.setVariable("keydownevariable", true);
        }
    } catch (err){
        console.log(err);
        return;
    }
});
function leaveJob(player) {
  player.utils.info("Вы уволились с виноградника!");
  leaveVehicle(player);
  player.call('createJobGrapeCollectorRoom', [false]);
  player.setVariable("keydownevariable", false);
  player.utils.putObject();
  player.utils.changeJob(0);
  delete player.jobubildercloth;
  delete player.random_bush;
  delete player.jobgrapecollectorveh;
}

function mustTakeBasketLoader(player, id) {
  let pos = id === 3347205726 ? JobGrapeCollector.place_1 : JobGrapeCollector.place_2;
  player.call("create.job.grapecollector.mark", [ pos.x, pos.y, pos.z, true ]);
  player.utils.error("Направляйтесь на место загрузки!");
}
function stopBringingLoad(player) {
  let pos = player.grapecollector.model === 3347205726 ? JobGrapeCollector.place_1 : JobGrapeCollector.place_2;
  player.call("create.job.grapecollector.mark", [ pos.x, pos.y, pos.z, true ]);
}
module.exports.stopBringingLoad = stopBringingLoad;
mp.events.add("use.grapecollectorfunctions.job", (player) => {
    try
    {
      if (!player.grapecollector) return;
      if (player.job === 11) {
        let vehicle = player.grapecollector;
        if (!player.vehicle) {
          if (player.getVariable("attachedObject")) {
             player.utils.putObject();
             vehicle.grapecollectornum++;
             player.notify("Заполнено: ~r~" + vehicle.grapecollectornum + " ~w~из ~r~" + vehicle.grapecollectormax);
             if (vehicle.grapecollectornum === vehicle.grapecollectormax) {
               player.utils.success("Направляйтесь на место разгрузки!");
               let pos = vehicle.model === 3347205726 ? JobGrapeCollector.place_3 : JobGrapeCollector.place_4;
               player.call("createJobNeedGrapeCollectorMarkBlip", [ pos.x, pos.y, pos.z ]);
               return;
             }
             let pos = vehicle.model === 3347205726 ? JobGrapeCollector.place_1 : JobGrapeCollector.place_2;
             player.call("create.job.grapecollector.mark", [ pos.x, pos.y, pos.z, true ]);
          } else {
             if (player.dist(vehicle.position) > 500) return player.utils.error("Ваш транспорт слишком далеко!");
             if (player.dist(vehicle.position) < 9) return player.utils.error("Ваш транспорт слишком близко!");
             let box = vehicle.model === 3347205726 ? "prop_bucket_01a" : "prop_feed_sack_01";
             player.utils.takeObject(box);
             player.utils.warning("Положите ящик в задний сектор транспорта!");
             player.call("create.job.grapecollector.load");
          }
        } else {
          if (vehicle.grapecollectornum === vehicle.grapecollectormax) {
            player.utils.info("Дождитесь окончания разгрузки!");
            player.call("startGrapeCollectorUnload");
          }
        }
      }
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("stop.grapecollector.unload", (player) => {
    try
    {
      if (!player.grapecollector) return;
      if (player.job === 11) {
        let vehicle = player.grapecollector;
        if (vehicle.grapecollectormax < 1) return player.utils.error("Вы не загружены!");
        if (vehicle.grapecollectornum === vehicle.grapecollectormax) {
          let mon = vehicle.model === 3347205726 ? mp.economy["build_salary_sec"].value : mp.economy["build_salary_third"].value;
          let money = (vehicle.grapecollectornum * mp.economy["build_salary_box"].value) + mon;
          if (isNaN(money)) return player.utils.error("Вы не загружены!");
          player.utils.success("Разгрузка заврешена, вы заработали $" + money);
          player.utils.setMoney(player.money + money);
          vehicle.grapecollectormax = getRandomNumber(JobGrapeCollector.grapes[0], JobGrapeCollector.grapes[1]);
          vehicle.grapecollectornum = 0;
          mustTakeBasketLoader(player, vehicle.model);
        }
      }
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("playerEnterVehicle", function playerEnterVehicleHandler(player, vehicle, seat) {
	if (vehicle.owner === -11 && player.job === 11 && seat === -1) {
     if (player.jobubildercloth) {
       let skill = player.jobSkills[11 - 1];
       if (skill < 50) {
          player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 50);
          player.removeFromVehicle();
          return;
       }

       if (player.grapecollector && player.grapecollector !== vehicle)  {
          player.utils.error("Вы уже заняли одно транспортное средство!");
          player.removeFromVehicle();
          return;
       }

       if (vehicle.grapecollector) {
         if (!mp.players.exists(vehicle.grapecollector)) delete vehicle.grapecollector;
         else if (vehicle.grapecollector.grapecollector != vehicle) delete vehicle.grapecollector;
         else if (vehicle.grapecollector !== player) {
           player.utils.error("Данный транспорт уже занят другим рабочим!");
           player.removeFromVehicle();
         } else {
           player.call("time.remove.back.grapecollector");
         }
         return;
       }
       if (!haveLicense(player, vehicle)) return;
       if (mp.convertMinutesToLevelRest(player.minutes).level < 2) {
         player.removeFromVehicle();
         return player.utils.error("Вы не достигли 2 уровня!");
       }
       vehicle.grapecollector = player;
       player.grapecollector = vehicle;
       player.call("create.job.grapecollector.vehicle", [ vehicle ]);
       mustTakeBasketLoader(player, vehicle.model);
       vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
       vehicle.grapecollectormax = getRandomNumber(JobGrapeCollector.grapes[0], JobGrapeCollector.grapes[1]);
       vehicle.grapecollectornum = 0;

         vehicle.position = new mp.Vector3(1208.90, 1887.56, 77.66);
         vehicle.rotation = 360;
         player.grapecollector.model; 3347205726 - самосвал | 475220373 - бетон

     } else {
       player.utils.error("Вы не начали рабочий день!");
       player.removeFromVehicle();
     }
  }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
  if (vehicle.owner === -11 && player.job === 11) {
    if (vehicle === player.grapecollector) {
      if (player.dist(JobGrapeCollector.place_1) < 100 || player.dist(JobGrapeCollector.place_2) < 100) {
         player.call("time.add.back.grapecollector", [300000]);
         player.utils.warning("У вас есть 5 минут, чтобы вернуться в транспорт.");
         return;
      }
      player.call("time.add.back.grapecollector", [60000]);
      player.utils.warning("У вас есть 1 минута, чтобы вернуться в транспорт.");
    }
  }
});
mp.events.add("leave.grapecollector.job", (player) => {
    try
    {
      changeGrapeCollectorClothes(player);
      leaveJob(player);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
function leaveVehicle(player) {
  let vehicle = player.grapecollector;
  delete player.grapecollector;
  if (vehicle) {
    // forks_attach
    if (vehicle === vehicle) player.removeFromVehicle();
    player.call("time.remove.back.grapecollector");
    setTimeout(() => {
      try {
        vehicle.repair();
        vehicle.dimension = 0;
        vehicle.position = vehicle.spawnPos;
        vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        vehicle.engine = false;
        delete vehicle.grapecollector, delete vehicle.grapecollectormax, delete vehicle.grapecollectornum;
      } catch (err) {
          console.log(err);
          return;
      }
    }, 200);
  }
};

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var sqlId in docs) {
        if (docs[sqlId].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

function stopJobDay(player) {
  if (player.jobubildercloth === false){
     return;
  }
  player.jobubildercloth = false;
  player.call("createJobGrapeCollectorMarkBlip", [ false, false, -1855.48, 2091.78,140.36 ]);
  // Возвращаем одежду персонажа
  delete player.body.denyUpdateView;
  player.body.loadItems();
}
function changeGrapeCollectorClothes(player){
    try
    {
        if (player.job !== 11) return;
        if (player.jobubildercloth == true) {
          stopJobDay(player);
        } else {
            if (player.vehicle) return;
            player.utils.success("Вы начали рабочий день!");
            player.jobubildercloth = true;
            player.call("createJobGrapeCollectorMarkBlip", [ true, false, -1877, 2094.7, 140.3 ]);

            mp.labels.new("Взять корзину", new mp.Vector3(-1861, 2088.33, 142.84),
                {
                    los: true,
                    font: 2,
                    drawDistance: 20,
                });

            player.body.clearItems();
            player.body.denyUpdateView = true;
            if (player.sex === 1) {
              // Одежда мужская
              player.setClothes(3, 134, 0, 2);
              player.setClothes(4, 90, 0, 2);
              player.setClothes(6, 85, 0, 2);
              player.setClothes(8, 30, 1, 2);
              player.setClothes(11, 127, 0, 2);
              player.setProp(0, 13, 2); //- Голова ( наушники )
            } else {
              // Одежда женская
              player.setClothes(3, 85, 0, 2);
              player.setClothes(4, 45, 0, 2);
              player.setClothes(6, 26, 0, 2);
              player.setClothes(8, 30, 1, 2);
              player.setClothes(11, 120, 0, 2);
              player.setProp(0, 13, 2);// player.setProp(0, 0, 0); - Голова ( наушники )
            }
        }
    } catch (err){
        console.log(err);
        return;
    }
};

function leaveBasketGrapeCollector (player){
  try
  {

    if( player.inside_basket == 5){

      player.utils.putObject();

      var skill = player.jobSkills[11 - 1] + 1;
      let money = player.grape_money;
      player.utils.setMoney(player.money + money);

      player.utils.setJobSkills(11, skill);
      if (player.jobSkills[11 - 1] === 150){
        player.utils.warning("Вам открыта 2 ступень работы!");
      } else{
        player.notify("Опыт работы: ~g~" + skill + " ~w~из ~g~" + 50);
      }
      player.utils.success(`Заработано: ${money}$`);

      player.inside_basket = 0;
      player.grape_money = 0;

      player.call("createJobGrapeCollectorMarkBlip", [ true, false, -1877, 2094.7, 140.3 ] );

      mp.labels.new("Взять корзину", new mp.Vector3(-1861, 2088.33, 142.84),
          {
              los: true,
              font: 2,
              drawDistance: 20,
          });

      player.random_bush = -1;

    }



  } catch (err){
      console.log(err);
      return;
  }
}

function takeBasketGrapeCollector(player){
    try
    {
      player.inside_basket = 0;
      player.grape_money = 0;
        if (player.random_bush == -1) {

          player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 15);

          setTimeout(() => {


          //player.utils.putObject();
          player.utils.takeObject("prop_fruit_basket");
          player.random_bush = getRandomNumber(0, 17);
          player.notify("Соберите виноград с ~r~ " + JobGrapeCollector.out_grapes_positions[player.random_bush].floor + "-го ~w~яруса!");
          player.call("createJobGrapeCollectorMarkBlip", [ true, true, JobGrapeCollector.out_grapes_positions[player.random_bush].x, JobGrapeCollector.out_grapes_positions[player.random_bush].y, JobGrapeCollector.out_grapes_positions[player.random_bush].z ]);

          }, 2000);
        }
        else {
            player.utils.error("Вы ещё не заполнили эту корзину!");
        }

    } catch (err){
        console.log(err);
        return;
    }
};

function putBasketGrapeCollector(player){
    try
    {
      var before = player.inside_basket;
      player.grape_money += Math.round(mp.economy["build_salary"].value * JobGrapeCollector.out_grapes_positions[player.random_bush].xs);
        //player.utils.putObject();
        if(player.inside_basket < 5){

          player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 15);

          setTimeout(() => {
            player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 15);
          }, 2000);

          setTimeout(() => {
            player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 15);
          }, 4000);

          setTimeout(() => {
            player.stopAnimation();

            player.inside_basket += 1;

            if(player.inside_basket > before+1){
              player.inside_basket = before + 1;
            }

            var percent = Math.round(100 - (100 - 20 * player.inside_basket));
            var percent = Math.round(100 - (100 - 20 * player.inside_basket));
            if(percent>100){
              percent = 100;
            }
            player.notify("Корзина заполнена на  ~g~ " + percent + "%");


            if(player.inside_basket >= 5){
              player.notify("Отнесите виноград на ~g~ СКЛАД ~w~!");

              mp.labels.new("СКЛАД", new mp.Vector3(-1880.14, 2094.97,142.44),
                  {
                      los: true,
                      font: 2,
                      drawDistance: 20,
                  });

              player.call("createJobGrapeCollectorMarkBlip", [ true, false, -1880.14, 2094.97,140.44 ] );
              player.random_bush = -1;
            }
          else{
            player.random_bush = getRandomNumber(0, 17);
            while(player.random_bush == player.previous){
              player.random_bush = getRandomNumber(0, 17);
            }
            player.notify("Соберите виноград с ~g~ " + JobGrapeCollector.out_grapes_positions[player.random_bush].floor + "-го ~w~яруса!");
            player.call("createJobGrapeCollectorMarkBlip", [ true, true, JobGrapeCollector.out_grapes_positions[player.random_bush].x, JobGrapeCollector.out_grapes_positions[player.random_bush].y, JobGrapeCollector.out_grapes_positions[player.random_bush].z ]);
          }
        }, 6000);
      }



    } catch (err){
        console.log(err);
        return;
    }
};

function getRandomNumber(min, max) {
    try
    {
        return Math.floor(Math.random() * (max - min)) + min;
    } catch (err){
        console.log(err);
        return -1;
    }
}
