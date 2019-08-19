// Дополнительный элементы: player.jobubildercloth - статус ( одет / не одет ), player.money - деньги, player.emoney - деньги, которые накапливается при сдаче коробки, player.random_tree - отметка полученного значения.

const JobOrangeCollector = {
    joinjob: mp.colshapes.newSphere(404.85, 6526.34, 27.68, 1.0),
    cloth_col: mp.colshapes.newSphere(400.39, 6524.21, 27.84, 1.0),
    basket_col: mp.colshapes.newSphere(402.46, 6504.57, 27.86, 1.0),
    storage_col: mp.colshapes.newSphere(396.81, 6507.24, 27.80, 1.0),
    storage: 1000,
    oranges: [10, 15],
    place_1: new mp.Vector3(382.85, 2909.74, 49.30), // Самосвал
    place_2: new mp.Vector3(1225.19, 1880.16, 78.89), // Цемент
    place_3: new mp.Vector3(-147.62, -952.64, 21.28), // Самосвал
    place_4: new mp.Vector3(-175.82, -1029.61, 27.27), // Цемент

    out_oranges_positions: [


      { x: 369.47, y: 6530.58, z: 28.43, xs: 1.5, floor: 2 },
      { x: 370.26, y: 6504.37, z: 28.39, xs: 1.5, floor: 2 },
      { x: 355.36, y: 6516.45, z: 28.20, xs: 1.5, floor: 2 },
      { x: 321.77, y: 6529.93, z: 29.20, xs: 1.5, floor: 2 },
      { x: 339.67, y: 6504.13, z: 28.70, xs: 1.5, floor: 2 },
      { x: 321.60, y: 6504.79, z: 29.23, xs: 1.5, floor: 2 },

      { x: 338.65, y: 6516.35, z: 28.94, xs: 1.5, floor: 2 },
      { x: 377.91, y: 6516.85, z: 28.37, xs: 1.5, floor: 2 },
      { x: 329.59, y: 6530.25, z: 28.61, xs: 1.2, floor: 2 }


    ],
    out_oranges_colshapes: [

        mp.colshapes.newSphere(369.47, 6530.58, 28.43, 1.0),
        mp.colshapes.newSphere(370.26, 6504.37, 28.39, 1.0),
        mp.colshapes.newSphere(355.36, 6516.45, 28.20, 1.0),
        mp.colshapes.newSphere(321.77, 6529.93, 29.20, 1.0),
        mp.colshapes.newSphere(339.67, 6504.13, 28.70, 1.0),
        mp.colshapes.newSphere(321.60, 6504.79, 29.23, 1.0),

        mp.colshapes.newSphere(338.65, 6516.35, 28.94, 1.0),
        mp.colshapes.newSphere(377.91, 6516.85, 28.37, 1.0),
        mp.colshapes.newSphere(329.59, 6530.25, 28.61, 1.0)
    ]
};

mp.blips.new(285, new mp.Vector3(404.85, 6526.34, 27.68), { color: 47, name: 'Апельсиновая плантация', scale: 1, shortRange: true}); // Блип на карте
//let jobcolshape = mp.colshapes.newSphere(404.85, 6526.34, 27.68); // Колшейп для устройства на работу
//let jobclothcolshape = mp.colshapes.newSphere(400.39, 6524.21, 27.84); // Колшейп для раздевалки
//let jobstorage_orange_itemcolshape = mp.colshapes.newSphere(402.46, 6504.57, 27.86); // Колшейп корзины
//let orange_storage = mp.colshapes.newSphere(396.81, 6507.24, 27.80); // Колшейп точки сброса


mp.events.add("playerDeath", function playerDeathHandler(player, reason, killer) {
    if (player.job === 12) {
        if (player.jobubildercloth == true) {
            player.utils.info("Вы уволились из Апельсиновой плантации!");
            if (player.emoney > 0) {
              player.utils.setMoney(player.money + player.emoney);
              player.utils.info(`Заработано: ${player.emoney}$`);
            }
            delete player.emoney;
            player.utils.changeJob(0);
            delete player.jobubildercloth;
            delete player.random_tree;
            delete player.body.denyUpdateView;
            player.call('createJobOrangeCollectorRoom', [false]);
            player.call("createJobOrangeCollectorMarkBlip", [ false, false, 404.85, 6526.34, 27.68 ]);
        }
        stopJobDay(player);
        leaveJob(player);
    }
});

