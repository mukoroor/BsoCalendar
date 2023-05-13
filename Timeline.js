import UI from "./UI.js"
import Day from "./Day.js"
import Year from "./Year.js"
import Month from "./Month.js"

export default class Timeline extends UI {
    static timelineInstances = []
    static currTimelineIndex = 0
    static timelineChanged = false
    #timelineElement

    constructor(id) {
        super()
        document.querySelector(".view").append(this.getElement())
        this.getElement().id = id + "View"
        Timeline.timelineInstances.push(this)
    }
    
    getTimelineElement() {
        return this.#timelineElement
    }

    setTimelineElement(newElement) {
        this.#timelineElement = newElement
    }

    generateTimeline() {
        if (this.#timelineElement) {
            this.getElement().append(this.#timelineElement)
            return 1
        }
        return 0
    }
    
    displayDetailedEvents() {}

    static resetTimelineChanged() {
        Timeline.timelineChanged = false
    }

    static init() {
        new ListTimeline()
        new DayTimeline()
        new WeekTimeline()
    }

    static showTimeline(index = Timeline.currTimelineIndex) {
        if (index != Timeline.currTimelineIndex) {
            const direction = Timeline.currTimelineIndex < index ? "-105%" : "105%"
            const curr = Timeline.timelineInstances[Timeline.currTimelineIndex]
            const next = Timeline.timelineInstances[index]
            Timeline.timelineInstances[3 - index - Timeline.currTimelineIndex].getElement().style.zIndex = 0
            curr.getElement().style.zIndex = 1
            next.getElement().style.zIndex = 2
            next.generateTimeline()
            gsap.fromTo(next.getElement(),
            {x: direction}, {x: 0, duration: 1, ease: "power3.out",
            onComplete: () => {
                    curr.clearElement()
                    Timeline.currTimelineIndex = index
                    Timeline.timelineChanged = true
                    next.displayDetailedEvents()
                }
            })
        } else {
            Timeline.timelineInstances[Timeline.currTimelineIndex].getElement().style.zIndex = Timeline.timelineInstances.length - 1
            Timeline.timelineInstances[Timeline.currTimelineIndex].generateTimeline()
            Timeline.timelineInstances[Timeline.currTimelineIndex].displayDetailedEvents()
        }
    }
}

export class DayTimeline extends Timeline {
    #currExpanded = null

    constructor() {
        super("day")
    }

    generateTimeline() {
        if (!super.generateTimeline()) {
            const hourGrid = document.createElement("div")
            hourGrid.id = "hourGrid"
            let i = 0
            while (i < 24) {
                const hr = document.createElement("div")
                hr.textContent = i++
                hr.classList.add("hour")
                hourGrid.append(hr)
            }
            this.setTimelineElement(hourGrid)
        }
        this.getElement().prepend(this.getTimelineElement())
    }
    
