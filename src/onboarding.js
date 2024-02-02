import { codeData, drawNetwork } from './visualizations/network'
import * as data from '../data/onboarding-data.json'
import * as copyData from '../data/onboarding-copy.json'
import { drawDendogram } from './visualizations/vertical-dendogram'

const copy = copyData.default
const onboardingData = data.default

let step = 7

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
  document.getElementById('nav').classList.remove('hidden')
  drawNetwork(codeData, document.getElementById('network'), true)
  drawDendogram(codeData, 'dendogram', true)
}

// Code to setup event listeners on elements
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')
const nextOnboardingStep = document.getElementById('nextOnboardingStep')
const prevOnboardingStep = document.getElementById('prevOnboardingStep')
const skipOnboarding = document.getElementById('skipOnboarding')
const visLink = document.getElementById('visLink')
const onboardingLink = document.getElementById('onboardingLink')
const aboutLink = document.getElementById('aboutLink')

loadingButton.onclick = (e) => {
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
  welcomeModal.classList.remove('hidden')
  document.getElementById('onboardingVis').innerHTML = ''
  step = 7
  onboarding()
}

visLink.onclick = (e) => {
  document.getElementById('about').classList.add('hidden')
  welcomeModal.classList.remove('hidden')
  step = 7
  onboarding()
}

onboardingLink.onclick = (e) => {
  step = 0
  document.getElementById('nav').classList.add('hidden')
  document.getElementById('main').classList.add('hidden')
  document.getElementById('about').classList.add('hidden')
  document.getElementById('onboarding').classList.remove('hidden')
  onboarding()
}

aboutLink.onclick = (e) => {
  const about = document.getElementById('about')
  const onboarding = document.getElementById('onboarding')
  const vis = document.getElementById('main')

  onboarding.classList.add('hidden')
  vis.classList.add('hidden')
  about.classList.remove('hidden')
}
