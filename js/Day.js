import AvlTree from "../node_modules/@datastructures-js/binary-search-tree/src/avlTree.js"
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
        this.getElement().style.gridRow = Math.floor((dayNumber - 1)/ 7) + 1
        this.getElement().style.gridColumn = dayNumber % 7 || 7
        this.getElement().classList.add("day")
        this.getElement().append(dayNumContainer, eventsContainer)

        this.getElement().addEventListener("click", (e) => {
            // clones.forEach(clone => eventsContainer.removeChild(clone))
            if (Day.focus.selectionSet.size) {
                let arr = [...Day.controlPanel.moveDay?.getElement().lastElementChild.querySelectorAll(".clone")]
                while (arr.length) {
                    let ev = arr.shift()
                    ev.parentNode.removeChild(ev)
                }
                Day.focus.selectionSet.forEach(ev => {
                    if (!ev.getElement().classList.contains("tentative")) return
                    ev.getElement().classList.remove("tentative", "select")
                    this.addCalEventUI(ev)
                })
            }
            Day.focus.selectionSet.clear()
            if (Day.focus.currDay != this) this.moveFocusBlock()
        })

        this.getElement().addEventListener("mouseenter", (e) => {
            if (Day.controlPanel.moveDay != this) {
                Day.focus.selectionSet.forEach(ev => {
                    if (ev.getElement().classList.contains("tentative")) {
                        this.addCalEventUI(ev)
                    }
                })
            }
            Day.dataPanel.setData(this)
        })
        this.getElement().addEventListener("mouseleave", (e) => {
            if (Day.controlPanel.moveDay != this) {
                Day.focus.selectionSet.forEach(ev => {
                    if (ev.getElement().classList.contains("tentative")) this.removeCalEventUI(ev)
                })
                Day.dataPanel.setData()
            }
        })
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
        if (minEventCard) minEventCard.parentNode?.removeChild(minEventCard)
        if (eventUI.getElement().parentNode == this.getElement().lastElementChild) this.getElement().lastElementChild.removeChild(eventUI.getElement())
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

    groupEventsByFlowStartTime() {
        console.time("c")
        const eventsByStartTime = new Map()
        const events =  this.getEventArray()
        for (const event of events) {
            const start = event.getCalendarEvent().getStartTime()
            if (eventsByStartTime.has(start)) {
                eventsByStartTime.get(start).push(event);
            } else {
                eventsByStartTime.set(start, [event]);
            }
        }

        let finArr = Array.from(eventsByStartTime.keys())

        const master = []

        let count = 0
        while (count != events.length) {
            const flow = []
            for (const startTime of finArr) {
                let arr = eventsByStartTime.get(startTime)
                if (arr.length && (!flow.length || CalendarEvent.compareTime(flow[flow.length - 1].getCalendarEvent().getEndTime(), arr[arr.length - 1].getCalendarEvent().getStartTime()) < 1 )) {
                    flow.push(arr.shift())
                    count++
                }
            }
            master.push(flow)
        }

        console.timeEnd("c")
        return master
    }

    moveFocusBlock() { 
        Day.focus.setDay(this)
        const pos = Day.focus.getPos()
        const newPos = Day.focus.calcNewPos()
        Day.focus.setPos(newPos.x, newPos.y)
        Day.dataPanel.setData()
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

        setDay(newDay) {
            // this.currDay?.getElement().click()
            this.currDay?.getElement().classList.remove("select")
            newDay.getElement().classList.add("select")
            this.currDay = newDay
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

        setData(day = Day.focus.currDay) {
            this.#dayOfTheWeek.textContent = 
                new Date(Year.currentYear, Month.monthIndex, day.getDayNumber()).toLocaleString("en-US", { weekday: "short" })
            this.getElement().style.gridColumnStart = Month.dayCounts[Month.monthIndex] % 7 + 1
            const events = day.getEventArray()
            let starredCount = 0
            let earliestTime, latestTime
            if (events.length) {
                for (const e of events) {
                    if (e.isStarred()) starredCount++ 
                }
                    earliestTime = events[0].getCalendarEvent().getStartTime()
                    latestTime = events[events.length - 1].getCalendarEvent().getStartTime()
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

            this.#add = document.createElement("button")
            this.#delete = document.createElement("button")
            this.#edit = document.createElement("button")
            this.#move = document.createElement("button")

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
            this.#move.addEventListener("click", this.moveAll)

            this.getElement().append(this.#add, this.#delete, this.#edit, this.#move)
        }

        add() {
            const _p = CalendarEventUI.popUp
            const finish = () => {
                Day.focus.currDay.addCalEventUI(_p.saveCalendarEvent())
                _p.close()
            }
            _p.open()
            _p.queryData()
            .then(finish)
            .catch(() => _p.close())
        }

        rand() {
            Day.focus.currDay.addCalEventUI(CalendarEventUI.popUp.randomCalendarEvent())
            CalendarEventUI.popUp.fillValues()
        }

        deleteAll() {
            Day.focus.selectionSet.forEach(e => Day.focus.currDay.removeCalEventUI(e))
            Day.focus.selectionSet = new Set()
        }

        async editAll() {
            for (const e of Day.focus.selectionSet) {
                await e.edit()
                e.getElement().classList.remove("select")
            }
            Day.focus.selectionSet = new Set()
        }

        moveAll() {
            Day.controlPanel.moveDay = Day.focus.currDay
            Day.focus.selectionSet.forEach(e => {
                e.getElement().classList.toggle("tentative")
                const clone = e.getElement().cloneNode(true)
                clone.classList.add("clone")
                e.getElement().parentNode.replaceChild(clone, e.getElement())
                Day.focus.currDay.removeCalEventUI(e)
                console.log(e.getElement().parentNode)
            })
        }
    }
    return new ControlPanel()
}