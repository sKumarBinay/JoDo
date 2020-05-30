import { swipedetect } from './js/swipe-detect.js'

const url_string = window.location.href
const url = new URL(url_string)
const c = url.searchParams.get('sessionId')
const p = url.searchParams.get('player')
const board = document.querySelector('.board')
const p1 = document.querySelector('.player1')
const p2 = document.querySelector('.player2')

window.onload = () => {
    fetch(`/jodo/room/${c}`)
        .then(res => res.json())
        .then(res => {
            const row = parseInt(res[0].level)
            board.innerHTML = ''
            for (let i = 1; i <= row; i++) {
                const rowTemplate = `<div class="row" data-row="${i}">
            <span class="area" data-span="r-${i}-1"></span>
            <span class="area" data-span="r-${i}-2"></span>
            <span class="area" data-span="r-${i}-3"></span>
            <span class="area" data-span="r-${i}-4"></span>
            <span class="area" data-span="r-${i}-5"></span>
            </div>`
                board.innerHTML += rowTemplate
                const span = document.querySelectorAll('span.area')
                span.forEach(s => {
                    const data = s.getAttribute('data-span')
                    swipedetect(s, function (swipedir) {
                        if (swipedir === 'right') {
                            s.style.borderTop = '2px solid white'
                            storeBorderColor(`${s.getAttribute('data-span')}-Top`)
                            markAfterJoin(data, swipedir)
                        } else if (swipedir === 'down') {
                            s.style.borderLeft = '2px solid white'
                            storeBorderColor(`${s.getAttribute('data-span')}-Left`)
                            markAfterJoin(data, swipedir)
                        } else if (swipedir === 'left') {
                            const data = s.getAttribute('data-span')
                            const selector = `[data-span="r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) - 1}"]`
                            const previous = document.querySelector(selector)
                            previous.style.borderTop = '2px solid white'
                            storeBorderColor(`${previous.getAttribute('data-span')}-Top`)
                            markAfterJoin(data, swipedir, previous)
                        } else if (swipedir === 'up') {
                            const data = s.getAttribute('data-span')
                            const selector = `[data-span="r-${parseInt(data.split('-')[1]) - 1}-${data.split('-')[2]}"]`
                            const previous = document.querySelector(selector)
                            previous.style.borderLeft = '2px solid white'
                            storeBorderColor(`${previous.getAttribute('data-span')}-Left`)
                            markAfterJoin(data, swipedir, previous)
                        }

                        const boxFormed = checkForSquare(s, swipedir)
                        // countSpan(boxFormed)
                    })

                })
            }
            const sessionId = document.querySelector('.play-room-id')
            sessionId.textContent = res[0].sessionId
            localStorage.setItem('player', p)
            localStorage.setItem('data', res[0].data)
            if (p === 'player1') {
                p1.textContent = localStorage.getItem('user').charAt(0).toUpperCase()
            } else {
                p2.textContent = localStorage.getItem('user').charAt(0).toUpperCase()
            }
            localStorage.setItem('player1score', res[0].player1.score)
            localStorage.setItem('player2score', res[0].player2.score)
            // countSpan()
            let count = 0
            document.querySelectorAll('span').forEach(s => {
                if (s.style.borderTop || s.style.borderLeft === '2px solid white') count++
            })
            window.prevSpanCount = count
            localStorage.getItem('player1score').length
            window.prevP1Score = localStorage.getItem('player1score').length
            window.prevP2Score = localStorage.getItem('player2score').length
            autoRefresh()
        })
}


function markAfterJoin(data, swipedir, prev = null) {
    const current = document.querySelector(`[data-span="${data}"]`)
    const curreSelected = current.hasAttribute('data-selected') ? current.getAttribute('data-selected') : ''
    if (swipedir === 'right') {
        const selector = `[data-span="r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) + 1}"]`
        const next = document.querySelector(selector)
        const selected = next.hasAttribute('data-selected') ? next.getAttribute('data-selected') : ''
        next.setAttribute('data-selected', `${selected},${data}`)
        current.setAttribute('data-selected', `${curreSelected},r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) + 1}`)
    } else if (swipedir === 'left') {
        const selected = prev.hasAttribute('data-selected') ? prev.getAttribute('data-selected') : ''
        prev.setAttribute('data-selected', `${selected},${data}`)
        current.setAttribute('data-selected', `${curreSelected},r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) - 1}`)
    } else if (swipedir === 'down') {
        const selector = `[data-span="r-${parseInt(data.split('-')[1]) + 1}-${data.split('-')[2]}"]`
        const next = document.querySelector(selector)
        const selected = next.hasAttribute('data-selected') ? next.getAttribute('data-selected') : ''
        next.setAttribute('data-selected', `${selected},${data}`)
        current.setAttribute('data-selected', `${curreSelected},r-${parseInt(data.split('-')[1]) + 1}-${data.split('-')[2]}`)
    } else if (swipedir === 'up') {
        const selected = prev.hasAttribute('data-selected') ? prev.getAttribute('data-selected') : ''
        prev.setAttribute('data-selected', `${selected},${data}`)
        current.setAttribute('data-selected', `${curreSelected},r-${parseInt(data.split('-')[1]) - 1}-${data.split('-')[2]}`)
    }
}

