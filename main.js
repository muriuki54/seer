const currentAcRating = document.querySelector("#current_ac_rating");
const newAcRating = document.querySelector("#new_ac_rating");
const totalSpentHours = document.querySelector("#total_hours_spent");
const powerCost = document.querySelector(".power_cost");
const ACTonnage_dropdown = document.querySelector(".ACTonnage_dropdown select");
const seerRangeTooltipCurrent = document.querySelector('.seer_range_tooltip_current');
const seerRangeTooltipNew = document.querySelector('.seer_range_tooltip_new');
const seerRangeTooltipHours = document.querySelector('.seer_range_tooltip_hours');
const savingsPercentageperYear = document.querySelector(".savings_percentage_per_year");

const savingsMeterIndicator = document.querySelector(".savings_meter_indicator");

const svg_1_Path = document.querySelector(".seer_savings_circular_svg_1 svg .seer_savings_circular_svg_1_outer");
const svg_2_Path = document.querySelector(".seer_savings_circular_svg_2 svg .seer_savings_circular_svg_2_outer");

const monetaryCurrentUsageperYear = document.querySelector(".monetary_current_usage_per_year span.value");
const monetaryNewUsageperYear = document.querySelector(".monetary_new_usage_per_year span.value");
const monetarySavingsperYear = document.querySelector(".monetary_savings_per_year span.value");
const monetarySavingsperFiveYears = document.querySelector(".monetary_savings_per_five_year span.value");

document.addEventListener("DOMContentLoaded", () => {
    setTooltip(currentAcRating, seerRangeTooltipCurrent);
    setTooltip(newAcRating, seerRangeTooltipNew);
    setTooltip(totalSpentHours, seerRangeTooltipHours);
});

currentAcRating.addEventListener("input", function() {
    setTooltip(this, seerRangeTooltipCurrent);
    getValues();
})

newAcRating.addEventListener("input", function() {
    setTooltip(this, seerRangeTooltipNew);
    getValues();
})

totalSpentHours.addEventListener("input", function() {
    setTooltip(this, seerRangeTooltipHours);
    getValues();
})

powerCost.addEventListener("input", () => getValues());
ACTonnage_dropdown.addEventListener("input", () => getValues());

function setTooltip(range, tooltip) {
    // set tooltip text
    tooltip.innerText = range.value;

    let rangeVal = range.value;
    let min = range.min ? range.min : 0;
    let max = range.max ? range.max : 24;
    let newVal = Number((rangeVal - min) * 100) / (max - min);
    tooltip.style.left = newVal + "%";

    // progress
    range.style.backgroundSize = (rangeVal - min) * 100 / (max - min) + "% 100%";

    // Tooltip
    tooltip.style.setProperty("left", "calc("+newVal+"% - 13px)");
}


/************************************************* */

// SAVINGS METER

function setSavingsMeterIndicator(percentage) {
    if(percentageValue < 0) {
        savingsMeterIndicator.style.transform = "rotate(-90deg)";
        return
    };
    transformValue = ((percentage * 180) / 100) - 90;
    savingsMeterIndicator.style.transform = "rotate("+transformValue+"deg)";
}

// CIRCULAR SVGS 
const svg_1_Length = svg_1_Path.getTotalLength();
const svg_2_Length = svg_2_Path.getTotalLength();

function initSvgLength() {
    svg_1_Path.style.strokeDasharray = svg_1_Length;
    svg_1_Path.style.strokeDashoffset = svg_1_Length;

    svg_2_Path.style.strokeDasharray = svg_2_Length;
    svg_2_Path.style.strokeDashoffset = svg_2_Length;
}

function setSvgPath(svg, svgLength, currentValue, maxValue) {
    svg.style.strokeDasharray = svgLength;
    svg.style.strokeDashoffset = svgLength;

    let progress = svgLength - (currentValue / maxValue) * svgLength;

    svg.style.strokeDashoffset = progress;
}

/************************************************ */

// CALCULATIONS
let currentSEERRating;
let newSEERRating;
let pricePerkWh;
let ACTonnage;
let totalHours;

function getValues(){

    currentSEERRating = parseFloat(currentAcRating.value);
    newSEERRating = parseFloat(newAcRating.value);
    pricePerkWh = powerCost.value ? parseFloat(powerCost.value) / 100 : 0;
    ACTonnage = parseFloat(ACTonnage_dropdown.value);
    totalHours = parseInt(totalSpentHours.value);

    getSeasonalPrice();

}

function getSeasonalPrice() {
    const BTU = ACTonnage * 12000;

    let currentSeasonalWattage = BTU / currentSEERRating; // watts
    let totalCurrentRuntimeCost = (currentSeasonalWattage * totalHours) / 1000; // kWh
    let currentSeasonalPrice = totalCurrentRuntimeCost * pricePerkWh; // dollars

    let newSeasonalWattage = BTU / newSEERRating; // watts
    let totalnewRuntimeCost = (newSeasonalWattage * totalHours) / 1000; // kWh
    let newSeasonalPrice = totalnewRuntimeCost * pricePerkWh; // dollars

    // saving percentage 
    percentageValue = Math.floor(((currentSeasonalPrice - newSeasonalPrice)  * 100) / currentSeasonalPrice);
    savingsPercentageperYear.innerText = percentageValue + "%";
    setSavingsMeterIndicator(percentageValue);

    // current usage
    setSvgPath(svg_1_Path, svg_1_Length, currentSeasonalPrice, 5000); // last parameter is a value i've guessed lol
    monetaryCurrentUsageperYear.innerText = (String(currentSeasonalPrice.toFixed(2)));

    // new usage
    setSvgPath(svg_2_Path, svg_2_Length, newSeasonalPrice, 5000); // last parameter is a value i've guessed lol
    monetaryNewUsageperYear.innerText = (String(newSeasonalPrice.toFixed(2)));

    let difference = (currentSeasonalPrice - newSeasonalPrice).toFixed(2);
    monetarySavingsperYear.innerText = difference;
    monetarySavingsperFiveYears.innerText = (difference * 5).toFixed(2);
    
}

initSvgLength();
getValues();