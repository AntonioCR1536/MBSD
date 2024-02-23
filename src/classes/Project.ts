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

    constructor (data: IProject) {        
        // Project properties
        for (const key in data) {
            this[key] = data[key]
        }
        this.setUI()
        this.id = uuidv4()
    }

    setUI() {
        // UI Definition
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML =
        `<div class="card-header">
            <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
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