// function countSpan(box) {
//     let count = 0
//     document.querySelectorAll('span').forEach(s => {
//         if (s.style.borderTop || s.style.borderLeft === '2px solid white') count++
//     })
//     p1.classList.toggle('selected')
//     if (count === 0 && localStorage.getItem('player') === 'player2') {
//         board.style.pointerEvents = 'none'
//     }
// }

function checkForSquare(currentSpan, swipedir) {
    const data = currentSpan.getAttribute('data-span')
    if (swipedir === 'up' || swipedir === 'down') {
        const currentSpanRight = document.querySelector(`[data-span="r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) + 1}"]`)
        const currentSpanLeft = document.querySelector(`[data-span="r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) - 1}"]`)
        let selector
        let next
        let nextRight
        let nextLeft
        if (swipedir === 'down') {
            selector = `[data-span="r-${parseInt(data.split('-')[1]) + 1}-${data.split('-')[2]}"]`
            next = document.querySelector(selector)
            nextRight = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) + 1}-${parseInt(data.split('-')[2]) + 1}"]`)
            nextLeft = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) + 1}-${parseInt(data.split('-')[2]) - 1}"]`)
        } else {
            selector = `[data-span="r-${parseInt(data.split('-')[1]) - 1}-${data.split('-')[2]}"]`
            next = document.querySelector(selector)
            nextRight = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) - 1}-${parseInt(data.split('-')[2]) + 1}"]`)
            nextLeft = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) - 1}-${parseInt(data.split('-')[2]) - 1}"]`)
        }

        if (currentSpanRight && nextRight) {
            if (currentSpan.getAttribute('data-selected').search(currentSpanRight.getAttribute('data-span')) !== -1 &&
                next.getAttribute('data-selected').search(nextRight.getAttribute('data-span')) !== -1
                && currentSpanRight.getAttribute('data-selected').search(nextRight.getAttribute('data-span')) !== -1) {
                const span = swipedir === 'down' ? currentSpan : next
                checkScore(span)
                return true
                // window.alert('Right box complete')
            }
        }
        if (currentSpanLeft && nextLeft) {
            if (currentSpan.getAttribute('data-selected').search(currentSpanLeft.getAttribute('data-span')) !== -1 &&
                next.getAttribute('data-selected').search(nextLeft.getAttribute('data-span')) !== -1
                && currentSpanLeft.getAttribute('data-selected').search(nextLeft.getAttribute('data-span')) !== -1) {
                const span = swipedir === 'down' ? currentSpanLeft : nextLeft
                checkScore(span)
                return true
                // window.alert('Left box complete')
            }
        }
    } else if (swipedir === 'left' || swipedir === 'right') {
        const currentSpanUp = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) + 1}-${parseInt(data.split('-')[2])}"]`)
        const currentSpanDown = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) - 1}-${parseInt(data.split('-')[2])}"]`)
        let selector
        let next
        let nextUp
        let nextDown
        if (swipedir === 'right') {
            selector = `[data-span="r-${parseInt(data.split('-')[1])}-${parseInt(data.split('-')[2]) + 1}"]`
            next = document.querySelector(selector)
            nextUp = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) + 1}-${parseInt(data.split('-')[2]) + 1}"]`)
            nextDown = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) - 1}-${parseInt(data.split('-')[2]) + 1}"]`)
        } else {
            selector = `[data-span="r-${parseInt(data.split('-')[1])}-${parseInt(data.split('-')[2]) - 1}"]`
            next = document.querySelector(selector)
            nextUp = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) + 1}-${parseInt(data.split('-')[2]) - 1}"]`)
            nextDown = document.querySelector(`[data-span="r-${parseInt(data.split('-')[1]) - 1}-${parseInt(data.split('-')[2]) - 1}"]`)
        }

        if (currentSpanUp && nextUp) {
            if (currentSpan.getAttribute('data-selected').search(currentSpanUp.getAttribute('data-span')) !== -1 &&
                next.getAttribute('data-selected').search(nextUp.getAttribute('data-span')) !== -1
                && currentSpanUp.getAttribute('data-selected').search(nextUp.getAttribute('data-span')) !== -1) {
                const span = swipedir === 'right' ? currentSpan : next
                checkScore(span)
                return true
                // window.alert('Bottom box complete')
            }
        }
        if (currentSpanDown && nextDown) {
            if (currentSpan.getAttribute('data-selected').search(currentSpanDown.getAttribute('data-span')) !== -1 &&
                next.getAttribute('data-selected').search(nextDown.getAttribute('data-span')) !== -1
                && currentSpanDown.getAttribute('data-selected').search(nextDown.getAttribute('data-span')) !== -1) {

                const span = swipedir === 'right' ? currentSpanDown : nextDown
                checkScore(span)
                return true
                // window.alert('Top box complete')
            }
        }
    }
}

