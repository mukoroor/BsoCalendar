import generateRandomEventData from "./randomEventGenerator.js"
import CalendarEvent from "./CalendarEvent.js"
import CalendarEventUI from "./CalendarEventUI.js"
import Day from "./Day.js"
import UI from "./UI.js"

export default class PopUp extends UI {
    static dialog = document.querySelector("dialog")
    #nameInput
    #descriptionInput
    #timeInput
    #venueInput
    #colorInput

    constructor() {
        super()
        PopUp.dialog.replaceChild(this.getElement(), PopUp.dialog.lastElementChild)
        this.#nameInput = document.createElement("input")
        this.#nameInput.type = 'text'
        this.#descriptionInput = document.createElement("input")
        this.#descriptionInput.type = 'text'
        this.#timeInput = document.createElement("input")
        this.#timeInput.type = 'time'
        this.#venueInput = document.createElement("input")
        this.#venueInput.type = 'text'
        this.#colorInput = document.createElement("input")
        this.#colorInput.type = 'color'
        this.getElement().append(this.#nameInput, this.#descriptionInput, this.#timeInput, this.#venueInput, this.#colorInput)

        this.getElement().addEventListener("input", async() => {
            const valid = this.isValid()
            if (valid) {
                PopUp.dialog.firstElementChild.setAttribute("data-valid", 1) //1 is true
            } else {
                PopUp.dialog.firstElementChild.setAttribute("data-valid", 0) //0 is false
            }
        })

        PopUp.dialog.firstElementChild.addEventListener("click", () => {
            if (!Day.focus.selectionSet.size) this.saveCalendarEvent()
            this.close()
        })
    }


    fillValues(e = {eventName: "", eventDescription: "", eventTime: "", eventVenue: "", eventColor: ""}) {
        this.#nameInput.value = e.eventName
        this.#descriptionInput.value = e.eventDescription
        this.#timeInput.value = e.eventTime
        this.#venueInput.value = e.eventVenue
        this.#colorInput.value = e.eventColor
    }

    getData() {
        let c = this
        // return new Promise((resolve, reject) => {
            
        //     const valMap = new Map();
        //     function check() {
        //         if (c.isValid()) {
        //             valMap.set("name", c.#nameInput.value)
        //             valMap.set("description", c.#descriptionInput.value)
        //             valMap.set("time", c.#timeInput.value)
        //             valMap.set("venue", c.#venueInput.value)
        //             valMap.set("color", c.#colorInput.value)
        //             resolve(valMap)
        //         } else {
        //             setTimeout(check, 100)
        //         }

        //     }
        //     check()
        // })
        const valMap = new Map();
        valMap.set("name", c.#nameInput.value)
        valMap.set("description", c.#descriptionInput.value)
        valMap.set("time", c.#timeInput.value)
        valMap.set("venue", c.#venueInput.value)
        valMap.set("color", c.#colorInput.value)
        return valMap
    }

    isValid() {
        return new Promise((resolve) => {
            for (const val of this.getData().values()) {
                if (!val) {
                    resolve(false)
                }
            }
            resolve(true)
        })
    }

    saveCalendarEvent() {
        if (this.isValid()) {
            const event = new CalendarEventUI(new CalendarEvent(this.getData()))
            Day.focus.currDay.addCalEventUI(event)
            this.fillValues()
            PopUp.dialog.firstElementChild.setAttribute("data-valid", 0) //0 is false
        }
    }
    
    randomCalendarEvent() { 
        this.fillValues(generateRandomEventData())
        this.saveCalendarEvent()
    }

    open() {
        this.getElement().parentElement.showModal()
    }

    close() {
        this.getElement().parentElement.close()
    }
}