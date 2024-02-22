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
/*
node => node.id === hoverNodeId
      ? 0xffffff
      : node.type === 'dir'
        ? 0x5ffcab
        : node.type === 'file' ? 0x32fcee : node.type === 'class' ? 0xd14ee8 : 0xfc8a32)
*/
