export const applyOrderFromLocalStorage = (selectedProject) => (grouped) => {
  const groupedCopy = JSON.parse(JSON.stringify(grouped));

  if (selectedProject) {
    const preOrder = getOrderFromLocalStorage(selectedProject.id);

    if (preOrder) {
      for (const groupItem of groupedCopy) {
        for (const preOrderItem of preOrder) {
          if (groupItem.groupName === preOrderItem.groupName) {
            groupItem.order = preOrderItem.order;
          }
        }
      }
    }
  }

  return groupedCopy;
};

export const setOrderToLocalStorage = (projectId, nextOrder) => {
  const map = getOrderMapFromLocalStorage();

  if (map) {
    localStorage.setItem(
      'project-table-order',
      JSON.stringify({ ...map, [projectId]: nextOrder }),
    );
  } else {
    localStorage.setItem(
      'project-table-order',
      JSON.stringify({ [projectId]: nextOrder }),
    );
  }
};

export const getOrderMapFromLocalStorage = () => {
  const order = localStorage.getItem('project-table-order');

  return order ? JSON.parse(order) : null;
};

export const getOrderFromLocalStorage = (projectId) => {
  const map = getOrderMapFromLocalStorage();

  if (map) {
    return map[projectId] || null;
  }

  return null;
};
