import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
}

export class Project implements IProject {
    //Interface defined roperties
    name: string
    description: string
    status: "Pending" | "Active" | "Finished"
    userRole: "Architect" | "Engineer" | "Developer"
    finishDate: Date

    //Class internal property
    ui: HTMLDivElement
    cost: 0
    progress: 0
    id: string
    codeBackgroundColor: string
    codeTextColor: string

    constructor (data: IProject) {        
        // Project properties
        for (const key in data) {
            this[key] = data[key]
        }
        this.setCodeColors()
        this.setUI()
        this.id = uuidv4()        
    }

    setCodeColors() {
        const backgroundColors : any[] = ["#5cd6ff", "#EEA7F1", "#FA7A61", "#93F0A3", "#FED148"]
        const textColors : any[] = ["#004D66", "#DB3DE1", "#FDCDC4", "#0F6C1E", "#7A5C00"]
        const zipped : any[] = []
        for(let i = 0; i < backgroundColors.length; i++) {
            zipped.push([backgroundColors[i], textColors[i]])
        }
        const randomIndex = Math.floor(Math.random() * backgroundColors.length)
        const backgroundColor = backgroundColors[randomIndex]
        const textColor = textColors[randomIndex]
        return [this.codeBackgroundColor = backgroundColor, this.codeTextColor = textColor]
    }

    setUI() {
        // UI Definition
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML =
        `<div class="card-header">
            <p style="font-size: 20px; color: ${this.codeTextColor}; background-color: ${this.codeBackgroundColor}; aspect-ratio: 1; border-radius: 100%; padding: 12px; display: flex; justify-content: center; align-items: center;">HC</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
            </div>
            <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress * 100}</p>
            </div>
        </div>`
    }
}