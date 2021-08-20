const dragAPI = {
  showElem (elem) {
    elem.style.visibility = 'visible';
  },

  hideElem (elem) {
    elem.style.visibility = 'hidden';
  },

  findElemIdx (id, nodeList) {
    let dragIdx = 0;
    for (let node of nodeList) {
      if (node.id === id) break;
      dragIdx++;
    }
    return dragIdx;
  },

  createGhostElem (elem) {
    elem.style.backgroundColor = '#6877F6';
    elem.style.opacity = '40%';
  },

  preventEvent (e) {
    e.preventDefault();
    e.stopPropagation();
  },
};

export default dragAPI;