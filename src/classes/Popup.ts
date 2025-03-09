function toggleModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        if (modal.hasAttribute("open")) {
            modal.close() 
        } else {
            modal.showModal() 
        }
    } else {
        console.warn("The modal id was not found: ", id)
    }
}
export class Popup {    
    title: string
    description: string
    ui: HTMLDialogElement
    parent: HTMLElement
    error: Error

    constructor(container: HTMLElement, error: Error, title: string) {        
        // Project data definition
        this.error = error
        this.description = error.message
        this.parent = container
        this.title = title
        this.setUI()
    }

    // Project card UI        
    setUI() {
        this.ui = document.createElement('dialog')
        this.ui.className = "error-popup"
        this.ui.id = "error-popup"
        this.ui.innerHTML = `
        <div id="error-container" style="min-width: 600px">
            <h2 style="padding: 10px 0px">${this.title}</h2>
            <p style="margin: 10px 0px">${this.description}</p>
            <div id="popup-form-buttons" style="display: flex; flex-direction: row; justify-content: flex-end">
                <button id="ok-btn" type="button" class="ok-btn">Ok</button>
            </div>
        </div>
        `
        this.parent.appendChild(this.ui)
        toggleModal("error-popup")
        const okBtn = document.getElementById("ok-btn")
        okBtn?.addEventListener("click", () => {
            toggleModal("error-popup")
            this.ui.remove()
        })
    }
}