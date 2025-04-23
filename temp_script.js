var room_temp = document.querySelector("#room-temp");
console.log(room_temp);
var mix_temp = document.querySelector("#mix-temp");
var water_temp = document.querySelector("#water-temp");
var btn_temp_calc = document.querySelector("#btn-temp-calc");

room_temp.addEventListener("change", calcTemp, false);
mix_temp.addEventListener("change", calcTemp, false);
// room_temp.addEventListener("change", onTempInputChange, false);
btn_temp_calc.addEventListener("click", calcTemp, false);

function calcTemp(e) {
    var room = parseInt(mix_temp.value);
    var mix = parseInt(room_temp.value);
    var water = (80 * 3) - (room + mix + 25);
    water_temp.value = parseInt(water);
}