mp.events.add("playerQuit", function playerQuitHandler(player, exitType, reason) {
  if (player.job === 12) {
    leaveVehicle(player);
  }
});

mp.events.add("playerStartEnterVehicle", function playerStartEnterVehicleHandler(player, vehicle, seat) {
   if (player.random_tree > -1 && !player.orangecollector) stopBringingBasket(player);
});

function stopBringingBasket(player) {

  //player.random_tree = getRandomNumber(0, 8);
  //player.notify("Соберите виноград с ~g~ " + JobOrangeCollector.out_oranges_positions[player.random_tree].floor + "-го ~w~яруса!");
  //player.call("createJobOrangeCollectorMarkBlip", [ true, true, JobOrangeCollector.out_oranges_positions[player.random_tree].x, JobOrangeCollector.out_oranges_positions[player.random_tree].y, JobOrangeCollector.out_oranges_positions[player.random_tree].z ]);
  //player.random_tree = JobOrangeCollector.out_oranges_positions[player.random_tree].floor;

  if (player.inside_basket >= 5) {

    player.random_tree = getRandomNumber(0, 8);
    player.call("createJobOrangeCollectorMarkBlip", [ true, true, JobOrangeCollector.out_oranges_positions[player.random_tree].x, JobOrangeCollector.out_oranges_positions[player.random_tree].y, JobOrangeCollector.out_oranges_positions[player.random_tree].z ]);

  }

if(player.inside_basket > 0 ){
  player.inside_basket = 0;
  player.orange_money = 0;

  player.utils.putObject();

  player.utils.takeObject("prop_fruit_basket");

  player.utils.warning(`Вы рассыпали все апельсины! Корзина пуста.`);
}else{

  player.utils.putObject();

  player.utils.takeObject("prop_fruit_basket");

  player.utils.info(`Не прыгайте, иначе можете рассыпать апельсины, когда заполните корзину!`);
}



}
module.exports.stopBringingBasket = stopBringingBasket;

mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
    try
    {
        if (shape == JobOrangeCollector.joinjob && !player.vehicle) {
            if (player.job === 12){

              player.call("setOrangeJobStatus", [ true ]);

                //player.setVariable("keydownevariable", true);
              }
            else{

              player.call("setOrangeJobStatus", [ false ]);

                //player.setVariable("keydownevariable", false);
              }
        }
        if (shape == JobOrangeCollector.cloth_col && player.job === 12) {
          if (player.random_tree != -1) {
              player.utils.error("Сначала отнесите полную корзину на склад!");
              return;
          }

          if (player.jobubildercloth == true) {
              player.utils.success("Вы закончили рабочий день!");
              leaveVehicle(player);
          }
          changeOrangeCollectorClothes(player);
        }
        else if (shape == JobOrangeCollector.basket_col && player.jobubildercloth == true && player.job === 12) takeBasketOrangeCollector(player);

          else if (shape == JobOrangeCollector.storage_col && player.jobubildercloth == true && player.job === 12) leaveBasketOrangeCollector(player);

        else if (JobOrangeCollector.out_oranges_colshapes.includes(shape) && player.job === 12 && player.jobubildercloth == true) {
            let num = JobOrangeCollector.out_oranges_colshapes.indexOf(shape);
            if (num == player.random_tree){
              putBasketOrangeCollector(player);
              setTimeout(() => {

              }, 8000);
            }
        }
    }
    catch (err){
        console.log(err);
        return;
    }
});

mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
    if (shape === JobOrangeCollector.joinjob) player.setVariable("keydownevariable", undefined);
});

