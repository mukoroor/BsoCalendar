import AvlTree from "./node_modules/@datastructures-js/binary-search-tree/src/avlTree.js"
import CalendarEventUI from "./CalendarEventUI.js"
import Timeline from "./Timeline.js"
import UI from "./UI.js"

export default class Day extends UI {
    static focus = {
        block: document.createElement("div"),
        currDay: null,
        newestEvent: null,
        calcNewPos(dayNum = this.currDay.getDayNumber()) {
            const x = 1.02 * 8 * ((dayNum - 1) % 7)
            const y = 1.02 * 8 * (Math.floor((dayNum - 1) / 7))
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
    static days = ['M', 'T', 'W', 'R', 'F', 'S', 'S']
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
        map.set("time", map.get("time") + ".9")
        const successor = this.#calendarEventUITree.upperBound(new CalendarEventUI(map))
        const flex = this.getElement().lastElementChild
        if (successor) {
            flex.insertBefore(cUI.getElement(), successor.getValue().getElement());
        } else {
            flex.append(cUI.getElement());
        }
        Day.focus.newestEvent = cUI
        gsap.from(cUI.getElement(), {opacity: 0, duration: 2})
        Timeline.showTimeline()
        cUI.getElement().scrollIntoView({ behavior: "smooth", block: "center"})
        
    }

    getDayNumber() {
        return this.#dayNumber
    }

    getAllCalendarEventUIs() {
        const arr = []
        this.#calendarEventUITree.traverseInOrder((node) => arr.push(node.getValue()), undefined)
        return arr
    }

    groupByHour() {
        const eventsByHour = new Map();
        const events =  this.getAllCalendarEventUIs()
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
        if (newPos.x == pos.x && newPos.y == pos.y) {
            return
        }
        const timeline = gsap.timeline()
        if(newPos.x != pos.x && newPos.y != pos.y) {
            if ((pos.y > 24 * 1.02 || pos.y > pos.x && newPos.y < 24 * 1.02)) {
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

    static init(date) {
        Day.focus.block.id = "focus"
        const pos = Day.focus.calcNewPos(date.getDate())
        Day.focus.setPos(pos.x, pos.y, true)
    }
}