import './style.css'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import handleKeyAndMouse from './handleKeyAndMouse'
import CannonDebugger from 'cannon-es-debugger'
import createLightsGroup from './lights'
import createPlayer from './player'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { createGroud, updateGround } from './ground'
import { isAssetsLoaded, loadAssets } from './loadAssets'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const debugBoxHTML = document.querySelector('#debugBox')
const stats = new Stats();

let cannonDebugger
let controls

let renderer
let scene
let camera
let world
let player = {}

let { keysState, keyBindings } = handleKeyAndMouse()


loadAssets()
LoadingScreen()

function LoadingScreen() {
    if (!isAssetsLoaded) {
        console.log('assetsNotLoaded');
        requestAnimationFrame(LoadingScreen)
    } else {
        console.log('AssetsLoaded');
        initGame()
    }
}


function initGame() {

    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    renderer.shadowMap.enabled = true

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 16, 0)
    controls = new OrbitControls(camera, renderer.domElement)

    camera.lookAt(0, 0, 0)

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
    })

    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
    })

    const { playerBody, playerMesh } = createPlayer()
    player.mesh = playerMesh
    player.body = playerBody
    scene.add(player.mesh)
    world.addBody(player.body)
    player.body.position.set(0, 2, 0)

    const lightGroup = createLightsGroup()
    scene.add(lightGroup)

    const { groundBody, groundTileGroup } = createGroud()
    world.addBody(groundBody)
    scene.add(groundTileGroup)

    const helper = new THREE.CameraHelper(lightGroup.children[1].shadow.camera);
    scene.add(helper)

    cannonDebugger = new CannonDebugger(scene, world)

    animate()
}

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

    // debugBoxHTML.innerText = camera.position.x.toFixed(2) + ' ' + camera.position.y.toFixed(2) + ' ' + camera.position.z.toFixed(2)

    controls.update()
    cannonDebugger.update()
    renderer.render(scene, camera)
    stats.update();
    requestAnimationFrame(animate)
}