mp.events.add("job.orangecollector.agree", (player) => {
    try
    {
        if (player.job !== 0 && player.job !== 12) {
          player.utils.warning("Вы уже где-то работаете!");
          return;
        }
        if (player.job === 12) {
            if (player.jobubildercloth == true) {
                player.utils.error("Вы ещё не закончили рабочий день!");
                return;
            }

            leaveJob(player);
        } else {
            player.utils.success("Вы устроились на апельсиновую ферму!");
            player.utils.warning("Теперь переоденьтесь для начала рабочего дня!");
            player.utils.changeJob(12);
            player.random_tree = -1;
            player.call('createJobOrangeCollectorRoom', [true]); //создание раздевалки
            player.setVariable("keydownevariable", true);
        }
    } catch (err){
        console.log(err);
        return;
    }
});
function leaveJob(player) {
  player.utils.info("Вы уволились с Апельсиновой плантации!");
  leaveVehicle(player);
  player.call('createJobOrangeCollectorRoom', [false]);
  player.setVariable("keydownevariable", false);
  player.utils.putObject();
  player.utils.changeJob(0);
  delete player.jobubildercloth;
  delete player.random_tree;
  delete player.joborangecollectorveh;
}

function mustTakeBasketLoader(player, id) {
  let pos = id === 3347205726 ? JobOrangeCollector.place_1 : JobOrangeCollector.place_2;
  player.call("create.job.orangecollector.mark", [ pos.x, pos.y, pos.z, true ]);
  player.utils.error("Направляйтесь на место загрузки!");
}
function stopBringingLoad(player) {
  let pos = player.orangecollector.model === 3347205726 ? JobOrangeCollector.place_1 : JobOrangeCollector.place_2;
  player.call("create.job.orangecollector.mark", [ pos.x, pos.y, pos.z, true ]);
}
module.exports.stopBringingLoad = stopBringingLoad;
mp.events.add("use.orangecollectorfunctions.job", (player) => {
    try
    {
      if (!player.orangecollector) return;
      if (player.job === 12) {
        let vehicle = player.orangecollector;
        if (!player.vehicle) {
          if (player.getVariable("attachedObject")) {
             player.utils.putObject();
             vehicle.orangecollectornum++;
             player.notify("Заполнено: ~r~" + vehicle.orangecollectornum + " ~w~из ~r~" + vehicle.orangecollectormax);
             if (vehicle.orangecollectornum === vehicle.orangecollectormax) {
               player.utils.success("Направляйтесь на место разгрузки!");
               let pos = vehicle.model === 3347205726 ? JobOrangeCollector.place_3 : JobOrangeCollector.place_4;
               player.call("createJobNeedOrangeCollectorMarkBlip", [ pos.x, pos.y, pos.z ]);
               return;
             }
             let pos = vehicle.model === 3347205726 ? JobOrangeCollector.place_1 : JobOrangeCollector.place_2;
             player.call("create.job.orangecollector.mark", [ pos.x, pos.y, pos.z, true ]);
          } else {
             if (player.dist(vehicle.position) > 500) return player.utils.error("Ваш транспорт слишком далеко!");
             if (player.dist(vehicle.position) < 9) return player.utils.error("Ваш транспорт слишком близко!");
             let box = vehicle.model === 3347205726 ? "prop_bucket_01a" : "prop_feed_sack_01";
             player.utils.takeObject(box);
             player.utils.warning("Положите ящик в задний сектор транспорта!");
             player.call("create.job.orangecollector.load");
          }
        } else {
          if (vehicle.orangecollectornum === vehicle.orangecollectormax) {
            player.utils.info("Дождитесь окончания разгрузки!");
            player.call("startOrangeCollectorUnload");
          }
        }
      }
    }
    catch (err) {
        console.log(err);
        return;
    }
});
mp.events.add("stop.orangecollector.unload", (player) => {
    try
    {
      if (!player.orangecollector) return;
      if (player.job === 12) {
        let vehicle = player.orangecollector;
        if (vehicle.orangecollectormax < 1) return player.utils.error("Вы не загружены!");
        if (vehicle.orangecollectornum === vehicle.orangecollectormax) {
          let mon = vehicle.model === 3347205726 ? mp.economy["build_salary_sec"].value : mp.economy["build_salary_third"].value;
          let money = (vehicle.orangecollectornum * mp.economy["build_salary_box"].value) + mon;
          if (isNaN(money)) return player.utils.error("Вы не загружены!");
          player.utils.success("Разгрузка заврешена, вы заработали $" + money);
          player.utils.setMoney(player.money + money);
          vehicle.orangecollectormax = getRandomNumber(JobOrangeCollector.oranges[0], JobOrangeCollector.oranges[1]);
          vehicle.orangecollectornum = 0;
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
	if (vehicle.owner === -12 && player.job === 12 && seat === -1) {
     if (player.jobubildercloth) {
       let skill = player.jobSkills[12 - 1];
       if (skill < 50) {
          player.notify("Опыт работы: ~r~" + skill + " ~w~из ~r~" + 50);
          player.removeFromVehicle();
          return;
       }

       if (player.orangecollector && player.orangecollector !== vehicle)  {
          player.utils.error("Вы уже заняли одно транспортное средство!");
          player.removeFromVehicle();
          return;
       }

       if (vehicle.orangecollector) {
         if (!mp.players.exists(vehicle.orangecollector)) delete vehicle.orangecollector;
         else if (vehicle.orangecollector.orangecollector != vehicle) delete vehicle.orangecollector;
         else if (vehicle.orangecollector !== player) {
           player.utils.error("Данный транспорт уже занят другим рабочим!");
           player.removeFromVehicle();
         } else {
           player.call("time.remove.back.orangecollector");
         }
         return;
       }
       if (!haveLicense(player, vehicle)) return;
       if (mp.convertMinutesToLevelRest(player.minutes).level < 2) {
         player.removeFromVehicle();
         return player.utils.error("Вы не достигли 2 уровня!");
       }
       vehicle.orangecollector = player;
       player.orangecollector = vehicle;
       player.call("create.job.orangecollector.vehicle", [ vehicle ]);
       mustTakeBasketLoader(player, vehicle.model);
       vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
       vehicle.orangecollectormax = getRandomNumber(JobOrangeCollector.oranges[0], JobOrangeCollector.oranges[1]);
       vehicle.orangecollectornum = 0;

         vehicle.position = new mp.Vector3(1208.90, 1887.56, 77.66);
         vehicle.rotation = 360;
         player.orangecollector.model; 3347205726 - самосвал | 475220373 - бетон

     } else {
       player.utils.error("Вы не начали рабочий день!");
       player.removeFromVehicle();
     }
  }
});
mp.events.add("playerExitVehicle", function playerExitVehicleHandler(player, vehicle) {
  if (vehicle.owner === -12 && player.job === 12) {
    if (vehicle === player.orangecollector) {
      if (player.dist(JobOrangeCollector.place_1) < 100 || player.dist(JobOrangeCollector.place_2) < 100) {
         player.call("time.add.back.orangecollector", [300000]);
         player.utils.warning("У вас есть 5 минут, чтобы вернуться в транспорт.");
         return;
      }
      player.call("time.add.back.orangecollector", [60000]);
      player.utils.warning("У вас есть 1 минута, чтобы вернуться в транспорт.");
    }
  }
});
mp.events.add("leave.orangecollector.job", (player) => {
    try
    {
      changeOrangeCollectorClothes(player);
      leaveJob(player);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
function leaveVehicle(player) {
  let vehicle = player.orangecollector;
  delete player.orangecollector;
  if (vehicle) {
    // forks_attach
    if (vehicle === vehicle) player.removeFromVehicle();
    player.call("time.remove.back.orangecollector");
    setTimeout(() => {
      try {
        vehicle.repair();
        vehicle.dimension = 0;
        vehicle.position = vehicle.spawnPos;
        vehicle.rotation = new mp.Vector3(0, 0, vehicle.spawnPos.h);
        vehicle.utils.setFuel(vehicle.vehPropData.maxFuel);
        vehicle.engine = false;
        delete vehicle.orangecollector, delete vehicle.orangecollectormax, delete vehicle.orangecollectornum;
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
  player.call("createJobOrangeCollectorMarkBlip", [ false, false, 404.85, 6526.34, 27.68 ]);
  // Возвращаем одежду персонажа
  delete player.body.denyUpdateView;
  player.body.loadItems();
}
function changeOrangeCollectorClothes(player){
    try
    {
        if (player.job !== 12) return;
        if (player.jobubildercloth == true) {
          stopJobDay(player);
        } else {
            if (player.vehicle) return;
            player.utils.success("Вы начали рабочий день!");
            player.jobubildercloth = true;
            player.call("createJobOrangeCollectorMarkBlip", [ true, false, 402.46, 6504.57, 27.86 ]);

            mp.labels.new("Взять корзину", new mp.Vector3(402.46, 6504.57, 27.86),
                {
                    los: true,
                    font: 2,
                    drawDistance: 20,
                });

            player.body.clearItems();
            player.body.denyUpdateView = true;
            if (player.sex === 1) {
              // Одежда мужская
              player.setClothes(3, 126, 0, 2);
              player.setClothes(4, 98, 0, 2);
              player.setClothes(6, 62, 0, 2);
              player.setClothes(8, 87, 1, 2);
              player.setClothes(11, 25, 0, 2);
              player.setProp(0, 94, 2); //- Голова ( наушники )
            } else {
              // Одежда женская
              player.setClothes(3, 136, 0, 2);
              player.setClothes(4, 101, 0, 2);
              player.setClothes(6, 68, 0, 2);
              player.setClothes(8, 0, 1, 2);
              player.setClothes(11, 76, 0, 2);
              player.setProp(0, 93, 2);
              // player.setProp(0, 0, 0); - Голова ( наушники )
            }
        }
    } catch (err){
        console.log(err);
        return;
    }
};

function leaveBasketOrangeCollector (player){
  try
  {

    if( player.inside_basket >= 5){

      player.utils.putObject();

      let skill = player.jobSkills[12 - 1] + 1;
      let money = player.orange_money;
      player.utils.setMoney(player.money + money);

      player.utils.setJobSkills(12, skill);
      if (player.jobSkills[12 - 1] === 150){
        player.utils.warning("Вам открыта 2 ступень работы!");
      } else{
        player.notify("Опыт работы: ~g~" + skill + " ~w~из ~g~" + 50);
      }
      player.utils.success(`Заработано: ${money}$`);

      player.inside_basket = 0;
      player.orange_money = 0;

      player.call("createJobOrangeCollectorMarkBlip", [ true, false, 402.46, 6504.57, 27.86 ] );

      mp.labels.new("Взять корзину", new mp.Vector3(402.46, 6504.57, 27.86),
          {
              los: true,
              font: 2,
              drawDistance: 20,
          });

      player.random_tree = -1;

    }



  } catch (err){
      console.log(err);
      return;
  }
}

function takeBasketOrangeCollector(player){
    try
    {
      player.inside_basket = 0;
      player.orange_money = 0;
        if (player.random_tree == -1) {

          player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 15);

          setTimeout(() => {


          //player.utils.putObject();
          player.utils.takeObject("prop_fruit_basket");
          player.random_tree = getRandomNumber(0, 8);
          player.previous = player.random_tree;
          player.call("createJobOrangeCollectorMarkBlip", [ true, true, JobOrangeCollector.out_oranges_positions[player.random_tree].x, JobOrangeCollector.out_oranges_positions[player.random_tree].y, JobOrangeCollector.out_oranges_positions[player.random_tree].z ]);

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

function putBasketOrangeCollector(player){
    try
    {
      var before = player.inside_basket;
      player.orange_money += Math.round(mp.economy["build_salary"].value * JobOrangeCollector.out_oranges_positions[player.random_tree].xs);
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
            if(percent>100){
              percent = 100;
            }
            player.notify("Корзина заполнена на  ~g~ " + percent + "%");


            if(player.inside_basket >= 5){
              player.notify("Отнесите апельсины на ~g~ СКЛАД ~w~!");

              mp.labels.new("СКЛАД", new mp.Vector3(396.81, 6507.24, 27.80),
                  {
                      los: true,
                      font: 2,
                      drawDistance: 20,
                  });

              player.call("createJobOrangeCollectorMarkBlip", [ true, false, 396.81, 6507.24, 27.80 ] );
              player.random_tree = -1;
            }
          else{
            player.random_tree = getRandomNumber(0, 8);
            while(player.random_tree == player.previous){
              player.random_tree = getRandomNumber(0, 8);
            }

            player.call("createJobOrangeCollectorMarkBlip", [ true, true, JobOrangeCollector.out_oranges_positions[player.random_tree].x, JobOrangeCollector.out_oranges_positions[player.random_tree].y, JobOrangeCollector.out_oranges_positions[player.random_tree].z ]);
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
