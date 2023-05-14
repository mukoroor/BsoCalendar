import CalendarEvent from "./CalendarEvent.js"
import UI from "./UI.js"

export default class CalendarEventUI extends UI {
    #eventCard
    #calendarEvent
    #minEventCard
    static priorityData = "time" //indicates which info index is prioritized to be shown after name
    static infoChanged = new Event("infoChanged") // event listener for change in infoPriority

    constructor(map) {
        super()
        this.#calendarEvent = new CalendarEvent(map)

        this.setDisplayedText()
        this.getElement().classList.add("event")
        this.getElement().style.backgroundColor = map.get("color");
        this.getElement().addEventListener("infoChanged", this.setDisplayedText)
        this.getElement().setAttribute("title", this.#calendarEvent.getName())
    }

    getCalendarEvent() {
        return this.#calendarEvent
    }

    getEventCard() {
        return this.#eventCard
    }

    getMinEventCard() {
        return this.#minEventCard
    }

    setEventCard() {
        if (this.#eventCard) return
        const eventCard = document.createElement("div")
        const eventHeader = document.createElement("div")
        const nameSpan = document.createElement("span")
        const venueSpan = document.createElement("span")
        const description = document.createElement("p")
    
        eventHeader.replaceChildren(nameSpan, venueSpan)
        eventCard.replaceChildren(eventHeader, description)
    
        eventCard.classList.add("eventCard")
        
        nameSpan.textContent = this.#calendarEvent.getName()
        venueSpan.textContent = this.#calendarEvent.getVenue()
        description.textContent = this.#calendarEvent.getDescription()
        eventCard.style.setProperty("--bColor", this.#calendarEvent.getColor())
    
        this.#eventCard = eventCard
    
        eventCard.addEventListener("click", () => {
    
            // if (!CalendarEvent.currDetailed) {
            //     CalendarEvent.currDetailed = eventCard
            // } else if (CalendarEvent.currDetailed !== eventCard) {
            //     CalendarEvent.currDetailed.dispatchEvent(new Event("click"))
            //     CalendarEvent.currDetailed = eventCard
            // } else {
            //     CalendarEvent.currDetailed = undefined
            // }
    
            // const fullHeight = description.clientHeight + eventHeader.clientHeight
            // if (eventCard.clientHeight < fullHeight) {
            //     eventCard.style.height = `calc(${fullHeight}px + 0.75em)`
            // } else {
            //     eventCard.style.height = "" 
            // }
            // eventCard.classList.toggle("expanded") //i will come back later
        }, false)
    }
    
    setMinEventCard() {
        if (this.#minEventCard) return
        const minEventCard = document.createElement("div")
        const data = document.createElement("p")
    
        minEventCard.replaceChildren(data)

        minEventCard.classList.add("eventCard")
    
        data.textContent = `${this.#calendarEvent.getName()}\n@ ${this.#calendarEvent.getVenue()}`
        minEventCard.style.setProperty("--bColor", this.#calendarEvent.getColor())

        this.#minEventCard = minEventCard
    }

    setDisplayedText() {
        this.getElement().textContent = this.#calendarEvent.getSummarizedData(); 
    }

    static compare(a, b) {
        return CalendarEvent.compare(a.getCalendarEvent(), b.getCalendarEvent())
    }


    
    // static setInfoPriority(newInfoPriority) {
    //     CalendarEvent.infoPriority = newInfoPriority
    //     CalendarEvent.calendarEventMap.forEach((calendarEvent, htmlElement) => {
    //         htmlElement.dispatchEvent(CalendarEvent.infoChanged)
    //     });
    // }


    // static groupEvents(eventDivsContainer) {
    //     const eDivs = [...eventDivsContainer.querySelectorAll(".event")]
    //     const arr = []
    //     let prevHour = -1
    //     let subArr = []

    //     for (let i = 0; i < eDivs.length; i++) {
    //         const c = CalendarEvent.calendarEventMap.get(eDivs[i])
    //         const time = c.info[2].split(":")
    //         const currHour = +time[0]
            
    //         if (currHour !== prevHour) {
    //             if (subArr.length) {
    //                 arr.push(subArr)
    //             }
    //             subArr = [c]
    //             prevHour = currHour
    //         } else {
    //             subArr.push(c)
    //         }
    //         subArr.hour = currHour
    //     }

    //     if (subArr.length) {
    //         arr.push(subArr)
    //     }

    //     return arr
    // }

}