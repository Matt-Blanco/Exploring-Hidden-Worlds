import { render } from './renderExhibit'
import { onboarding } from './src/onboarding'
import { resolve } from 'path'

const routes = {
  '/': {
    template: '/main.html',
    title: 'Home',
    description: 'Main Exploring Hidden Worlds visualization'
  },
  '/exhibit': {
    template: '/exhibit.html',
    title: 'Exhibit - Exploring Hidden Worlds',
    description: 'Visualization for exhibition contexts'
  }
}

// create document click that watches the nav links only
document.addEventListener('click', (e) => {
  const { target } = e
  if (!target.matches('nav a')) {
    return
  }
  e.preventDefault()
  route()
})

const route = (event) => {
  event = event || window.event // get window.event if event argument not provided
  event.preventDefault()
  // window.history.pushState(state, unused, target link);
  window.history.pushState({}, '', event.target.href)
  locationHandler()
}

const locationHandler = async () => {
  let location = window.location.pathname
  if (location.length === 0) {
    location = '/'
  }

  resolve('/')
  console.log(location, routes)
  const route = routes[location]
  const html = await fetch(resolve(route.template)).then((response) => response.text())
  document.getElementById('content').innerHTML = html
  document.title = route.title
  // // set the description of the document to the description of the route
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute('content', route.description)
  if (location === '/exhibit') {
    render()
  } else {
    onboarding()
  }
}

// add an event listener to the window that watches for url changes
window.onpopstate = locationHandler
// call the urlLocationHandler function to handle the initial url
window.route = route
// call the urlLocationHandler function to handle the initial url
locationHandler()
