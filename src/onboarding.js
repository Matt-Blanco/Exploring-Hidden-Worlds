import { codeData, drawNetwork } from './network'

const onboardingData = [
  {
    nodes: [
      {
        path: '',
        type: 'dir',
        name: 'src',
        id: 1,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'dir',
        name: 'roles',
        id: 2,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'file',
        name: 'Professor.js',
        id: 3,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'file',
        name: 'Professor.js',
        id: 4,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'class',
        name: 'Class Professor {',
        id: 5,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'func',
        name: 'function getCourseList() {',
        id: 6,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'file',
        name: 'Student.js',
        id: 7,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'class',
        name: 'new Class Student {',
        id: 8,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      },
      {
        path: '',
        type: 'func',
        name: 'function getSchedule() {',
        id: 9,
        collapsed: false,
        links: [],
        children: [],
        contents: '',
        references: []
      }
    ],
    links: [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
      { source: 2, target: 7 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
      { source: 5, target: 6 },
      { source: 7, target: 8 },
      { source: 8, target: 9 },
      { source: 3, target: 6, ref: true },
      { source: 7, target: 9, ref: true }
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
    main: `Creating software is an intricate and complex ecosystem built from dozens of interconnected parts. 
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
    main: 'There can be multiple classes and independent statements in a single file, or spread across multiple files.',
    alt: 'When code is spread out like this it\'s common for classes to refer to code from other files.'
  }
]

let step = 8

export function onboarding () {
  if (step === 8) {
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

helpIcon.onclick = (e) => {
  welcomeModal.classList.remove('hidden')
}

onboardingIcon.onclick = (e) => {
  step = 0
  document.getElementById('main').classList.add('hidden')
  document.getElementById('onboarding').classList.remove('hidden')
  onboarding()
}
