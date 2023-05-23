import UI from "./UI.js"
import Day from "./Day.js"
import Year from "./Year.js"
import Month from "./Month.js"

export default class Timeline extends UI {
    static container = document.querySelector(".view")
    static timelineInstances = []
    static currTimelineIndex = 0
    static timelineChanged = false

    constructor(id) {
        super()
        Timeline.container.append(this.getElement())
        this.getElement().id = id
        Timeline.timelineInstances.push(this)
    }

    displayDetailedEvents() {}

    clearElement(selector = ".eventCard") {
        this.getElement().querySelectorAll(selector).forEach(element => {
           this.getElement().removeChild(element)
        })
    }

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
            next.getElement().classList.toggle("showNewEvent")
            gsap.fromTo(next.getElement(),
            {x: direction}, {x: 0, duration: 1, ease: "power3.out",
            onComplete: () => {
                    curr.clearElement()
                    Timeline.currTimelineIndex = index
                    Timeline.timelineChanged = true
                    next.getElement().classList.toggle("showNewEvent")
                    next.displayDetailedEvents()
                }
            })
        } else {
            Timeline.timelineInstances[Timeline.currTimelineIndex].getElement().style.zIndex = Timeline.timelineInstances.length - 1
            Timeline.timelineInstances[Timeline.currTimelineIndex].displayDetailedEvents()
        }
    }
}

export class DayTimeline extends Timeline {
    #currExpanded = null

    constructor() {
        super("day")
        let i = 0
        while (i < 24) {
            const hr = document.createElement("div")
            hr.textContent = i++
            hr.classList.add("hour")
            this.getElement().append(hr)
        }
    }
    
    displayDetailedEvents() {
        let i = 2
        const parentElement = this.getElement()
        parentElement.classList.toggle("clamp", parentElement.children.length > 36)
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
                child.style.zIndex = childElements.length - i
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
        const notify = (eventGroup, hourCard) => {
            hourCard.classList.add("showNewEvent")
            parentElement.scrollTo({top: 0, left: eventGroup.offsetLeft - 24, behavior: "smooth"})
            setTimeout(() => {
                hourCard.classList.remove("showNewEvent")
                eventGroup.setAttribute("multiplicity", eventGroup.children.length)
            }, 500)
        }
        if (Timeline.timelineChanged) {
            const hourMap = Day.focus.currDay.groupByHour()
            const timeline = gsap.timeline()
            for (const [hour, events] of hourMap.entries()) { 
                const newGroup = createGroupHTML(hour, events)
                newGroup.style.gridRowStart = i++
                newGroup.style.gridColumnStart = 4 * hour + 1
                parentElement.append(newGroup)
                timeline.from(newGroup, {opacity: 0})
            }
            parentElement.querySelector(".eventGroup").scrollIntoView({ behavior: "smooth", block: "center"})
        } else if (Day.focus.newestEvent) {
            let group = parentElement.querySelector(".eventGroup")
            const hour = Day.focus.newestEvent.getCalendarEvent().getHour()
            while(group && group.getAttribute('title') < hour) {
                group = group.nextElementSibling
                i++
            }
            
            Day.focus.newestEvent.setMinEventCard()
            if (group && group.getAttribute('title') == hour) {
                const hourMap = Day.focus.currDay.groupByHour()
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
                newGroup.style.gridColumnStart = 4 * hour + 1
                while (group) {
                    group.style.gridRowStart = i++
                    group = group.nextElementSibling
                }
                notify(newGroup, newGroup.firstElementChild)
                gsap.from(newGroup, {opacity: 0, x: "-100%", ease: "power3.out"})
            }
            Day.focus.newestEvent = null
        }
        Timeline.resetTimelineChanged()
    }

    clearElement() {
        super.clearElement(".eventGroup")
    }
}

export class ListTimeline extends Timeline {
    constructor() {
        super("list")
    }
    
    displayDetailedEvents() {
        const events = Day.focus.currDay.getEventArray()
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
