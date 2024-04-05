import * as d3 from 'd3'
import { updateNetwork } from './network'
import { getNodeColor } from '../utils'

let dendogram
let hoverNodeId = -1

export function drawDendogram (data, id, options) {
  const dataCopy = { ...data }
  const renderedElement = document.getElementById(id)
  const width = renderedElement.offsetWidth
  const height = renderedElement.offsetHeight

  d3.select(`#${id}`).selectChild('svg').remove()
  dendogram = d3.select(`#${id}`)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .attr('opacity', '70%')

  const cluster = d3
    .cluster()
    .size([360, (height / 2 - 5)])

  const filteredNodes = filterTree(dataCopy, options)[0]
  const root = d3.hierarchy(filteredNodes, d => d.children)

  cluster(root)

  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', '#000')
    .text('a simple tooltip')

  const linksGenerator = d3.linkRadial()
    .angle(d => { return d.x / 180 * Math.PI })
    .radius(d => { return d.y })

  console.log(root.links())

  // Add the links between nodes:
  dendogram.selectAll('path')
    .data(root.links())
    .enter()
    .append('path')
    .attr('d', linksGenerator)
    .style('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('class', 'd3Link')

  // Add a circle for each node.
  dendogram.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', d => {
      return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')'
    })
    .append('circle')
    .attr('class', 'd3Data')
    .attr('r', 3)
    .style('fill', (node) => getNodeColor(node.data, hoverNodeId))
    .on('mouseover', (d) => {
      hoverNodeId = d.target.__data__.data.id

      d3.select(d.target)
        .style('fill', '#ffffff')
        .attr('r', 8)
      tooltip.text(d.target.__data__.data.name)

      updateNetwork(hoverNodeId)

      return tooltip.style('visibility', 'visible')
    })
    .on('mousemove', (e) => {
      const tooltipWidth = tooltip._groups[0][0].clientWidth
      return tooltip.style('top', (e.pageY - 10) + 'px').style('left', (e.pageX - (tooltipWidth + 15)) + 'px')
    })
    .on('mouseout', (e) => {
      hoverNodeId = -1
      d3.select(e.target)
        .style('fill', (node) => getNodeColor(node.data, hoverNodeId))
        .attr('r', 3)

      updateNetwork(hoverNodeId)

      return tooltip.style('visibility', 'hidden')
    })
    .on('click', (d) => {
      if (d.target.__data__.data !== 'dir') {
        const tooltip = document.getElementById('code-tooltip')
        tooltip.classList.remove('hidden')
        const tooltipContents = document.getElementById('code-tooltip-contents')
        tooltipContents.innerText = d.target.__data__.data.contents
      }
    })
}

export function updateDendogram (hoverId) {
  hoverNodeId = hoverId

  dendogram.selectAll('.d3Data').style('fill', (node) => getNodeColor(node.data, hoverNodeId))
    .attr('r', (node) => node.data.id === hoverNodeId ? 10 : 3)
}

const filterTree = (nodes, options) => {
  if (options === undefined) {
    return [nodes]
  } else {
    function filterNode (node) {
      const hasDesiredType = options[node.type]

      if (hasDesiredType) {
        node.children = node.children.filter(filterNode)
        return true
      }

      return false
    }
    const filteredNodes = [nodes].slice()

    filteredNodes.forEach((node, index) => {
      const keepNode = filterNode(node)
      if (!keepNode) {
        node.children.forEach(child => (child.parent = nodes[index].parent))
      }
    })

    return filteredNodes.filter(node => node)
  }
}
