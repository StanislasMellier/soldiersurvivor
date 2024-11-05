


export default function handleKeyAndMouse() {
    let keysState = {}
    let keyBindings = {}

    window.addEventListener('keydown', event => {
        keysState[event.code] = true
    })
    window.addEventListener('keyup', event => {
        keysState[event.code] = false
    })
    window.addEventListener('mousedown', event => {
        keysState[`mouse${event.button}`] = true
    })
    window.addEventListener('mouseup', event => {
        keysState[`mouse${event.button}`] = false
    })
    return { keysState, keyBindings }
}