    displayDetailedEvents() {
        let i = 2
        const parentElement = this.getElement()
        const hourCalc = (event) => Math.floor(+event.getCalendarEvent().getTime().replace(":", "") / 100)
        const expandGroup = (groupDiv) => {
            const timeline = gsap.timeline();
            const childElements = Array.from(groupDiv.children).slice(1)
            
            const finalPos = (i) => ({y: `${i * 110}%`, ease: "power4.out"})
            
            if (this.#currExpanded && this.#currExpanded != groupDiv) {
                this.#currExpanded.classList.toggle("expanded")
                timeline.to(this.#currExpanded.children, finalPos(0))
                this.#currExpanded = null
            }

            const isExpanded = groupDiv.classList.toggle("expanded")
            this.getElement().setAttribute("group-expanded", isExpanded)
            if (isExpanded) {
                this.#currExpanded = groupDiv
            } else {
                this.#currExpanded = null
                childElements.reverse()
            }
            
            childElements.forEach((child, i) => {
                child.style.zIndex = 
                timeline.to(child, finalPos(groupDiv == this.#currExpanded ? ++i : 0))
            })
        }
        const createGroupHTML = (hour, events) => {
            const hourDiv = document.createElement("div")
            hourDiv.addEventListener("click", () => expandGroup(hourDiv))
            hourDiv.setAttribute('title', hour)
            hourDiv.setAttribute('multiplicity', events.length)
            hourDiv.classList.add("eventGroup")
            events.map(event => {
                event.setMinEventCard()
                event.getMinEventCard().classList.add("hourCard")
                hourDiv.append(event.getMinEventCard())
            })
            return hourDiv
        }              
        const groupByHour = (events) => {
            const eventsByHour = new Map();
            for (const event of events) {
                const hour = hourCalc(event)
                if (eventsByHour.has(hour)) {
                    eventsByHour.get(hour).push(event);
                } else {
                    eventsByHour.set(hour, [event]);
                }
            }
            return eventsByHour
        }
        const notify = (eventGroup, hourCard) => {
            hourCard.classList.add("showNewEvent")
            parentElement.scrollTo({top: 0, left: eventGroup.offsetLeft - 24, behavior: "smooth"})
            setTimeout(() => {
                hourCard.classList.remove("showNewEvent")
                eventGroup.setAttribute("multiplicity", eventGroup.children.length)
            }, 500)
        }
        if (Timeline.timelineChanged) {
            const events = Day.focus.currDay.getAllCalendarEventUIs()
            const hourMap = groupByHour(events)
            const timeline = gsap.timeline()
            for (const [hour, events] of hourMap.entries()) { 
                const newGroup = createGroupHTML(hour, events)
                newGroup.style.gridRowStart = i++
                newGroup.style.gridColumnStart = hour + 1
                parentElement.append(newGroup)
                timeline.from(newGroup, {x: "-3500%"})
            }
        } else if (Day.focus.newestEvent) {
            let group = parentElement.firstElementChild.nextElementSibling
            const hour = hourCalc(Day.focus.newestEvent)
            while(group && group.getAttribute('title') < hour) {
                group = group.nextElementSibling
                i++
            }
            parentElement.classList.toggle("clamp", parentElement.children.length > 15);
            
            Day.focus.newestEvent.setMinEventCard()
            if (group && group.getAttribute('title') == hour) {
                const hourMap = groupByHour(Day.focus.currDay.getAllCalendarEventUIs())
                const siblings = hourMap.get(hour)
                const index = siblings.indexOf(Day.focus.newestEvent) + 1
                const minimized = Day.focus.newestEvent.getMinEventCard()
                if (index != siblings.length) {
                    group.insertBefore(minimized, siblings[index].getMinEventCard())
                } else {
                    group.append(minimized)
                }
                minimized.classList.add("hourCard")
                notify(group, minimized)
            } else {
                const newGroup = createGroupHTML(hour, [Day.focus.newestEvent])
                if (group) {
                    parentElement.insertBefore(newGroup, group)
                } else {
                    parentElement.appendChild(newGroup)
                }
                newGroup.style.gridRowStart = i++
                newGroup.style.gridColumnStart = hour + 1
                while (group) {
                    group.style.gridRowStart = i++
                    group = group.nextElementSibling
                }
                notify(newGroup, newGroup.firstElementChild)
                gsap.from(newGroup, {x: "-3500%", ease: "power3.out"})
            }
            Day.focus.newestEvent = null
        }
        Timeline.resetTimelineChanged()
    }
}

export class ListTimeline extends Timeline {
    constructor() {
        super("list")
    }

    generateTimeline() {
        if (!super.generateTimeline()) {
            this.setTimelineElement(document.createElement("div"))
        }
        this.getTimelineElement().textContent = new Date(Year.currentYear, Month.monthIndex, Day.focus.currDay.getDayNumber()).toDateString()
        this.getElement().append(this.getTimelineElement())
    }

    displayDetailedEvents() {
        const events = Day.focus.currDay.getAllCalendarEventUIs()
        const timeline = gsap.timeline()
        for(const [i, currEvent] of events.entries()) {
            currEvent.setEventCard()
            if (Timeline.timelineChanged){
                this.getElement().append(currEvent.getEventCard())
                timeline.from(currEvent.getEventCard(), {x: "-110%"})    
                currEvent.getEventCard().classList.remove("hourCard", "weekCard")
                currEvent.getEventCard().classList.add("listCard")
            } else if (currEvent == Day.focus.newestEvent) {
                const element = currEvent.getEventCard()
                element.classList.add("listCard")
                if (events.length == 1 || events.length == i + 1) {                
                    this.getElement().append(element)
                } else {
                    this.getElement().insertBefore(element, events[i + 1].getEventCard())
                }
                gsap.from(element, {x: "-150%"})
                Day.focus.newestEvent = null
                break
            }
        }
        Timeline.resetTimelineChanged()
    }
}

export class WeekTimeline extends Timeline {
    constructor() {
        super("week") 
    }
}