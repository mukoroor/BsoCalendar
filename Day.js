import AvlTree from "./node_modules/@datastructures-js/binary-search-tree/src/avlTree.js"
import CalendarEventUI from "./CalendarEventUI.js"
import CalendarEvent from "./CalendarEvent.js"
import Timeline from "./Timeline.js"
import Year from "./Year.js"
import Month from "./Month.js"
import UI from "./UI.js"

export default class Day extends UI {
    static focus = createFocus()
    static dataPanel = createDataPanel()
    static controlPanel = createControlPanel()
    #dayNumber
    #calendarEventUITree

    constructor(dayNumber) {
        super()
        this.#dayNumber = dayNumber
        this.#calendarEventUITree = new AvlTree(CalendarEventUI.compare, undefined)

        const dayNumContainer = document.createElement("div")
        const eventsContainer = document.createElement("div")
        dayNumContainer.textContent = dayNumber
        this.getElement().classList.add("day")
        this.getElement().append(dayNumContainer, eventsContainer)
        this.getElement().addEventListener("click", () => {
            if (Day.focus.currDay !== this) this.moveFocusBlock()
        }, true)
    }

    addCalEventUI(eventUI) {
        this.#calendarEventUITree.insert(eventUI)
        const successor = this.#calendarEventUITree.upperBound(eventUI, false)
        const flex = this.getElement().lastElementChild
        if (successor && successor.getValue() !== eventUI) {
            flex.insertBefore(eventUI.getElement(), successor.getValue().getElement());
        } else {
            flex.append(eventUI.getElement());
        }
        Day.focus.newestEvent = eventUI
        // gsap.from(eventUI.getElement().firstElementChild, {color: "green"})
        Timeline.showTimeline()
        eventUI.getElement().scrollIntoView({ behavior: "smooth", block: "center"})
        Day.dataPanel.setData()
        
    }

    removeCalEventUIByHTML(element) {
        const events = this.getEventArray()
        for (const event of events) {
            const eventCard = event.getEventCard()
            const minEventCard = event.getMinEventCard()

            if (eventCard === element || minEventCard === element || this.getElement() === element) {
                if (eventCard) {
                    gsap.to(eventCard, {scale: 0, onComplete: () => eventCard.parentNode?.removeChild(eventCard)})
                }
                if (minEventCard) {
                    gsap.to(minEventCard, {scale: 0, onComplete: () => minEventCard.parentNode?.removeChild(minEventCard)})
                }
                gsap.to(event.getElement(), {scale: 0, onComplete: () => this.getElement().lastElementChild.removeChild(event.getElement())})
                this.#calendarEventUITree.remove(event)
                break
            }
        }
        Day.dataPanel.setData()
    }

    removeCalEventUI(eventUI) {
        const eventCard = eventUI.getEventCard()
        const minEventCard = eventUI.getMinEventCard()
        if (eventCard) eventCard.parentNode?.removeChild(eventCard)
        if (minEventCard) minEventCard.getMinEventCard().parentNode?.removeChild(minEventCard)
        this.getElement().lastElementChild.removeChild(eventUI.getElement())
        this.#calendarEventUITree.remove(eventUI)
        Day.dataPanel.setData()
    }

    getDayNumber() {
        return this.#dayNumber
    }

    getTree() {
        return this.#calendarEventUITree
    }

    getEventArray() {
        const arr = []
        this.#calendarEventUITree.traverseInOrder((node) => arr.push(node.getValue()), undefined)
        return arr
    }

    groupByHour() {
        const eventsByHour = new Map();
        const events =  this.getEventArray()
        for (const event of events) {
            const hour = event.getCalendarEvent().getHour()
            if (eventsByHour.has(hour)) {
                eventsByHour.get(hour).push(event);
            } else {
                eventsByHour.set(hour, [event]);
            }
        }
        return eventsByHour
    }

    moveFocusBlock() { 
        Day.focus.currDay = this
        Day.focus.selectionSet.forEach(e => e.getElement().classList.remove("select"))
        Day.focus.selectionSet = new Set()
        const pos = Day.focus.getPos()
        const newPos = Day.focus.calcNewPos()
        Day.focus.setPos(newPos.x, newPos.y)
        Day.dataPanel.setData()
        console.log("passed")
        if (newPos.x == pos.x && newPos.y == pos.y) {
            return
        }
        const timeline = gsap.timeline()
        if(newPos.x != pos.x && newPos.y != pos.y) {
            if ((pos.y > 24 * 1.025 || pos.y > pos.x && newPos.y < 24 * 1.025)) {
                timeline.to(Day.focus.getElement(), {y: `${newPos.y}vmax`, ease: "power3.out"})
                timeline.to(Day.focus.getElement(), {x: `${newPos.x}vmax`, ease: "power3.out"})
            } else {
                timeline.to(Day.focus.getElement(), {x: `${newPos.x}vmax`, ease: "power3.out"})
                timeline.to(Day.focus.getElement(), {y: `${newPos.y}vmax`, ease: "power3.out"})
            }
        } else {
            timeline.to(Day.focus.getElement(), {x: `${newPos.x}vmax`, y: `${newPos.y}vmax`, ease: "power3.out"})
        }
        Timeline.timelineInstances[Timeline.currTimelineIndex].clearElement()
        Timeline.timelineChanged = true
        Timeline.showTimeline()
    }

