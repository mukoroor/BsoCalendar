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
        star.addEventListener("click", (e) => {
            this.#starred = !this.#starred
            this.getElement().classList.toggle("starred", this.#starred)
            this.getEventCard()?.classList.toggle("starred", this.#starred)
            this.getMinEventCard()?.classList.toggle("starred", this.#starred)
            Day.dataPanel.setData()
            e.stopPropagation()
        })

        this.getElement().append(displayedText, star)

        this.updateDisplayedData()
        this.getElement().classList.add("event")
        this.getElement().addEventListener("infoChanged", this.updateDisplayedData)
        this.getElement().addEventListener("click", (e) => {
            const selected = this.getElement().classList.toggle("select")
            this.getElement().classList.remove("tentative")
            console.log(Day.focus.selectionSet)
            if (selected) {
                Day.focus.selectionSet.add(this)
            } else {
                Day.focus.selectionSet.delete(this)
            }
            e.stopPropagation()
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
        eventCard.classList.toggle("starred", this.#starred)
        
        nameSpan.textContent = this.#calendarEvent.getName()
        venueSpan.textContent = this.#calendarEvent.getVenue()
        description.textContent = this.#calendarEvent.getDescription()
        eventCard.style.setProperty("--bColor", `${this.#calendarEvent.getColor().h}, ${this.#calendarEvent.getColor().s}%`)
    
        this.#eventCard = eventCard
    
        eventCard.addEventListener("dblclick", () => Day.focus.currDay.removeCalEventUIByHTML(eventCard))
    }
    
    setMinEventCard() {
        if (this.#minEventCard) return
        const minEventCard = document.createElement("div")
        const data = document.createElement("div")
    
        minEventCard.replaceChildren(data)

        minEventCard.classList.add("eventCard")
        minEventCard.classList.toggle("starred", this.#starred)
    
        data.textContent = `${this.#calendarEvent.getName()}\n${this.#calendarEvent.getVenue()}`
        minEventCard.style.setProperty("--bColor", `${this.#calendarEvent.getColor().h}, ${this.#calendarEvent.getColor().s}%`)

        this.#minEventCard = minEventCard
    }

    updateDisplayedData() {
        this.getElement().firstElementChild.textContent = this.#calendarEvent.getSummarizedData();
        const hs = this.#calendarEvent.getColor()
        this.getElement().style.backgroundColor = `hsl(${hs.h}, ${hs.s}%, var(--lightness))`

        if (this.#minEventCard) {
            this.#minEventCard.firstElementChild.textContent = `${this.#calendarEvent.getName()}\n${this.#calendarEvent.getVenue()}`
            this.#minEventCard.style.setProperty("--bColor", `${hs.h}, ${hs.s}%`)
        }

        if (this.#eventCard) {
            this.#eventCard.firstElementChild.firstElementChild.textContent = this.#calendarEvent.getName()
            this.#eventCard.firstElementChild.lastElementChild.textContent = this.#calendarEvent.getVenue()
            this.#eventCard.lastElementChild.textContent = this.#calendarEvent.getDescription()
            this.#eventCard.style.setProperty("--bColor", `${hs.h}, ${hs.s}%`)
        }
    }

    static compare(a, b) {
        return CalendarEvent.compare(a.getCalendarEvent(), b.getCalendarEvent())

    }

    isStarred() {
        return this.#starred
    }

    edit() {
        return new Promise((resolve) => {
            const _c = this.#calendarEvent
            const _p = CalendarEventUI.popUp
            _p.fillValues({eventName: _c.getName(), eventDescription: _c.getDescription(),
                eventStartTime: _c.getStartTime(), eventEndTime: _c.getEndTime(), eventVenue: _c.getVenue(), eventColor: _c.getColor()})
            const finish = () => {
                if (+_p.getElement().previousElementSibling.getAttribute("data-valid")) {
                    const data = _p.getData()
                    Day.focus.currDay.removeCalEventUI(this)
                    _c.setName(data.get("name"))
                    _c.setDescription(data.get("description"))
                    _c.setStartTime(data.get("startTime"))
                    _c.setEndTime(data.get("endTime"))
                    _c.setVenue(data.get("venue"))
                    const h = data.get("colorHue")
                    const s = data.get("colorSaturation")
                    _c.setColor({h, s})
                    this.updateDisplayedData()
                    Day.focus.currDay.addCalEventUI(this)
                }
                _p.close()
                _p.getElement().previousElementSibling.removeEventListener("click", finish)
                resolve()
            }
            _p.open()
            _p.queryData().then(() => {
                _p.getElement().previousElementSibling.addEventListener("click", finish)
            }, () => {
                _p.close()
                resolve()
            })
        })
    }

}