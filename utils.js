const tooltipClose = document.getElementById('tooltip-close')
const tooltip = document.getElementById('code-tooltip')

tooltipClose.onclick = (e) => {
  console.info('Close Code Modal')
  tooltip.classList.add('hidden')
}

const divider = document.getElementById('chevron')
const verticalDivider = document.getElementById('vis-divider')
const dendogram = document.getElementById('dendogram')

divider.onclick = (e) => {
  if (divider.classList.contains('clicked')) {
    divider.classList.remove('clicked')
    verticalDivider.classList.remove('clicked')
    dendogram.classList.remove('clicked')
  } else {
    divider.classList.add('clicked')
    verticalDivider.classList.add('clicked')
    dendogram.classList.add('clicked')
  }
}

const loadingButton = document.getElementById('loadingButton')
const welcomeModal = document.getElementById('loading')

loadingButton.onclick = (e) => {
  console.info('Close Welcome Modal')
  welcomeModal.classList.add('hidden')
}