    static init(date) {
        const pos = Day.focus.calcNewPos(date.getDate())
        Day.focus.setPos(pos.x, pos.y, true)
    }
}

function createFocus() {
    class Focus extends UI {
        currDay = null
        newestEvent = null
        selectionSet = new Set()

        constructor() {
            super()
            this.getElement().id = "focus"
        }

        calcNewPos(dayNum = this.currDay.getDayNumber()) {
            const x = 1.025 * 8 * ((dayNum - 1) % 7)
            const y = 1.025 * 8 * (Math.floor((dayNum - 1) / 7))
            return {x, y}
        }
        
        setPos(x, y, show = undefined) {
            this.getElement().setAttribute("x", x)
            this.getElement().setAttribute("y", y)
            if (show) gsap.set(this.getElement(), {x: `${x}vmax`, y: `${y}vmax`})
        }
    
        getPos() {
            return { x: this.getElement().getAttribute("x"), y: this.getElement().getAttribute("y")}
        }
    }
    return new Focus()
}

function createDataPanel() {
    class DataPanel extends UI {
        #dayOfTheWeek
        #starred
        #count
        #first
        #last
        #totalTime
        constructor() {
            super()
            this.getElement().id = "dataPanel"
            this.#dayOfTheWeek = document.createElement("div")
            this.#starred = document.createElement("div")
            this.#count = document.createElement("div")
            this.#first = document.createElement("div")
            this.#last = document.createElement("div")
            this.#totalTime = document.createElement("div")

            const star = document.createElement("span")
            star.textContent = "star"
            star.classList.add("material-symbols-rounded", "star")
            this.#starred.append(star)

            this.getElement().append(this.#dayOfTheWeek, this.#starred, this.#count, this.#first, this.#last, this.#totalTime)
        }

        setData() {
            this.#dayOfTheWeek.textContent = 
                new Date(Year.currentYear, Month.monthIndex, Day.focus.currDay.getDayNumber()).toLocaleString("en-US", { weekday: 'short' })
            this.getElement().style.gridColumnStart = Month.dayCounts[Month.monthIndex] % 7 + 1
            const events = Day.focus.currDay.getEventArray()
            let starredCount = 0
            let earliestTime, latestTime
            if (events.length) {
                for (const e of events) {
                    if (e.isStarred()) starredCount++ 
                    else break
               }
    
                if (starredCount && starredCount !== events.length) {
                    earliestTime = (CalendarEvent.compare(events[0].getCalendarEvent(), events[starredCount].getCalendarEvent()) < 0 ? 
                    events[0].getCalendarEvent().getTime(): events[starredCount].getCalendarEvent().getTime())
                    latestTime = (CalendarEvent.compare(events[events.length - 1].getCalendarEvent(), events[starredCount - 1].getCalendarEvent()) > 0 ? 
                    events[events.length - 1].getCalendarEvent().getTime(): events[starredCount - 1].getCalendarEvent().getTime())
                } else {
                    earliestTime = events[0].getCalendarEvent().getTime()
                    latestTime = events[events.length - 1].getCalendarEvent().getTime()
                }
            }
    
            const star = this.#starred.firstChild
            this.#starred.textContent = ": " + starredCount
            this.#starred.prepend(star)
            this.#count.textContent = "Count: " + events.length
            this.#first.textContent = "First Event: " + (earliestTime || "N/A")
            this.#last.textContent = "Last Event: " + (latestTime || "N/A")
            this.#totalTime.textContent = "Total Time: "
        }
    }
    return new DataPanel()
}

function createControlPanel() {
    class ControlPanel extends UI {
        #add
        #delete
        #edit
        #move
        
        constructor() {
            super()
            this.getElement().id = "controlPanel"

            this.#add = document.createElement("div")
            this.#delete = document.createElement("div")
            this.#edit = document.createElement("div")
            this.#move = document.createElement("div")

            this.#add.setAttribute("icon", "add")
            this.#delete.setAttribute("icon", "delete")
            this.#edit.setAttribute("icon", "edit")
            this.#move.setAttribute("icon", "move_group")
            
            this.#delete.classList.add("material-symbols-rounded")
            this.#edit.classList.add("material-symbols-rounded")
            this.#add.classList.add("material-symbols-rounded")
            this.#move.classList.add("material-symbols-rounded")

            this.#add.addEventListener("click", this.add)
            this.#delete.addEventListener("click", this.deleteAll)
            this.#edit.addEventListener("click", this.editAll)

            this.getElement().append(this.#add, this.#delete, this.#edit, this.#move)
        }

        add() {
           CalendarEventUI.popUp.open()
        }

        deleteAll() {
            Day.focus.selectionSet.forEach(e => Day.focus.currDay.removeCalEventUI(e))
            Day.focus.selectionSet = new Set()
        }

        editAll() {
            Day.focus.selectionSet.forEach(e => {
                e.edit()
                e.getElement().click()
            })
            Day.focus.selectionSet = new Set()
        }
    }
    return new ControlPanel()
}