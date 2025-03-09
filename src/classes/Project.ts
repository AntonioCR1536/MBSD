import { v4 as uuidv4 } from "uuid";

export type ProjectStatus = "Pending" | "Active" | "Finished"
export type Role =  "Architect" | "Engineer" | "Developer"


export interface IProject {
        name: string;
        location: string;
        description: string;
        status: ProjectStatus;
        role: Role;
        cost: number;
        finishDate: Date
    }

    
    // To satisfy IProject
    export class Project implements IProject {
        name: string
        location: string
        description: string
        status: ProjectStatus
        role: Role
        cost: number
        finishDate: Date
        
        // Class internals
        ui: HTMLDivElement
        progress: number = 0
        id: string
        projectColor: string
        
        
        constructor(data: IProject) {
            for (const key in data) {
                this[key] = data[key]
            }
            // Project data definition
            this.id = uuidv4()
            this.projectColor = this.getRandomColor()
            this.setUI()
        }

        private getRandomColor() {
            const colors = {
                0: "#cb7922",
                1: "#bddd53",
                2: "#45cebe",
                3: "#4c81d7",
                4: "#ca34ac"
            }
            const max = Object.keys(colors).length
            const randNumber = Math.floor(Math.random() * max)
            return colors[randNumber]
            }
        
        // Project card UI
        // Creates the project ui
        
        
        setUI() {
            if(this.ui && this.ui instanceof HTMLElement) {return}
            this.ui = document.createElement("div")
            this.ui.className = "project-card"
            this.ui.innerHTML = `
            <div class="card-header">
            <p style="background-color: ${this.projectColor}; padding: 10px; border-radius: 8px; aspect-ratio: 1">${this.name.slice(0,2)}</p>
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
            <p>${this.role}</p>
            </div>
            <div class="card-property">
            <p style="color: #969696;">Cost</p>
            <p>$${this.cost}</p>
            </div>
            <div class="card-property">
            <p style="color: #969696;">Estimated progress</p>
            <p>${this.progress * 100}%</p>
            </div>
            </div>
            `
    }
}