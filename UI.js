export default class UI {
    #element
    
    constructor() {
        this.#element = document.createElement("div")
    }

    getElement() {
        return this.#element
    }

    setElement(newElement) {
        this.#element = newElement
    }

    dispatchEvent(event) {
        this.#element.dispatchEvent(event)
    }
}
