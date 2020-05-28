import { swipedetect } from './js/swipe-detect.js'


const board = document.querySelector('.board')
const radios = document.querySelectorAll('input[type="radio"]')
window.onload = () => {
    radios[0].click()
}
radios.forEach(r => {
    r.addEventListener('click', (e) => {
        board.innerHTML = ''
        for (let i = 1; i <= parseInt(e.target.value); i++) {
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
                    const prevCount = countSpan()
                    if (swipedir === 'right') {
                        s.style.borderTop = '2px solid white'
                        markAfterJoin(data, swipedir)
                    } else if (swipedir === 'down') {
                        s.style.borderLeft = '2px solid white'
                        markAfterJoin(data, swipedir)
                    } else if (swipedir === 'left') {
                        const data = s.getAttribute('data-span')
                        const selector = `[data-span="r-${data.split('-')[1]}-${parseInt(data.split('-')[2]) - 1}"]`
                        const previous = document.querySelector(selector)
                        previous.style.borderTop = '2px solid white'
                        markAfterJoin(data, swipedir, previous)
                    } else if (swipedir === 'up') {
                        const data = s.getAttribute('data-span')
                        const selector = `[data-span="r-${parseInt(data.split('-')[1]) - 1}-${data.split('-')[2]}"]`
                        const previous = document.querySelector(selector)
                        previous.style.borderLeft = '2px solid white'
                        markAfterJoin(data, swipedir, previous)
                    }
                    const afterCount = countSpan()
                    // if (afterCount > prevCount) board.style.pointerEvents = 'none'
                })

            })
        }
    })
})

function markAfterJoin (data, swipedir, prev = null) {
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
        const selector = `[data-span="r-${parseInt(data.split('-')[1]) + 1}-${data.split('-')[2] }"]`
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

function countSpan () {
    let count = 0
    document.querySelectorAll('span').forEach(s => {
        if (s.style.borderTop || s.style.borderLeft === '2px solid white') count++
    })
    return count
}