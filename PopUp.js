import generateRandomEventData from "./randomEventGenerator.js"
import CalendarEventUI from "./CalendarEventUI.js"
import CalendarEvent from "./CalendarEvent.js"
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

        
    }


    fillValues(e = {eventName: "", eventDescription: "", eventTime: "", eventVenue: "", eventColor: "#000000"}) {
        this.#nameInput.value = e.eventName
        this.#descriptionInput.value = e.eventDescription
        this.#timeInput.value = e.eventTime
        this.#venueInput.value = e.eventVenue
        this.#colorInput.value = e.eventColor
    }

    getData() {
        const valMap = new Map();
        valMap.set("name", this.#nameInput.value)
        valMap.set("description", this.#descriptionInput.value)
        valMap.set("time", this.#timeInput.value)
        valMap.set("venue", this.#venueInput.value)
        valMap.set("color", this.#colorInput.value)
        return valMap
    }

    checkData() {
        return new Promise((resolve) => {
            const isValid = () => {
                for (const val of this.getData().values()) {
                    if (!val) {
                        PopUp.dialog.firstElementChild.setAttribute("data-valid", 0) //0 is false
                        return
                    }
                }
                PopUp.dialog.firstElementChild.setAttribute("data-valid", 1) //1 is true
                this.getElement().removeEventListener("input", isValid) 
                resolve()
            }

            this.getElement().addEventListener("input", isValid) 
        })
    }

    saveCalendarEvent() {
        return new CalendarEventUI(new CalendarEvent(this.getData()))
        
    }
    
    randomCalendarEvent() { 
        this.fillValues(generateRandomEventData())
        return this.saveCalendarEvent()
    }

    open() {
        this.getElement().parentElement.showModal()
    }
    
    close() {
        this.getElement().parentElement.close()
        this.fillValues()
        PopUp.dialog.firstElementChild.setAttribute("data-valid", 0) //0 is false
    }
}