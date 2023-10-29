import { drawDendogram } from './src/dendogram'
import { drawNetwork } from './src/network'
import './public/style.css'

drawNetwork()
drawDendogram()

// Code to close the initial welcome modal
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')

loadingButton.onclick = (e) => {
  console.info('Close Welcome Modal')
  welcomeModal.classList.add('hidden')
}
