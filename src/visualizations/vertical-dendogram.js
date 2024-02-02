import * as d3 from 'd3'
import * as heirarchyData from '../../data/data.json'
import { updateNetwork } from './network'

let dendogram
let show = false

let hoverNodeId = -1

export function drawDendogram (data, id, showDendogram) {
  show = showDendogram
  const width = window.innerWidth * 0.25
  const height = window.innerHeight * 0.99

  dendogram = d3.select(`#${id}`)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + width + ',' + width + ')')
    // .append('g')
    // .attr('transform', 'translate(40,0)')
    .attr('opacity', '70%')

  const cluster = d3
    .cluster()
    .size([360, width])

  const root = d3.hierarchy(heirarchyData.default[0], d => d.children)

  cluster(root)

  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', '#000')
    .text('a simple tooltip')

  // const linksGenerator = d3.linkRadial()
  //   .angle(d => { console.log(d); return d.x / 180 * Math.PI })
  //   .radius(d => { return d.y })

  console.log(root.descendants().slice(1), root.links())

  // Add the links between nodes:
  dendogram.selectAll('path')
    // .data(root.descendants().slice(1))
    .data(root.links())
    .enter()
    .append('path')
    .attr('d', d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y))
    .style('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('class', 'd3Link')

  // Add a circle for each node.
  dendogram.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', d => `
    rotate(${d.x * 180 / Math.PI - 90}) 
    translate(${d.y},0)
  `)
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
        .style('fill', (node) => {
          const color = node.data.id === hoverNodeId
            ? '#ffffff'
            : node.data.type === 'dir'
              ? '#5ffcab'
              : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
          return color
        })
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

  // Code to minimize and expand the dendogram visualization
  if (show) {
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
  }
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
    .attr('r', (node) => node.data.id === hoverNodeId ? 10 : 3)
}
