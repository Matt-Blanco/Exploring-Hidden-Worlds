import * as d3 from 'd3'
import * as heirarchyData from '../data/data-original.json'
import { updateNetwork } from './network'

let dendogram

let hoverNodeId = -1

// const highlightNodes = new Set()
// const highlightLinks = new Set()

export function drawDendogram () {
  const width = window.innerWidth * 0.25
  const height = window.innerHeight * 1.3

  dendogram = d3.select('#dendogram')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(40,0)')
    .attr('opacity', '70%')

  const cluster = d3.cluster()
    .size([height * 0.95, width - 100])

  const root = d3.hierarchy(heirarchyData.default[0], d => d.children)

  cluster(root)

  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', '#000')
    .text('a simple tooltip')

  // Add the links between nodes:
  dendogram.selectAll('path')
    .data(root.descendants().slice(1))
    .enter()
    .append('path')
    .attr('d', function (d) {
      return 'M' + d.y + ',' + d.x +
                'C' + (d.parent.y + 50) + ',' + d.x +
                ' ' + (d.parent.y + 150) + ',' + d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
                ' ' + d.parent.y + ',' + d.parent.x
    })
    .style('fill', 'none')
    .attr('stroke', '#ccc')

  // Add a circle for each node.
  dendogram.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })
    .append('circle')
    .attr('class', 'd3Data')
    .attr('r', 3)
    .style('fill', (node) => {
      const color = node.data.id === hoverNodeId
        ? '#ffffff'
        : node.data.type === 'dir'
          ? '#5ffcab'
          : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
      return color
    })
    .on('mouseover', (d) => {
      d3.select(d.target)
        .style('fill', '#ffffff')
      tooltip.text(d.target.__data__.data.name)
      hoverNodeId = d.target.__data__.data.id

      updateNetwork(hoverNodeId)

      return tooltip.style('visibility', 'visible')
    })
    .on('mousemove', (e) => {
      const tooltipWidth = tooltip._groups[0][0].clientWidth
      return tooltip.style('top', (e.pageY - 10) + 'px').style('left', (e.pageX - (tooltipWidth - 30)) + 'px')
    })
    .on('mouseout', (e) => {
      hoverNodeId = -1
      d3.select(e.target)
        .style('fill', (node) => {
          const color = node.data.id === hoverNodeId
            ? '#ffffff'
            : node.data.type === 'dir'
              ? '#5ffcab'
              : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
          return color
        })

      updateNetwork(hoverNodeId)

      return tooltip.style('visibility', 'hidden')
    })
    .on('click', (d) => {
      const tooltip = document.getElementById('code-tooltip')
      tooltip.classList.remove('hidden')
      const tooltipContents = document.getElementById('code-tooltip-contents')
      tooltipContents.innerText = d.target.__data__.contents
    })
}

export function updateDendogram (hoverId) {
  hoverNodeId = hoverId

  dendogram.selectAll('.d3Data').style('fill', (node) => {
    const color = node.data.id === hoverNodeId
      ? '#ffffff'
      : node.data.type === 'dir'
        ? '#5ffcab'
        : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
    return color
  })
}

// Code to minimize and expand the dendogram visualization
const divider = document.getElementById('chevron')
const verticalDivider = document.getElementById('vis-divider')
const dendogramDOM = document.getElementById('dendogram')

divider.onclick = (e) => {
  if (divider.classList.contains('clicked')) {
    divider.classList.remove('clicked')
    verticalDivider.classList.remove('clicked')
    dendogramDOM.classList.remove('clicked')
  } else {
    divider.classList.add('clicked')
    verticalDivider.classList.add('clicked')
    dendogramDOM.classList.add('clicked')
  }
}
