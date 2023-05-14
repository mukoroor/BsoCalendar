export default class CalendarEvent {
    #name
    #time
    #venue
    #color
    #description
    
    constructor(map) {
        this.#name = map.get("name") 
        this.#time = map.get("time") 
        this.#venue = map.get("venue") 
        this.#color = map.get("color") 
        this.#description = map.get("description") 
    }

    getSummarizedData() {
        return this.#name + ": " + this.#time;
    }

    getTime() {
        return this.#time
    }

    getHour() {
        return Math.floor(this.#time.replace(":", "") / 100)
    }

    getMinute() {
        return Math.floor(this.#time.replace(":", "") % 100)
    }

    setTime(newTime) {
        this.#time = newTime
    }

    getName() {
        return this.#name
    }

    setName(newName) {
        this.#name = newName
    }
    
    getVenue() {
        return this.#venue
    }

    setVenue(newVenue) {
        this.#venue = newVenue
    }

    getColor() {
        return this.#color
    }

    setColor(newColor) {
        this.#color = newColor
    }

    getDescription() {
        return this.#description
    }

    setDescription(newDescription) {
        this.#description = newDescription
    }

    static compare(a, b) {
        const aHash = +a.getTime().replace(":", "")
        const bHash = +b.getTime().replace(":", "")

        let diff = aHash - bHash

        if (!diff) {
            return a.getName().localeCompare(b.getName())
        }
        return diff
    }
}
