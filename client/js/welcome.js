// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw')
            .catch(err => console.log(`Service Worker: Error: ${err}`))
    })
}


const prompt = document.querySelector('.install-prompt-wrapper')
const y = document.querySelector('.yes')
const n = document.querySelector('.no')
const host = document.querySelector('.host')
const join = document.querySelector('.join')

// n.addEventListener('click', () => {
//     prompt.classList.add('d-none')
//     askName()
// })

window.addEventListener('beforeinstallprompt', (e) => {
    prompt.classList.remove('d-none')
    e.preventDefault()
    deferredPrompt = e
    const name = document.querySelector('.promp-body input')
    name.addEventListener('input', (e) => {
        if (e.target.value.trim().length > 0) {
            y.classList.remove('d-none')
            y.addEventListener('click', () => {
                prompt.classList.add('d-none')
                localStorage.setItem('user', name.value)
                deferredPrompt.prompt()
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        // localStorage.setItem('appInstalled', 'true')
                    }
                })
            })
        }
    })
})

function randomRoomCreator() {
    let num = Math.random().toString(36).substring(2, 15)
    return num.split(num.charAt(4))[0]
}

host.addEventListener('click', () => {
    let roomId = randomRoomCreator()
    if (roomId.length < 4) roomId = randomRoomCreator()
    fetch('/jodo', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(getNewData(roomId)),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then(() => goToPlayground(roomId, 'player1'))
})

function getNewData(id) {
    return {
        sessionId: id,
        data: '',
        layout: '',
        level: document.querySelector('[name="row"]:checked').value,
        player1: {
            name: localStorage.getItem('user'),
            score: ''
        },
        player2: {
            name: '',
            score: ''
        }
    }
}

join.addEventListener('click', () => {
    const roomId = document.querySelector('#join').value.toLowerCase()
    if (roomId.trim().length > 3) {
        fetch(`/jodo/player/${roomId}`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                player2: {
                    name: localStorage.getItem('user')
                }
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(() => goToPlayground(roomId, 'player2'))
    }
})

function goToPlayground (roomId, player) {
    window.location.href = `jodo?sessionId=${roomId}&player=${player}`
}