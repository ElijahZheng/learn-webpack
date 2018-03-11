import _ from 'lodash'
import './style.styl'
// import printMe from './print.js'

function component() {
    let element = document.createElement('div')

    element.innerHTML = _.join(['hello', 'webpack'], ' ')
    element.classList.add('hello')

    // let btn = document.createElement('button')

    // btn.innerHTML = 'Click me and check the console! '
    // btn.onclick = printMe

    // element.appendChild(btn)

    return element
}

document.body.appendChild(component())

// if (module.hot) {
//     module.hot.accept('./print.js', function () {
//         console.log('Accepting the updated printMe module!');
//         printMe();
//     })
// }