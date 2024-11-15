import { AmbientLight, DirectionalLight, Group } from 'three'

export default function createLightsGroup() {
    const lightGroup = new Group()

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    lightGroup.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.5)
    lightGroup.add(directionalLight)
    directionalLight.position.set(10, 10, 10)

    directionalLight.castShadow = true
    return lightGroup
}