import CalendarEvent from "./CalendarEvent.js"
import Day from "./Day.js"
import PopUp from "./PopUp.js"
import UI from "./UI.js"

export default class CalendarEventUI extends UI {
    #calendarEvent
    #minEventCard
    #eventCard
    #starred = false
    static popUp = new PopUp()
    static priorityData = "time" //indicates which info index is prioritized to be shown after name
    static infoChanged = new Event("infoChanged") // event listener for change in infoPriority

    constructor(calendarEvent) {
        super()
        this.#calendarEvent = calendarEvent

        const displayedText = document.createElement("span")
        const star = document.createElement("span")

        star.classList.add("material-symbols-rounded", "star")

        star.textContent = "star"
        star.setAttribute("boolean", this.#starred)
        star.addEventListener("click", (e) => {
            Day.focus.currDay.removeCalEventUI(this)
            star.setAttribute("boolean", this.#starred = !this.#starred)
            Day.focus.currDay.addCalEventUI(this)
            e.stopPropagation()
        })

        this.getElement().append(displayedText, star)

        this.updateDisplayedData()
        this.getElement().classList.add("event")
        this.getElement().addEventListener("infoChanged", this.updateDisplayedData)
        this.getElement().addEventListener("click", () => {
            const selected = this.getElement().classList.toggle("select")
            if (selected) {
                Day.focus.selectionSet.add(this)
            } else {
                Day.focus.selectionSet.delete(this)
            }
            Day.dataPanel.setData()
        })
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
    
        eventCard.addEventListener("dblclick", () => Day.focus.currDay.removeCalEventUIByHTML(eventCard))
    }
    
    setMinEventCard() {
        if (this.#minEventCard) return
        const minEventCard = document.createElement("div")
        const data = document.createElement("p")
    
        minEventCard.replaceChildren(data)

        minEventCard.classList.add("eventCard")
    
        data.textContent = `${this.#calendarEvent.getName()}\n${this.#calendarEvent.getVenue()}`
        minEventCard.style.setProperty("--bColor", this.#calendarEvent.getColor())

        this.#minEventCard = minEventCard
    }

    updateDisplayedData() {
        this.getElement().firstElementChild.textContent = this.#calendarEvent.getSummarizedData();
        this.getElement().style.backgroundColor = this.#calendarEvent.getColor()

        if (this.#minEventCard) {
            this.#minEventCard.firstElementChild.textContent = `${this.#calendarEvent.getName()}\n${this.#calendarEvent.getVenue()}`
            this.#minEventCard.style.setProperty("--bColor", this.#calendarEvent.getColor())
        }

        if (this.#eventCard) {
            this.#eventCard.firstElementChild.firstElementChild.textContent = this.#calendarEvent.getName()
            this.#eventCard.firstElementChild.lastElementChild.textContent = this.#calendarEvent.getVenue()
            this.#eventCard.lastElementChild.textContent = this.#calendarEvent.getDescription()
            this.#eventCard.style.setProperty("--bColor", this.#calendarEvent.getColor())
        }
    }

    static compare(a, b) {
        if (a.isStarred() === b.isStarred()) {
            return CalendarEvent.compare(a.getCalendarEvent(), b.getCalendarEvent())
        } else if (a.isStarred()) {
            return -1
        } else {
            return 1
        }
    }

    isStarred() {
        return this.#starred
    }

    async edit() {
        // const c = this.#calendarEvent
        // // CalendarEventUI.popUp.fillValues({eventName: c.getName(), eventDescription: c.getDescription(),
        // //     eventTime: c.getTime(), eventVenue: c.getVenue(), eventColor: c.getColor()})
        // CalendarEventUI.popUp.open()
        // CalendarEventUI.popUp.getData().then(data => {
        //     this.#calendarEvent.setName(data.get("name"))
        //     this.#calendarEvent.setDescription(data.get("description"))
        //     this.#calendarEvent.setTime(data.get("time"))
        //     this.#calendarEvent.setVenue(data.get("venue"))
        //     this.#calendarEvent.setColor(data.get("color"))
        //     this.updateDisplayedData()
        //     CalendarEventUI.popUp.close()
        //     Day.focus.currDay.removeCalEventUI(this)
        //     Day.focus.currDay.addCalEventUI(this)
        // })
    }

}