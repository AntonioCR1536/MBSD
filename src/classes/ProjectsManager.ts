import {IProject, Project} from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    errorTitle: string

    constructor(container: HTMLElement) {
        this.ui = container
        const project = this.newProject({
            name: "Alcazaba",
            location: "Badajoz",
            description: "Default description",
            status: "Pending",
            role: "Architect",
            cost: 3,
            finishDate: new Date()
        })
        project.ui.click()
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            this.errorTitle = "Name in use"
            throw new Error(`Project's name "${data.name}" is already in use, please use another one`)
        }
        const nameLength = data.name.length
        if (nameLength <= 5) {
            this.errorTitle = "Name is too short"
            throw new Error(`Project's name "${data.name}" is too short, must be minimum 5 characters long.`)
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const projectsDetailsPage = document.getElementById("projects-details-page")
            if (!projectsPage || !projectsDetailsPage) {return}
            projectsPage.style.display = "none"
            projectsDetailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }
    
    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("projects-details-page")
        if (!detailsPage) { return }
        const name = detailsPage.querySelector("[data-project-info='name']")
        const headerName = detailsPage.querySelector("[data-project-info='header-name']")
        const acronym = detailsPage.querySelector("[data-project-info='acronym']")
        if (name) { name.textContent = project.name }
        if (headerName) { headerName.textContent = project.name }
        if (acronym) {acronym.textContent = project.name.slice(0,2).toUpperCase()}
        const acc = document.getElementById("project-acronym") as HTMLElement
        acc.style.backgroundColor = project.projectColor
        const location = detailsPage.querySelector("[data-project-info='location']")
        if (location) {location.textContent = project.location}
        const description = detailsPage.querySelector("[data-project-info='description']")
        if (description) {description.textContent = project.description}
        const status = detailsPage.querySelector("[data-project-info='status']")
        if (status) {status.textContent = project.status}
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if (cost) {cost.textContent = "$"+project.cost as unknown as string}
        const role = detailsPage.querySelector("[data-project-info='role']")
        if (role) {role.textContent = project.role}
        const date = detailsPage.querySelector("[data-project-info='finishDate']")
        if (project.finishDate.toDateString() != "Invalid Date") {
            const projectDate = project.finishDate.toDateString()
            if (date) {date.textContent = projectDate}
        } else {
            const projectDate = "Thu Jan 01 2026"
            if (date) {date.textContent = projectDate}
        }        
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    projectsTotalCost() {
        const projectsCosts: number[] = []
        this.list.forEach(e => {
            projectsCosts.push(e.cost)            
        })
        return projectsCosts.reduce((a, b) => a + b)
    }
    
    // This method donr destruct the original list, creates a new one without the indicated id
    deleteProjects(id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }
    
    exportToJSON(fileName: string = "projects") {
        function replacer(key, value) {
            // Filtering out properties
            if (key === "ui"){return undefined}
            return value
        }
        const json = JSON.stringify(this.list, replacer, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }    
    
    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", ()=> {
            const json = reader.result
            if (!json) {return}
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) {return}
            reader.readAsText(filesList[0])
        })
        input.click()
    }
}