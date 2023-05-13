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
