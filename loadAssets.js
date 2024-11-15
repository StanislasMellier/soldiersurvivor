import { GLTFLoader } from 'three/examples/jsm/Addons.js'


const assetsData = [
    { filename: 'CommonTree_1', filetype: 'glb' },
    { filename: 'CommonTree_2', filetype: 'glb' },
    // { filename: 'CommonTree_3', filetype: 'obj' },
    // { filename: 'CommonTree_4', filetype: 'obj' },
    // { filename: 'CommonTree_5', filetype: 'obj' }
]

let assets = []
let isAssetsLoaded = false

const gltfLoader = new GLTFLoader()
function loadAssets() {
    assetsData.forEach(asset => {


        gltfLoader.load(`./assets/${asset.filename}.${asset.filetype}`, (result) => {
            result.name = asset.filename

            console.log(result);

            result.scene.traverse((node) => {

                if (node.isMesh || node.isLight) node.castShadow = true;

                if (node.isMesh || node.isLight) node.receiveShadow = true;

            });

            assets.push(result)
            if (assets.length === assetsData.length) {
                isAssetsLoaded = true
            }
        })
    })
}

export { assets, isAssetsLoaded, loadAssets }