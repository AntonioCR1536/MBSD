import {IProject, Project} from "./Project"

export class ProjectsManager{
    list: Project[] = []
    ui: HTMLElement

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })
        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project named "${data.name}" already exist.`)            
        }
        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)

        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if(!detailsPage) { return }
        const names = detailsPage.querySelectorAll("[data-project-info='name']")
        for (const name of names) {
            if (name) {name.textContent = project.name}
        }
        const descriptions = detailsPage.querySelectorAll("[data-project-description='description']")
        for (const description of descriptions) {
            if (description) {description.textContent = project.description}
        }
        const code = detailsPage.querySelector("[data-project-code='code']")
        const projectCode = project.name.slice(0,2).toUpperCase()
        if (code) {code.textContent = projectCode}
        const status = detailsPage.querySelector("[data-project-status='status']")
        if (status) {status.textContent = project.status}
        const role = detailsPage.querySelector("[data-project-role='role']")
        if (role) {role.textContent = project.userRole}
        const date = detailsPage.querySelector("[data-project-date='date']")
        if (date) {date.textContent = project.finishDate.toDateString()}
    }

// New comment

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if(!detailsPage) { return }
        const names = detailsPage.querySelectorAll("[data-project-info='name']")
        for (const name of names) {
            if (name) {name.textContent = project.name}
        }
        const descriptions = detailsPage.querySelectorAll("[data-project-description='description']")
        for (const description of descriptions) {
            if (description) {description.textContent = project.description}
        }
        const code = detailsPage.querySelector("[data-project-code='code']")
        const projectCode = project.name.slice(0,2).toUpperCase()
        if (code) {code.textContent = projectCode}
        const status = detailsPage.querySelector("[data-project-status='status']")
        if (status) {status.textContent = project.status}
        const role = detailsPage.querySelector("[data-project-role='role']")
        if (role) {role.textContent = project.userRole}
        const date = detailsPage.querySelector("[data-project-date='date']")
        if (date) {date.textContent = project.finishDate.toDateString()}
    }

    getProject(id: string){
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    deleteProject(id: string){
        const project = this.getProject(id)
        if(!project){return}
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    totalCost(){
        const values = Array()
        this.list.forEach((Project: Project) => {
            values.push(Project.cost)
        })
        return values.reduce(
            (accumulator, currentValue) => {accumulator + currentValue}
            )
        }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }
    
    exportToJSON(filename: string = "projects"){
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: 'application, json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }
    
    importFromJSON(){
        const input = document.createElement("input")
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
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
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }

}