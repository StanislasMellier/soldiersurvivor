import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export default function createPlayer() {
    const playerMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
    const playerBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(0.5),
        angularDamping: 1.0,
        angularFactor: new CANNON.Vec3(0, 0, 0),
        linearDamping: 0.1,
    })

    playerMesh.receiveShadow = true
    playerMesh.castShadow = true

    playerMesh.body = playerBody
    playerBody.mesh = playerMesh
    return { playerBody, playerMesh }
}