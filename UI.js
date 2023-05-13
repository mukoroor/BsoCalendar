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

    addEventListener(type, listenerFunction) {
        this.#element.addEventListener(type, listenerFunction, false)
    }

    addClass(classes) {
        this.#element.classList.add(...classes)
    }

    dispatchEvent(event) {
        this.#element.dispatchEvent(event)
    }

    clearElement() {
        while(this.#element.firstElementChild) {
            this.#element.removeChild(this.#element.firstElementChild)
        }
    }
}
