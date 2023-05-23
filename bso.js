import Year from "./Year.js"
import Timeline from "./Timeline.js"
import Day from "./Day.js"
import generateRandomEventData from "./randomEventGenerator.js"
import Month from "./Month.js"


const todayDate = new Date()
Timeline.init()
Day.init(todayDate)
Month.init(todayDate)
Year.init(todayDate)
let i = 0
setInterval(() => {
    Day.focus.block.style.setProperty("--a", `${++i % 360}deg`)
    // if (Month.) check if date changes
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

const eventPopUp = document.getElementById("newCalendarEvent")
const eventInfo = {
    name: eventPopUp.querySelector("#eventName"),
    description: eventPopUp.querySelector("#eventDescription"),
    time: eventPopUp.querySelector("#eventTime"),
    venue: eventPopUp.querySelector("#eventVenue"),
    color: eventPopUp.querySelector("#eventColor"),

    fillValues() {
        let e = generateRandomEventData()
        this.name.value = e.eventName
        this.description.value = e.eventDescription
        this.time.value = e.eventTime
        this.venue.value = e.eventVenue
        this.color.value = e.eventColor
    },

    getValues() {
        const valMap = new Map();
        Object.entries(this).forEach(entry => {
            if (typeof entry[1] !== "function") {
                valMap.set(entry[0], entry[1].value)
                if (entry[0] !== "time" && entry[0] != "color") {
                    entry[1].value = ""
                }
            }
        })
        return valMap
    },

    isValid() {
        let valid = true
        Object.values(this).forEach(inputEl => {
            if (typeof inputEl !== "function" && !inputEl.value) {
                valid = false    
            }
        })
        return valid
    }

}

const summary = document.querySelector(".summary")
const submitExit = eventPopUp.querySelector("#submitExit")
const cross = submitExit.firstElementChild

eventPopUp.addEventListener("input", () => {
    if (eventInfo.isValid()) {
        cross.setAttribute("data-valid", 1) //1 is true
    } else {
        cross.setAttribute("data-valid", 0) //0 is false
    }
})

function saveCalendarEvent() {
    if (eventInfo.isValid()) {
        Day.focus.currDay.addCalEventUI(eventInfo.getValues())
    }
    eventPopUp.style.opacity = "0"
    eventPopUp.style.zIndex = "0"
    cross.setAttribute("check", "0")
    summary.classList.remove("blur")
}

function randomCalendarEvent() { 
    eventInfo.fillValues()
    saveCalendarEvent()
}

submitExit.addEventListener("click", saveCalendarEvent)

document.querySelector("body").addEventListener("keypress", e => {
    if (e.key === 'q') {
        randomCalendarEvent()
    }
})

document.getElementById("addEventButton").addEventListener('click', () => {
    eventPopUp.style.opacity = "1"
    eventPopUp.style.zIndex = "1"
    summary.classList.add("blur")
})

function getCssVariableValue(element, varName, unit) {
    return +window.getComputedStyle(element).getPropertyValue(varName).slice(0, -unit.length)
}

displayMonth()


