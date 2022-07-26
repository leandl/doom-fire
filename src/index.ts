import { DoomFire } from "./DoomFire";

const $divDoomFire = document.querySelector("#doom-fire-table");
const $inputWind = document.querySelector("#doom-fire #doom-fire-wind input") as HTMLInputElement;

const modeDebug = false;

const size = {
  fireWidth: modeDebug ? 5 : 30,
  fireHeight: modeDebug ? 5 : 30
}

const doomFire = new DoomFire($divDoomFire, size.fireWidth, size.fireHeight, {
  modeDebug
});

function animation() {
  doomFire.start();
  setTimeout(animation, 50);
}

animation();

$inputWind.addEventListener("input", function(event) {
  const valueInputWind = Number($inputWind.value);

  if (valueInputWind === -1) {
    doomFire.setTypeWind("LEFT-WIND");
  }
  
  if (valueInputWind === 1) {
    doomFire.setTypeWind("RIGHT-WIND");
  }

  if (valueInputWind === 0) {
    doomFire.setTypeWind("NO-WIND");
  }
});

