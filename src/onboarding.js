import { drawDendogram } from './dendogram'
import { drawNetwork } from './network'

export function onboarding () {
  closeOnboarding()
}

function closeOnboarding () {
  drawNetwork()
  drawDendogram()
}

// Code to close the initial welcome modal
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')

loadingButton.onclick = (e) => {
  console.info('Close Welcome Modal')
  welcomeModal.classList.add('hidden')
}