function storeBorderColor(data) {
    localStorage.setItem('data', `${localStorage.getItem('data')}` + '+' + data)
    fetch(`/jodo/${c}`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({
            data: localStorage.getItem('data')
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
}

function autoRefresh() {
    setInterval(() => {
        fetch(`/jodo/room/${c}`)
            .then(res => res.json())
            .then(res => {
                if (p2.textContent === '') {
                    p2.textContent = res[0].player2.charAt(0).toUpperCase()
                } else if (p1.textContent === '') {
                    p1.textContent = res[0].player1.charAt(0).toUpperCase()
                }
                mapBorderColor(res[0].data)
                mapBox(res[0].player1, 'player1')
                mapBox(res[0].player2, 'player2')
                switchUser(res[0])
                checkWinner(res[0])
            })
    }, 500);
}

function switchUser(data) {
    let count = 0
    document.querySelectorAll('span').forEach(s => {
        if (s.style.borderTop || s.style.borderLeft === '2px solid white') count++
    })
    // debugger
    board.style.pointerEvents = 'none'
    if (count === 0 && localStorage.getItem('player') === 'player1') {
        p1.classList.add('selected')
        board.style.pointerEvents = 'auto'
    } else if (count > window.prevSpanCount &&
        (localStorage.getItem('player1score').length === window.prevP1Score ||
            localStorage.getItem('player2score').length === window.prevP2Score)) {
        window.prevSpanCount = count
        window.prevP1Score = localStorage.getItem('player1score').length
        window.prevP2Score = localStorage.getItem('player2score').length
        p1.classList.toggle('selected')
        p2.classList.toggle('selected')
        if (p1.classList.contains('selected')) {
            if (localStorage.getItem('player') === 'player1') {
                board.style.pointerEvents = 'auto'
            } else board.style.pointerEvents = 'none'
        } else if (p2.classList.contains('selected')) {
            if (localStorage.getItem('player') === 'player1') {
                board.style.pointerEvents = 'none'
            } else board.style.pointerEvents = 'auto'
        }
    }
}

function checkWinner(data) {
    let count = 0
    document.querySelectorAll('span').forEach(s => {
        if (s.style.borderTop || s.style.borderLeft === '2px solid white') count++
    })
    if (count === parseInt(data.level) * 5) {
        const p1Score = document.querySelector('[data-player1]')
        const p2Score = document.querySelector('[data-player2]')
        if (p1Score > p2Score) {
            window.alert(data.player1.name + 'wins!!!')
        } else window.alert(data.player2.name + 'wins!!!')
    }
}

function mapBorderColor(data) {
    localStorage.setItem('data', data)
    const dataArr = data.split('+')
    dataArr.shift()
    dataArr.forEach(d => {
        const delimiter = '-'
        const start = 3
        const token1 = d.split(delimiter).slice(start)
        const position = token1.join(delimiter)

        const tokens2 = d.split(delimiter).slice(0, start)
        const span = tokens2.join(delimiter)

        const spanEle = document.querySelector(`[data-span="${span}"]`)
        const border = `border${position}`
        if (spanEle.style[border] !== '2px solid white') {
            spanEle.style[border] = '2px solid white'
        }
    })
}

function mapBox(data, player) {
    // localStorage.setItem(`${player}score`, data.score)
    const dataArr = data.score.split('+')
    dataArr.shift()
    dataArr.forEach(d => {
        const span = document.querySelector(`[data-span="${d}"]`)
        if (player === 'player1') {
            span.innerHTML = `<div class="user-box">${localStorage.getItem('user').charAt(0).toUpperCase()}</div>`
        } else {
            span.innerHTML = `<div class="user-box player2">${localStorage.getItem('user').charAt(0).toUpperCase()}</div>`
        }
    })
}

function checkScore(span) {
    const player = localStorage.getItem('player')
    span.setAttribute(`data-${player}`, localStorage.getItem('user'))
    span.innerHTML = player === 'player1' ?
        `<div class="user-box">${localStorage.getItem('user').charAt(0).toUpperCase()}</div>` :
        `<div class="user-box player2">${localStorage.getItem('user').charAt(0).toUpperCase()}</div>`
    const score = localStorage.getItem(`${player}score`) + '+' + span.getAttribute('data-span')
    localStorage.setItem(`${player}score`, score)

    if (localStorage.getItem('player') === 'player1') {
        fetch(`/jodo/player1score/${c}`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                player1: {
                    score: score
                }
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
    } else {
        fetch(`/jodo/player2score/${c}`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                player1: {
                    score: score
                }
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
    }
}