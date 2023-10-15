import UI from "./UI.js"
import Day from "./Day.js"

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

    constructor() {
        super("day")
        let i = 0
        const hourContainer = document.createElement("div")
        hourContainer.classList.add("hour-container")
        while (i < 24) {
            const hr = document.createElement("div")
            hr.textContent = (i % 12 ? i % 12 : 12 ) + ":00 " + (i++ < 12 ? "AM": "PM" ) 
            hr.classList.add("hour")
            hourContainer.append(hr) 
        }
        const expandDiv = document.createElement("div")
        expandDiv.id = "expandDiv"
        const hourCardContainer = document.createElement("div")
        hourCardContainer.classList.add("hourCard-container")
        this.getElement().append(expandDiv)
        this.getElement().append(hourCardContainer)
        this.getElement().append(hourContainer)
        let _t = this
        document.addEventListener("keydown", (e) => this.changeWidth(e)) 
    }
    
    displayDetailedEvents() {
        const parentElement = this.getElement().querySelector(".hourCard-container")
        const notify = (hourCard) => {
            hourCard.classList.add("showNewEvent")
            parentElement.scrollTo({top: 0, left: hourCard.offsetLeft - 24, behavior: "smooth"})
            setTimeout(() => {
                hourCard.classList.remove("showNewEvent")
            }, 500)
        }
        const timeGroups = Day.focus.currDay.groupEventsByFlowStartTime()
        if (timeGroups.length) {
            for (const eventArr of timeGroups) {
                for (const _e of eventArr) {
                    const _ce = _e.getCalendarEvent()
                    _e.setMinEventCard()
                    _e.getMinEventCard().classList.add("hourCard")
                    _e.getMinEventCard().setAttribute("title", `${_ce.getName()}\n${_ce.getVenue()}\n${_ce.getTimeRangeString()}`)
                    _e.getMinEventCard().style.gridColumn = `${1 + 12 * _ce.getHour() + _ce.getMinutes() / 5} / span ${_ce.calculateTimeRange() / 5}`
                    parentElement.append(_e.getMinEventCard())
                }
            }
            if (Day.focus.newestEvent) {
                // notify(Day.focus.newestEvent.getMinEventCard())
                Day.focus.newestEvent = null
            }
            timeGroups[0][0].getMinEventCard().scrollIntoView({ behavior: "smooth", block: "start"})
        }
        Timeline.resetTimelineChanged()
    }

    changeWidth(e) {
        if (e.key === 'p' || e.key === 'm') {
            let currWidth = +window.getComputedStyle(this.getElement()).getPropertyValue("--hourWidth").slice(0, -2)
            if (e.key === "p") {
                if (currWidth < 38.75) {
                    currWidth += 0.05
                }
            } else if (e.key === "m") {   
                if (currWidth > 3) {
                    currWidth -= 0.05
                }
            }
            window.requestAnimationFrame(() => this.getElement().style.setProperty("--hourWidth", `${currWidth}ch`))
        }
    }

    clearElement() {
        const temp = this.getElement()
        this.setElement(temp.querySelector(".hourCard-container"))
        super.clearElement(".hourCard")
        this.setElement(temp)
    }
}

export class ListTimeline extends Timeline {
    constructor() {
        super("list")
    }
    
    displayDetailedEvents() {
        const events = Day.focus.currDay.getEventArray()
        // const timeline = gsap.timeline()
        for(const [i, currEvent] of events.entries()) {
            currEvent.setEventCard()
            if (Timeline.timelineChanged){
                this.getElement().append(currEvent.getEventCard())
                // timeline.from(currEvent.getEventCard(), {x: "-110%"})    
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
                // gsap.from(element, {x: "-150%"})
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
