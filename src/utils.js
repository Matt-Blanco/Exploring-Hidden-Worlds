import { drawDendogram } from './visualizations/dendogram'
import { drawNetwork } from './visualizations/network'
import * as baseLeafletData from '../data/data-leaflet.json'

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
    drawNetwork(examples[0].network, document.getElementById('mainView'), true, optionMap)
    drawDendogram(examples[0].dendogram, 'minimuzedView', optionMap)
  }
})

export const filterData = (data, nd, options) => {
  if (options === undefined) {
    return data
  } else {
    nd.nodes = data.nodes.filter((node) => options[node.type])
    const nodeIds = new Set(nd.nodes.map((node) => node.id))
    nd.links = data.links.filter((link) => {
      const hasNodes = nodeIds.has(link.source.id) && nodeIds.has(link.target.id)
      const showRef = options.ref
      const showHeirarchy = options.heir

      if ((showHeirarchy && !link.ref) || (showRef && link.ref)) {
        return hasNodes
      }

      return false
    })
    return nd
  }
}

export const flatTree = (level = 0) => ({ children = [], ...object }) => [
  { ...object, level }, ...children.flatMap(flatTree(level + 1))
]

export const examples = [{
  title: baseLeafletData.title,
  descr: baseLeafletData.descr,
  network: baseLeafletData.d.flatMap(flatTree()),
  dendogram: baseLeafletData.default.d[0]
}]
