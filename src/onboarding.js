import { drawNetwork } from './visualizations/network'
import * as data from '../data/onboarding-data.json'
import * as copyData from '../data/onboarding-copy.json'
import { drawDendogram } from './visualizations/dendogram'
import { examples } from './utils'

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
  const g = drawNetwork(examples[0].network, document.getElementById('mainView'), true, undefined, examples[0].title, examples[0].descr)
  g.cameraPosition({ z: 5000 })
  drawDendogram(examples[0].dendogram, 'minimizedVisualization')
}

// Code to setup event listeners on elements
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')
const nextOnboardingStep = document.getElementById('nextOnboardingStep')
const prevOnboardingStep = document.getElementById('prevOnboardingStep')
const skipOnboarding = document.getElementById('skipOnboarding')
const visLink = document.getElementById('visLink')
// const onboardingLink = document.getElementById('onboardingLink')
const aboutLink = document.getElementById('aboutLink')

if (loadingButton) {
  loadingButton.onclick = (e) => {
    welcomeModal.classList.add('hidden')
  }
}

if (nextOnboardingStep) {
  nextOnboardingStep.onclick = (e) => {
    document.getElementById('onboardingVis').innerHTML = ''
    step += 1
    onboarding()
  }
}

if (prevOnboardingStep) {
  prevOnboardingStep.onclick = (e) => {
    if (step >= 1) {
      document.getElementById('onboardingVis').innerHTML = ''
      step -= 1
      onboarding()
    }
  }
}

if (skipOnboarding) {
  skipOnboarding.onclick = (e) => {
    welcomeModal.classList.remove('hidden')
    document.getElementById('onboardingVis').innerHTML = ''
    step = 7
    onboarding()
  }
}

if (visLink) {
  visLink.onclick = (e) => {
    document.getElementById('about').classList.add('hidden')
    welcomeModal.classList.remove('hidden')
    step = 7
    onboarding()
  }
}

// onboardingLink.onclick = (e) => {
//   step = 0
//   document.getElementById('nav').classList.add('hidden')
//   document.getElementById('main').classList.add('hidden')
//   document.getElementById('about').classList.add('hidden')
//   document.getElementById('onboarding').classList.remove('hidden')
//   onboarding()
// }

if (aboutLink) {
  aboutLink.onclick = (e) => {
    const about = document.getElementById('about')
    const onboarding = document.getElementById('onboarding')
    const vis = document.getElementById('main')

    onboarding.classList.add('hidden')
    vis.classList.add('hidden')
    about.classList.remove('hidden')
  }
}
