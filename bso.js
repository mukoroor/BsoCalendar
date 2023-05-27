import Year from "./Year.js"
import Timeline from "./Timeline.js"
import Day from "./Day.js"
import Month from "./Month.js"
import CalendarEventUI from "./CalendarEventUI.js"


const todayDate = new Date()
Timeline.init()
Day.init(todayDate)
Month.init(todayDate)
Year.init(todayDate)
let i = 0
const body = document.querySelector("body")
setInterval(() => {
    body.style.setProperty("--a", `${++i % 360}deg`)
    // if ((new Date()).getDate() !== todayDate.getDate()) {
}, 10)

const calendarContainer = document.getElementById("calendar") //holds all days Divs
const monthTextContainer = document.getElementById("monthText") //holds name of current Month

function displayMonth() {
    const data = Year.getMonthData()
    monthTextContainer.textContent = data.header
    calendarContainer.replaceChild(data.days, calendarContainer.lastElementChild);
}

document.getElementById("prevMonth").addEventListener('click', () => {
    if (--Month.monthIndex < 0) {
        Year.yearMap.has(Year.currentYear-- - 1) ?
            Year.yearMap.get(Year.currentYear) : new Year(Year.currentYear);
        Month.monthIndex = 11
    }
    displayMonth()
})

document.getElementById("nextMonth").addEventListener('click', () => {
    if (++Month.monthIndex > 11) {
        Year.yearMap.has(Year.currentYear++ + 1) ?
            Year.yearMap.get(Year.currentYear) : new Year(Year.currentYear);
            Month.monthIndex = 0
    }
    displayMonth()
})


const navs = document.querySelectorAll(".nav")
const nav = navs[navs.length - 1]
const buttons =[...nav.querySelectorAll("button")]
for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", () => {
        gsap.to(nav.querySelector("div"), {duration: 1, x: `${i * 2}vmax`, ease: "power4.out"})
        Timeline.showTimeline(i)
    }, false)
}

body.addEventListener("keydown", e => {
    if (e.key === 'q') {
        CalendarEventUI.popUp.randomCalendarEvent()
    }
    if (e.ctrlKey && e.key === "b") {
        const click = new Event("click")
        Day.focus.currDay.getEventArray().forEach(el => el.dispatchEvent(click))
    }
})

// function getCssVariableValue(element, varName, unit) {
//     return +window.getComputedStyle(element).getPropertyValue(varName).slice(0, -unit.length)
// }

displayMonth()


