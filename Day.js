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
    // static clock = setInterval(() => h++, 100)
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
        this.getElement().addEventListener("click", () => {
            if (Day.focus.currDay !== this) {
                this.moveFocusBlock()
                if (Day.focus.selectionSet.size) {
                    Day.focus.selectionSet.forEach(e => {
                        this.addCalEventUI(e)
                    })
                }
                Day.focus.selectionSet = new Set()
            }
        }, true)

        this.getElement().addEventListener("mouseenter", () => Day.dataPanel.setData(this))
        this.getElement().addEventListener("mouseleave", () => Day.dataPanel.setData())
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
        // eventUI.getElement().scrollIntoView({ behavior: "smooth", block: "center"})
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

    // groupEventsByTime() {
    //     const groups = {};
    //     const events =  this.getEventArray()
    //     for (const event of events) {
    //         const _e = event.getCalendarEvent()
    //         const key = _e.getTimeRangeString();
    //         if (!groups[key]) {
    //             groups[key] = [];
    //         }
    //         groups[key].push(event);
    //     }
    //     return groups
    // }
    // groupEventsByFlow() {
    //     console.time("a")
    //     const master = []
    //     const events =  this.getEventArray()
    //     if (events.length) {
    //         master.push([events[0]])
    //     }
        
    //     for (let i = 1; i < events.length; i++) {
    //         let a = events[i]
    //         let k = 0
    //         let best = {val: 1, index: -1}
    //         while(k < master.length) {
    //             let b = master[k]
    //             let tempVal = CalendarEvent.compareTime(a.getCalendarEvent().getStartTime(), b[b.length - 1].getCalendarEvent().getEndTime())
    //             if (!tempVal) {
    //                 best.index = k
    //                 break
    //             }
                
    //             if (tempVal > -1 && tempVal > best.val) {
    //                 best.val = tempVal
    //                 best.index = k
    //             } else {
    //                 k++
    //             }
    //         }
    //         if (best.index == -1 ) master.push([a])
    //         else master[best.index].push(a)
    //     }
    //     console.timeEnd("a")
    //     return master
    // }

    // groupEventsByFlowOther() {
    //     console.time("b")
    //     const master = []
    //     const events =  this.getEventArray()
    //     if (events.length) {
    //         master.push([events[0]])
    //     }
        
    //     for (let i = 1; i < events.length; i++) {
    //         let a = events[i]
    //         let k = 0
    //         let best = {val: 2400, index: -1}
    //         while(k < master.length) {
    //             let b = master[k]
    //             let tempVal = CalendarEvent.compareTime(a.getCalendarEvent().getStartTime(), b[b.length - 1].getCalendarEvent().getEndTime())
    //             if (!tempVal) {
    //                 best.index = k
    //                 break
    //             }
                
    //             if (tempVal > -1 && tempVal < best.val) {
    //                 best.val = tempVal
    //                 best.index = k
    //             } else {
    //                 k++
    //             }
    //         }
    //         if (best.index == -1 ) master.push([a])
    //         else master[best.index].push(a)
    //     }
    //     console.timeEnd("b")
    //     return master
    // }

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

    // groupEvents() {
    //     console.time("d")
    //     const events =  this.getEventArray()
    //     const isOverlap = (event1, event2) => {
    //         return +event1.getCalendarEvent().getStartTime().replace(":", "") < +event2.getCalendarEvent().getEndTime().replace(":", "") && +event2.getCalendarEvent().getStartTime().replace(":", "") < +event1.getCalendarEvent().getEndTime().replace(":", "");
    //       }
      
    //     const master = []

    //     for (const event of events) {
    //       let addedToGroup = false;
      
    //       for (const group of master) {
    //         if (!group.some(existingEvent => isOverlap(event, existingEvent))) {
    //           group.push(event);
    //           addedToGroup = true;
    //           break;
    //         }
    //       }
      
    //       if (!addedToGroup) {
    //         master.push([event]);
    //       }
    //     }
    //     console.timeEnd("d")
    //     return master;
    //   }

    moveFocusBlock() { 
        Day.focus.setDay(this)
        Day.focus.selectionSet.forEach(e => e.getElement().classList.remove("select"))
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
            Day.focus.selectionSet.forEach(e => {
                Day.focus.currDay.removeCalEventUI(e)
            })
            // this.setAttribute("icon", "move " + Day.focus.selectionSet.size)
        }
    }
    return new ControlPanel()
}