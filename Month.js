import UI from "./UI.js"
import Day from "./Day.js"
import Year from "./Year.js"
import Timeline from "./Timeline.js"

export default class Month extends UI {
    static monthNames = ["January", "February", "March",
        "April", "May", "June", "July", "August",
        "September", "October","November","December"]
    static dayCounts = [31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31]
    static monthIndex
    #dayMap

    constructor(index, yearNumber) {
        super()
        this.#dayMap = new Map()
        const newDate = new Date()

        for (let i = 1; i < Month.dayCounts[index] + 1; i++) {
            if (Year.currentYear == yearNumber && Month.monthIndex == index && newDate.getDate() == i) {
                const today = new Day(i);
                Day.focus.currDay = today
                today.getElement().firstElementChild.id = "today"
                this.addDay(i, today)
            } else {
                this.addDay(i, new Day(i))
            }
        }
        this.getElement().classList.add("monthDays", "card")
    }

    addDay(dayNum, day) {
        this.#dayMap.set(dayNum, day)
        this.getElement().append(day.getElement())
    }

    getDayMap() {
        return this.#dayMap
    }

    setFocusDay() {
        const currDayNum =  Day.focus.currDay.getDayNumber()
        const focusedDayNum = (this.#dayMap.has(currDayNum) ? currDayNum : 1)
        Day.focus.currDay = this.#dayMap.get(focusedDayNum) 
        Day.focus.setPos(...Object.values(Day.focus.calcNewPos()), true)
        Timeline.timelineInstances[Timeline.currTimelineIndex].clearElement()
        Timeline.timelineChanged = true
        Timeline.showTimeline()
    }

    static init(date) {
        Month.monthIndex = date.getMonth()
    }
}