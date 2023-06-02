import generateRandomEventData from "./randomEventGenerator.js"
import CalendarEventUI from "./CalendarEventUI.js"
import CalendarEvent from "./CalendarEvent.js"
import UI from "./UI.js"

export default class PopUp extends UI {
    static dialog = document.querySelector("dialog")
    #nameInput
    #descriptionInput
    #startTimeInput
    #endTimeInput
    #venueInput
    #colorInput

    constructor() {
        super()
        PopUp.dialog.replaceChild(this.getElement(), PopUp.dialog.lastElementChild)
        this.#nameInput = document.createElement("input")
        this.#nameInput.type = 'text'
        this.#descriptionInput = document.createElement("input")
        this.#descriptionInput.type = 'text'
        this.#startTimeInput = document.createElement("input")
        this.#startTimeInput.type = 'time'
        this.#startTimeInput.step = 300
        this.#endTimeInput = document.createElement("input")
        this.#endTimeInput.type = 'time'
        this.#endTimeInput.step = 300
        this.#venueInput = document.createElement("input")
        this.#venueInput.type = 'text'
        this.#colorInput = document.createElement("input")
        this.#colorInput.type = 'color'
        this.getElement().append(this.#nameInput, this.#descriptionInput, this.#startTimeInput, this.#endTimeInput, this.#venueInput, this.#colorInput)

        
    }


    fillValues(e = {eventName: "", eventDescription: "", eventStartTime: "", eventEndTime: "23:59", eventVenue: "", eventColor: "#000000"}) {
        this.#nameInput.value = e.eventName
        this.#descriptionInput.value = e.eventDescription
        this.#startTimeInput.value = e.eventStartTime
        this.#endTimeInput.value = e.eventEndTime
        this.#venueInput.value = e.eventVenue
        this.#colorInput.value = e.eventColor
    }

    getData() {
        const valMap = new Map();
        valMap.set("name", this.#nameInput.value)
        valMap.set("description", this.#descriptionInput.value)
        valMap.set("startTime", this.#startTimeInput.value)
        valMap.set("endTime", this.#endTimeInput.value)
        valMap.set("venue", this.#venueInput.value)
        valMap.set("color", this.#colorInput.value)
        return valMap
    }

    queryData() {
        return new Promise((resolve, reject) => {
            const cross = this.getElement().previousElementSibling
            const isValid = () => {
                for (const val of this.getData().values()) {
                    if (!val) {
                        cross.setAttribute("data-valid", 0) //0 is false
                        return
                    }
                }
                cross.setAttribute("data-valid", 1) //1 is true
            }

            const submit = () => {
                cross.removeEventListener("click", submit)
                this.getElement().removeEventListener("input", isValid)
                if (+cross.getAttribute("data-valid")) {
                    resolve()
                } else {
                    reject()
                }
            }
            cross.addEventListener("click", submit)
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
        this.getElement().previousElementSibling.setAttribute("data-valid", 0) //0 is false
    }
}