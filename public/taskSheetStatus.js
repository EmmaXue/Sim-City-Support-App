function updateTaskSheetStatus(taskId) {
    const taskSheetContainer = document.getElementById('taskSheetsContainer');
    const taskSheetDiv = Array.from(taskSheetContainer.children).find(div => {
      return div.dataset.taskId === taskId;
    });
    if (taskSheetDiv) {
      const materials = JSON.parse(taskSheetDiv.dataset.materials);
      const allComplete = materials.every(material => material.status === 'Complete');
      const isReadyToGo = materials.length > 0 && allComplete;
  
      const taskSheetTitle = taskSheetDiv.querySelector('h3');
      taskSheetTitle.innerText = taskSheetTitle.innerText.split(' - ')[0]; // Reset title to base name
  
      if (isReadyToGo) {
        taskSheetDiv.classList.add('complete', 'ready-to-go');
        taskSheetTitle.innerText += ' - Ready to go!';
        taskSheetDiv.querySelectorAll('.supporting-material').forEach(row => {
          row.style.display = 'none';
        });
        taskSheetDiv.querySelector('.show-supporting-button').style.display = 'inline-block';
      } else {
        taskSheetDiv.classList.remove('complete', 'ready-to-go');
        taskSheetDiv.querySelectorAll('.supporting-material').forEach(row => {
          row.style.display = 'table-row';
        });
        taskSheetDiv.querySelector('.show-supporting-button').style.display = 'none';
      }
    }
  }
  
  function updateStatus(material, statusCell, nameCell) {
    if (material.quantity < material.producedQuantity) {
      material.status = 'Error';
    } else if (material.quantity > material.producedQuantity) {
      material.status = 'In Produce';
    } else if (material.quantity == material.producedQuantity) {
      material.status = 'Complete';
    } else {
      material.status = 'Pending';
    }
    statusCell.innerText = material.status;
  
    if (material.status === 'Complete') {
      nameCell.style.textDecoration = 'line-through';
    } else {
      nameCell.style.textDecoration = 'none';
    }
  }