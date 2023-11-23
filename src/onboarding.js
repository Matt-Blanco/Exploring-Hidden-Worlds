import { codeData, drawNetwork } from './visualizations/network'
import * as data from '../data/onboarding-data.json'
import * as copyData from '../data/onboarding-copy.json'

const copy = copyData.default
const onboardingData = data.default

let step = 0

export function onboarding () {
  if (step >= 6) {
    document.getElementById('main').classList.remove('hidden')
    closeOnboarding()
  } else {
    incrementOnboarding()
  }
}

function incrementOnboarding () {
  document.getElementById('onboardingText').innerHTML = copy[step].main
  document.getElementById('onboardingAlt').innerHTML = copy[step].alt

  drawNetwork(onboardingData[step], document.getElementById('onboardingVis'))
}

function closeOnboarding () {
  document.getElementById('onboarding').classList.add('hidden')
  drawNetwork(codeData, document.getElementById('network'), false)
}

// Code to setup event listeners on elements
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')
const nextOnboardingStep = document.getElementById('nextOnboardingStep')
const prevOnboardingStep = document.getElementById('prevOnboardingStep')
const skipOnboarding = document.getElementById('skipOnboarding')
const helpIcon = document.getElementById('helpIcon')
const onboardingIcon = document.getElementById('onboardingIcon')

loadingButton.onclick = (e) => {
  console.info('Close Welcome Modal')
  welcomeModal.classList.add('hidden')
}

nextOnboardingStep.onclick = (e) => {
  document.getElementById('onboardingVis').innerHTML = ''
  step += 1
  onboarding()
}

prevOnboardingStep.onclick = (e) => {
  if (step >= 1) {
    document.getElementById('onboardingVis').innerHTML = ''
    step -= 1
    onboarding()
  }
}

skipOnboarding.onclick = (e) => {
  document.getElementById('onboardingVis').innerHTML = ''
  step = 7
  onboarding()
}

helpIcon.onclick = (e) => {
  welcomeModal.classList.remove('hidden')
}

onboardingIcon.onclick = (e) => {
  step = 0
  document.getElementById('main').classList.add('hidden')
  document.getElementById('onboarding').classList.remove('hidden')
  onboarding()
}
