const JobTrucker = {
  keyDownE: undefined,
  timeout: undefined,
  colshape: mp.colshapes.newSphere(-775.109, -2632.27, 13.9446, 1.25)
};

mp.events.add('playerEnterColshape', (shape) => {
    if (shape === JobTrucker.colshape) {
      mp.events.call("prompt.show", `Нажмите <span>Е</span> для взаимодействия`);
      JobTrucker.keyDownE = true;
    }
});
mp.events.add('playerExitColshape', (shape) => {
    if (shape === JobTrucker.colshape) {
      delete JobTrucker.keyDownE;
      mp.events.call("prompt.hide");
    }
});

mp.events.add("time.add.back.trucker", (player) => {
  try
  {
    if (JobTrucker.timeout === undefined) {
      JobTrucker.timeout = setTimeout(() => {
          mp.events.callRemote("leave.trucker.job");
      }, 60000);
    }
  }
  catch (err) {
      mp.game.graphics.notify(err);
      return;
  }
});

mp.events.add("time.remove.back.trucker", (player) => {
  try
  {
    if (JobTrucker.timeout !== undefined) {
         clearTimeout(JobTrucker.timeout);
         delete JobTrucker.timeout;
    }
  }
  catch (err) {
      mp.game.graphics.notify(err);
      return;
  }
});

mp.keys.bind(0x45, false, function () { // E key
	if (JobTrucker.keyDownE) {
    if (mp.clientStorage["job"] != 0 && mp.clientStorage["job"] != 5) return mp.events.call(`nError`, `Вы уже где-то работаете!`);
    mp.gui.cursor.show(true, true);
    if (mp.clientStorage["job"] == 5) mp.events.call("choiceMenu.show", "accept_job_trucker", {name: "уволиться из Дальнобойщиков?"});
    else mp.events.call("choiceMenu.show", "accept_job_trucker", {name: "устроиться Дальнобойщиком?"});
	}
});


console.log("[JOB] Trucker job stared!");
