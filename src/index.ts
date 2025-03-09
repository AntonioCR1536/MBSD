import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { Popup } from "./Classes/Popup"
import { Project, IProject, Role, ProjectStatus } from "./Classes/Project"
import { ProjectsManager } from "./Classes/ProjectsManager"

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

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

const cancelBtn = document.getElementById("cancel-button") as HTMLElement
cancelBtn.addEventListener("click", () => {
    toggleModal("new-project-modal")
})

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      role: formData.get("role") as Role,
      cost: formData.get("cost") as unknown as number,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      toggleModal("new-project-modal")
    } catch (err) {
      //const popupContainer = document.getElementById("content") as HTMLElement
      new Popup(projectForm, err, projectsManager.errorTitle)
    }
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn= document.getElementById("download-project-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("upload-project-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

// ThreeJS viewer

const scene = new THREE.Scene()
const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true})
viewerContainer.append(renderer.domElement)

function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width, containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeViewer)

resizeViewer()


const boxGeom = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
/*const materialColor = new THREE.Color().setRGB(255, 205, 5)
material.color.set(materialColor)*/
const cube = new THREE.Mesh(boxGeom, material)
cube.position.y = 0.5

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
const spotLight = new THREE.SpotLight()
ambientLight.intensity = 0.3

scene.add(directionalLight, ambientLight, spotLight)

const cameraControls = new OrbitControls(camera, viewerContainer)

function renderScene() {
  renderer.render(scene, camera)
  requestAnimationFrame(renderScene)
}

renderScene()

const axes = new THREE.AxesHelper()
const grid = new THREE.GridHelper()
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
grid.material.transparent = true
grid.material.opacity = 0.5
grid.material.color = new THREE.Color("#808080")
scene.add(axes, grid, directionalLightHelper)

const gui = new GUI()
/*const cubeControls = gui.addFolder("Cube")
cubeControls.add(cube.position, "x", -10, 10, 0.5)
cubeControls.add(cube.position, "y", -10, 10, 0.5)
cubeControls.add(cube.position, "z", -10, 10, 0.5)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material, "color")*/
const directionalLightControls = gui.addFolder("Directional Light")
directionalLightControls.add(directionalLight.position, "x", -100, 100, 0.5)
directionalLightControls.add(directionalLight.position, "y", -100, 100, 0.5)
directionalLightControls.add(directionalLight.position, "z", -100, 100, 0.5)
directionalLightControls.add(directionalLight, "intensity", 1, 1000, 1)
directionalLightControls.add(directionalLight, "visible")
directionalLightControls.addColor(directionalLight, "color")
const spotLightControls = gui.addFolder("Spot Light")
spotLightControls.add(spotLight.position, "x", -100, 100, 0.5)
spotLightControls.add(spotLight.position, "y", -100, 100, 0.5)
spotLightControls.add(spotLight.position, "z", -100, 100, 0.5)
spotLightControls.add(spotLight, "intensity", 1, 1000, 1)
spotLightControls.add(spotLight, "visible")
spotLightControls.addColor(spotLight, "color")

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
const mgltfLoader = new GLTFLoader()


/*mtlLoader.load("../assets/gear/Gear1.mtl", (materials) => {
  materials.preload()
  objLoader.setMaterials(materials)
  objLoader.load("../assets/gear/Gear1.obj", (mesh) => {
    scene.add(mesh)
  })
})*/

mgltfLoader.load("../assets/broccoli/broccoli_v3.gltf", (gltf) => {
    scene.add(gltf.scene)
  })