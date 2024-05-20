const donuts_per_tray = 24;
const water_per_lb = 10 / 6;
const trays_per_lb_of_mix = 10 / 4;

const trays_elem = document.getElementById("input_trays");
const mix_lb_elem = document.getElementById("input_mix_lb");
const water_lb_elem = document.getElementById("input_water_lb");

trays_elem.addEventListener("change", cake_calc_by_trays, false);
mix_lb_elem.addEventListener("change", cake_calc_by_mix, false);
water_lb_elem.addEventListener("change", cake_calc_by_mix, false);

const num_donuts_elem = document.getElementById("num_donuts");
const qts_water_elem = document.getElementById("qts_water");

function cake_calc_by_mix() {
    var mix = mix_lb_elem.value;

    water_lb_elem.value = mix / water_per_lb;
    qts_water_elem.innerText = "(" + (water_lb_elem.value * .5).toString() + " qts)";

    trays_elem.value = mix / trays_per_lb_of_mix;
    num_donuts_elem.innerText = "(about " + (trays_elem.value * 24).toString() + " donuts)";
}

function cake_calc_by_trays() {
    mix_lb_elem.value = trays_elem.value * trays_per_lb_of_mix;
    cake_calc_by_mix();
}