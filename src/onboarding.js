import { drawDendogram } from './dendogram'
import { codeData, drawNetwork } from './network'

const onboardingData = [
  {
    nodes: [],
    links: []
  },
  {
    nodes: [
      {
        path: "C:\\Users\\Matt's PC\\Documents\\Code\\Leaflet\\src\\control\\Control.js",
        type: 'func',
        name: '\tgetContainer() {\r',
        id: 0,
        collapsed: false,
        links: [],
        children: [],
        contents: '\t// Returns the HTMLElement that contains the control.\r\tgetContainer() {\r\t\treturn this._container;\r\t},\r',
        references: []
      }
    ],
    links: [
      { sourse: 0, target: 0 }
    ]
  },
  {
    nodes: [
      {
        path: "C:\\Users\\Matt's PC\\Documents\\Code\\Leaflet\\src\\control\\Control.js",
        type: 'func',
        name: '\tgetContainer() {\r',
        id: 0,
        collapsed: false,
        links: [],
        children: [],
        contents: '\t// Returns the HTMLElement that contains the control.\r\tgetContainer() {\r\t\treturn this._container;\r\t},\r',
        references: []
      },
      {
        path: "C:\\Users\\Matt's PC\\Documents\\Code\\Leaflet\\src\\control\\Control.js",
        type: 'class',
        name: '\tClass Animal {\r',
        id: 1,
        collapsed: false,
        links: [],
        children: [],
        contents: '\t// Returns the HTMLElement that contains the control.\r\tgetContainer() {\r\t\treturn this._container;\r\t},\r',
        references: []
      }
    ],
    links: [{
      target: 0,
      source: 1,
      ref: false
    }]
  }]

const copy = [
  {
    main: `Creating software is an intricate and complex dance where usually there is no single correct answer. 
    While as our technology has become better the code behind it is becoming increasingly difficult to understand. 
    In order to combat this new forms of representation are needed.`,
    alt: 'The next few steps explain the basics of the visualization, and how modern software is built.'
  },
  {
    main: 'At it\'s heart code is made up of statements. Using terms such as "for", "while", "if", etc. ',
    alt: 'You can use the mousewheel to zoom into the nodes, hover over each node to get their name, or click on each node to see it\'s code.'
  },
  {
    main: 'Usually statements are a part of classes. Classes organize code into pieces that are related to one another',
    alt: ''
  },
  {
    main: 'test 4',
    alt: ''
  }
]

let step = 0

export function onboarding () {
  if (step === 3) {
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
  drawNetwork(codeData, document.getElementById('network'), true)
  drawDendogram()
}

// Code to setup event listeners on elements
const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')
const nextOnboardingStep = document.getElementById('nextOnboardingStep')

loadingButton.onclick = (e) => {
  console.info('Close Welcome Modal')
  welcomeModal.classList.add('hidden')
}

nextOnboardingStep.onclick = (e) => {
  document.getElementById('onboardingVis').innerHTML = ''
  step += 1
  console.log('next step', step)
  onboarding()
}
