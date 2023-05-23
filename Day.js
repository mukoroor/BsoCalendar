import AvlTree from "./node_modules/@datastructures-js/binary-search-tree/src/avlTree.js"
import CalendarEventUI from "./CalendarEventUI.js"
import CalendarEvent from "./CalendarEvent.js"
import Timeline from "./Timeline.js"
import Year from "./Year.js"
import Month from "./Month.js"
import UI from "./UI.js"

export default class Day extends UI {
    static focus = {
        block: document.createElement("div"),
        dataPanel: document.createElement("div"),
        currDay: null,
        newestEvent: null,
        setData() {
            this.dataPanel.firstElementChild.textContent = 
                new Date(Year.currentYear, Month.monthIndex, Day.focus.currDay.getDayNumber()).toLocaleString("en-US", { weekday: 'short' })
            this.dataPanel.style.gridColumnStart = Month.dayCounts[Month.monthIndex] % 7 + 1
            const events = this.currDay.getEventArray()
            if (!events.length) {
                this.dataPanel.lastElementChild.textContent = "No events"
                return
            }
            let starredCount = 0
            for (const e of events) {
                if (e.isStarred()) starredCount++ 
                else break
            }

            let earliestTime, latestTime
            if (starredCount && starredCount !== events.length) {
                earliestTime = (CalendarEvent.compare(events[0].getCalendarEvent(), events[starredCount].getCalendarEvent()) < 0 ? 
                events[0].getCalendarEvent().getTime(): events[starredCount].getCalendarEvent().getTime())
                latestTime = (CalendarEvent.compare(events[events.length - 1].getCalendarEvent(), events[starredCount - 1].getCalendarEvent()) > 0 ? 
                events[events.length - 1].getCalendarEvent().getTime(): events[starredCount - 1].getCalendarEvent().getTime())
            } else {
                earliestTime = events[0].getCalendarEvent().getTime()
                latestTime = events[events.length - 1].getCalendarEvent().getTime()
            }

            this.dataPanel.lastElementChild.textContent = `Data\n⭐: ${starredCount}\nCount: ${events.length}\nFirst: ${earliestTime}\nLast: ${latestTime}`
        },

        calcNewPos(dayNum = this.currDay.getDayNumber()) {
            const x = 1.025 * 8 * ((dayNum - 1) % 7)
            const y = 1.025 * 8 * (Math.floor((dayNum - 1) / 7))
            return {x, y}
        },
        
        setPos(x, y, show = undefined) {
            Day.focus.block.setAttribute("x", x)
            Day.focus.block.setAttribute("y", y)
            if (show) gsap.set(Day.focus.block, {x: `${x}vmax`, y: `${y}vmax`})
        },

        getPos() {
            return { x: Day.focus.block.getAttribute("x"), y: Day.focus.block.getAttribute("y")}
        },

    }
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
            this.moveFocusBlock()
        })
    }

    addCalEventUI(map) {
        const cUI = new CalendarEventUI(map)
        this.#calendarEventUITree.insert(cUI)
        const successor = this.#calendarEventUITree.upperBound(new CalendarEventUI(map))
        const flex = this.getElement().lastElementChild
        if (successor && successor.getValue() !== cUI) {
            flex.insertBefore(cUI.getElement(), successor.getValue().getElement());
        } else {
            flex.append(cUI.getElement());
        }
        Day.focus.newestEvent = cUI
        Day.focus.setData()
        gsap.from(cUI.getElement(), {opacity: 0, duration: 2})
        Timeline.showTimeline()
        cUI.getElement().scrollIntoView({ behavior: "smooth", block: "center"})
        
    }

    removeCalEventUI(element) {
        const events = this.getEventArray()
        for (const event of events) {
            const eventCard = event.getEventCard()
            const minEventCard = event.getMinEventCard()

            if (eventCard === element || minEventCard === element) {
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
        Day.focus.setData()
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
        const pos = Day.focus.getPos()
        Day.focus.currDay = this
        const newPos = Day.focus.calcNewPos()
        Day.focus.setPos(newPos.x, newPos.y)
        Day.focus.setData()
        console.log("passed")
        if (newPos.x == pos.x && newPos.y == pos.y) {
            return
        }
        const timeline = gsap.timeline()
        if(newPos.x != pos.x && newPos.y != pos.y) {
            if ((pos.y > 24 * 1.025 || pos.y > pos.x && newPos.y < 24 * 1.025)) {
                timeline.to(Day.focus.block, {y: `${newPos.y}vmax`, ease: "power3.out"})
                timeline.to(Day.focus.block, {x: `${newPos.x}vmax`, ease: "power3.out"})
            } else {
                timeline.to(Day.focus.block, {x: `${newPos.x}vmax`, ease: "power3.out"})
                timeline.to(Day.focus.block, {y: `${newPos.y}vmax`, ease: "power3.out"})
            }
        } else {
            timeline.to(Day.focus.block, {x: `${newPos.x}vmax`, y: `${newPos.y}vmax`, ease: "power3.out"})
        }
        Timeline.timelineInstances[Timeline.currTimelineIndex].clearElement()
        Timeline.timelineChanged = true
        Timeline.showTimeline()
    }

    updateDisplayOrder() {
        this.getElement().lastElementChild.replaceChildren(...this.getEventArray().map(cUI => cUI.getElement()))
    }

    static init(date) {
        Day.focus.block.id = "focus"
        Day.focus.dataPanel.id = "dataPanel"
        Day.focus.dataPanel.append(document.createElement("span"), document.createElement("div"))
        const pos = Day.focus.calcNewPos(date.getDate())
        Day.focus.setPos(pos.x, pos.y, true)
    }
}