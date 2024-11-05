import { AmbientLight, DirectionalLight, Group } from 'three'

export default function createLightsGroup() {
    const lightGroup = new Group()

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    lightGroup.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 0.5)
    lightGroup.add(directionalLight)
    directionalLight.position.set(1, 1, 1)
    directionalLight.castShadow = true
    return lightGroup
}