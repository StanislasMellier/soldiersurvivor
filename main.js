import './style.css'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import handleKeyAndMouse from './handleKeyAndMouse'
import CannonDebugger from 'cannon-es-debugger'
import createLightsGroup from './lights'
import createPlayer from './player'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { createGroud, updateGround } from './ground'

const debugBoxHTML = document.querySelector('#debugBox')
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

const scene = new THREE.Scene()

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const cameraCenter = new THREE.Object3D()
scene.add(cameraCenter)
cameraCenter.add(camera)
camera.position.set(2, 3, 3)
camera.lookAt(0, 0, 0)

const { playerBody, playerMesh } = createPlayer()
scene.add(playerMesh)
world.addBody(playerBody)
playerBody.position.set(0, 2, 0)


const lightGroup = createLightsGroup()
scene.add(lightGroup)

const { keysState, keyBindings } = handleKeyAndMouse()

const cannonDebugger = new CannonDebugger(scene, world)

let playerChunkCoord = new THREE.Vector2(0, 0)


const { groundBody, groundTileGroup } = createGroud()
world.addBody(groundBody)
scene.add(groundTileGroup)

function animate() {
    world.fixedStep(1 / 60)

    let playerDirection = new THREE.Vector2()
    if (keysState['KeyW'] === true) {
        playerDirection.y = 1
    }
    if (keysState['KeyA'] === true) {
        playerDirection.x = 1
    }
    if (keysState['KeyS'] === true) {
        playerDirection.y = -1
    }
    if (keysState['KeyD'] === true) {
        playerDirection.x = -1
    }
    playerDirection.clampLength(0, 0.1)


    updateGround(playerDirection)

    world.bodies.forEach(body => {
        if (body.mesh) {
            body.mesh.position.copy(body.position)
            body.mesh.quaternion.copy(body.quaternion)
        }
    })

    cameraCenter.position.copy(playerBody.position)

    cannonDebugger.update()
    renderer.render(scene, camera)
    stats.update();
    requestAnimationFrame(animate)
}

animate()