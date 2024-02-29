import { codeData, drawNetwork } from './visualizations/network'

export const getNodeColor = (node, hoverId) => {
  if (node.id === hoverId) {
    return '#ffffff'
  } else {
    switch (node.type) {
      case ('dir'):
        return '#5ffcab'
      case ('file'):
        return '#32fcee'
      case ('interface'):
      case ('class'):
        return '#d14ee8'
      case ('func'):
        return '#fc8a32'
      case ('loop'):
        return '#B259C1'
      case ('cond'):
        return '#EEE384'
      default:
        return '#8DC2ED'
    }
  }
}

const settingOptions = document.getElementsByClassName('option')
const optionMap = {}
Object.keys(settingOptions).forEach((o, i) => {
  if (optionMap[settingOptions.item(i).value] === undefined) {
    optionMap[settingOptions.item(i).value] = (settingOptions.item(i).checked)
  }
  settingOptions.item(i).onclick = (valToFilter) => {
    const option = valToFilter.target.checked
    optionMap[valToFilter.target.value] = option
    drawNetwork(codeData, document.getElementById('network'), true, optionMap)
  }
})
