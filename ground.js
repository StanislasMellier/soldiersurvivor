import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { assets } from './loadAssets'

const GROUND_GRID_SIZE = 5
const CHUNCK_SIZE = 25
const MAX_ASSETS_PER_TILE = 3

let groundTileGroup
function createGroud() {

    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

    groundTileGroup = new THREE.Group()
    const GroundTileGeometry = new THREE.PlaneGeometry(CHUNCK_SIZE, CHUNCK_SIZE)
    GroundTileGeometry.rotateX(-Math.PI / 2)
    const tileMaterial = new THREE.MeshStandardMaterial({ color: 'lightgreen' })

    let sizeDiv2 = Math.floor(GROUND_GRID_SIZE / 2)
    for (let x = -sizeDiv2; x < GROUND_GRID_SIZE - sizeDiv2; x++) {
        for (let y = -sizeDiv2; y < GROUND_GRID_SIZE - sizeDiv2; y++) {

            const tile = new THREE.Mesh(GroundTileGeometry, tileMaterial)

            tile.receiveShadow = true
            tile.castShadow = true

            GenerateEnvironmentOnTile(tile)

            tile.position.x = x * CHUNCK_SIZE
            tile.position.z = y * CHUNCK_SIZE
            groundTileGroup.add(tile)
        }
    }

    return { groundBody, groundTileGroup }
}
let assetsTemp = []
function GenerateEnvironmentOnTile(tile) {

    const numberOfAssets = Math.floor(Math.random() * MAX_ASSETS_PER_TILE)


    for (let i = 0; i < numberOfAssets; i++) {
        const asset = assets[Math.floor(Math.random() * assets.length)].scene.clone()

        asset.position.x = Math.random() * CHUNCK_SIZE / 2
        asset.position.z = Math.random() * CHUNCK_SIZE / 2
        tile.add(asset)
    }
}
function updateGround(playerDirection) {
    groundTileGroup.children.forEach(tile => {
        tile.position.x += playerDirection.x
        tile.position.z += playerDirection.y

        if (tile.position.x > CHUNCK_SIZE * GROUND_GRID_SIZE / 2) {
            tile.position.x = tile.position.x - CHUNCK_SIZE * GROUND_GRID_SIZE
        }
        if (tile.position.x < -CHUNCK_SIZE * GROUND_GRID_SIZE / 2) {
            tile.position.x = tile.position.x + CHUNCK_SIZE * GROUND_GRID_SIZE
        }
        if (tile.position.z > CHUNCK_SIZE * GROUND_GRID_SIZE / 2) {
            tile.position.z = tile.position.z - CHUNCK_SIZE * GROUND_GRID_SIZE
        }
        if (tile.position.z < -CHUNCK_SIZE * GROUND_GRID_SIZE / 2) {
            tile.position.z = tile.position.z + CHUNCK_SIZE * GROUND_GRID_SIZE
        }

    })
}

export { createGroud, updateGround }

