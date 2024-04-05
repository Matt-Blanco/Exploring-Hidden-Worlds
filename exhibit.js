import { examples } from './src/utils'
import { drawNetwork } from './src/visualizations/network'

function render () {
  const distance = 7000
  const title = 'Exploring Hidden Worlds'
  const descr = `
  When you think of code what comes to mind? Potentially endless lines of text, 
  or maybe someone sitting in a dark room for hours at a time. 
  The way in which we program machines has been constantly shifting and changing with the advent of new technology, 
  and perhaps we're at a time for it to change again. 
  <em>Exploring Hidden Worlds</em> aims to re-imagin what code can look like as we grasp with the increasing complexity of software, 
  and our symbiotic relationship to the digital world. Constructing a way to visualize and grasp the scale of software.
  <br><br>
  The project visualized is <em>Leaflet</em>. The leading open-source JavaScript library for mobile-friendly interactive maps. You may never have heard of it though it is used almost everywhere.
  `
  const g = drawNetwork(examples[0].network, document.getElementById('mainView'), false)
  g.zoomToFit()

  let angle = 0
  setInterval(() => {
    g.cameraPosition({
      x: distance * Math.sin(angle / 4),
      z: distance * Math.cos(angle / 4)
    })
    angle += Math.PI / 450
  }, 50)

  const projectTitle = document.getElementById('projectTitle')
  const projectDescr = document.getElementById('projectDescription')

  projectTitle.innerText = title
  projectDescr.innerHTML = descr
}

render()
