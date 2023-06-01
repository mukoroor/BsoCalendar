export default class CalendarEvent {
    #name
    #startTime
    #endTime
    #venue
    #color
    #description
    
    constructor(map) {
        this.#name = map.get("name") 
        this.#venue = map.get("venue") 
        this.#startTime = map.get("startTime") 
        this.#endTime = map.get("endTime") 
        this.#color = map.get("color") 
        this.#description = map.get("description") 
    }

    getSummarizedData() {
        return this.#name + ": " + this.#startTime;
    }

    getStartTime() {
        return this.#startTime
    }

    getEndTime() {
        return this.#endTime
    }

    getHour() {
        return Math.floor(this.#startTime.replace(":", "") / 100)
    }

    getMinutes() {
        return Math.floor(this.#startTime.replace(":", "") % 100)
    }

    getTimeRangeString() {
        return `${this.#startTime} to ${this.#endTime}`;
    }

    setStartTime(newTime) {
        this.#startTime = newTime
    }

    setEndTime(newTime) {
        this.#endTime = newTime
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

    calculateTimeRange() {
        const start = new Date(`2000-01-01T${this.#startTime}`);
        const end = new Date(`2000-01-01T${this.#endTime}`);
      
        const differenceInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      
        return differenceInMinutes;
    }

    static compare(a, b) {
        if (a === b) return 0

        let diff = CalendarEvent.compareTime(a.getStartTime(), b.getStartTime())
        
        if (!diff) {
            diff = CalendarEvent.compareTime(a.getEndTime(), b.getEndTime())

            if (!diff) {
                const compareName = a.getName().localeCompare(b.getName())
                if (!compareName) {
                    return a.getColor().localeCompare(b.getColor())
                }
                return compareName 
            }
        }
        return diff
    }

    static compareTime(eventATime, eventBTime) {
        let aHash = +eventATime.replace(":", "")
        let bHash = +eventBTime.replace(":", "")
        return aHash - bHash
    }
}
