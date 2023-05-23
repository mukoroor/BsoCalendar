import Month from "./Month.js"
import Day from "./Day.js"

export default class Year {
    static yearMap = new Map()
    static currentYear
    #months

    constructor(yearNumber) {
        Month.dayCounts[1] = ((yearNumber % 4 === 0 && yearNumber % 100 !== 0) || yearNumber % 400 === 0) ? 29: 28
        this.#months = [new Month(0, yearNumber), new Month(1, yearNumber),
            new Month(2, yearNumber), new Month(3, yearNumber),
            new Month(4, yearNumber), new Month(5, yearNumber),
            new Month(6, yearNumber), new Month(7, yearNumber),
            new Month(8, yearNumber), new Month(9, yearNumber),
            new Month(10, yearNumber), new Month(11, yearNumber)]
        Year.yearMap.set(yearNumber, this)
    }

    static getMonthData() {
        const curr = Year.yearMap.get(Year.currentYear).#months[Month.monthIndex]
        const header  = Month.monthNames[Month.monthIndex] + ' | ' + Year.currentYear
        const days = curr.getElement()

        days.append(Day.focus.block)
        days.append(Day.focus.dataPanel)
        curr.setFocusDay()    
        return {header, days}
    }

    static init(date) {
        Year.currentYear = date.getFullYear()
        new Year(Year.currentYear)
    }

}