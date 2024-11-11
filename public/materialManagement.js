function addMaterial(materialForm, materialsTable, taskName) {
  var materialType = materialForm.elements['materialType'].value;
  var isSupporting = materialForm.elements['isSupporting'].value === 'Yes';
  var supportedMaterial = materialForm.elements['supportedMaterial'].value;
  var supportLevel = isSupporting ? 1 : 0;
  if (isSupporting) {
    const parentMaterialRow = Array.from(materialsTable.getElementsByTagName('tr')).find(row => row.cells[0].innerText === supportedMaterial);
    supportLevel = (parseInt(parentMaterialRow.dataset.supportLevel) || 0) + 1;
  }

  var material = {
    materialType,
    quantity: 1,
    producedQuantity: 0,
    status: 'Pending',
    isSupporting,
    supportedMaterial,
    supportLevel
  };

  addMaterialToTable(materialsTable, taskName, material);
  updateMaterial(taskName, material).then(() => {
    updateTaskSheetStatus(materialsTable.closest('.taskSheet').dataset.taskId);
    location.reload(); // Force page reload
  });
}

function updateMaterial(taskName, material) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName, material }),
  }).then(() => {
    const taskSheetDiv = document.querySelector(`.taskSheet[data-task-id="${material.taskId}"]`);
    if (taskSheetDiv) {
      const materials = JSON.parse(taskSheetDiv.dataset.materials);
      const index = materials.findIndex(mat => mat.materialType === material.materialType);
      if (index !== -1) {
        materials[index] = material;
        taskSheetDiv.dataset.materials = JSON.stringify(materials);
        updateTaskSheetStatus(taskSheetDiv.dataset.taskId);
        location.reload(); // Force page reload
      }
    }
  });
}

function deleteMaterial(taskName, material) {
  return fetch('http://localhost:3000/task-sheets/material', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName, material }),
  }).then(() => {
    const taskSheetDiv = document.querySelector(`.taskSheet[data-task-id="${material.taskId}"]`);
    if (taskSheetDiv) {
      const materials = JSON.parse(taskSheetDiv.dataset.materials);
      const index = materials.findIndex(mat => mat.materialType === material.materialType);
      if (index !== -1) {
        materials.splice(index, 1);
        taskSheetDiv.dataset.materials = JSON.stringify(materials);
        updateTaskSheetStatus(taskSheetDiv.dataset.taskId);
        location.reload(); // Force page reload
      }
    }
  });
}

function addMaterialToTable(materialsTable, taskName, material) {
  var tbody = materialsTable.querySelector('tbody');
  var row = document.createElement('tr');
  row.dataset.supportLevel = material.supportLevel;
  row.className = material.isSupporting ? 'supporting-material' : 'main-material';

  if (material.isSupporting) {
    row.classList.add(`level-${material.supportLevel}`);
  }

  var cell1 = row.insertCell(0);
  cell1.innerText = (material.isSupporting ? '--'.repeat(material.supportLevel) + ' ' : '') + material.materialType;

  var cell2 = row.insertCell(1);
  cell2.innerHTML = `<input type="number" value="${material.quantity}" min="0" step="1">`;

  var cell3 = row.insertCell(2);
  cell3.innerHTML = `<input type="number" value="${material.producedQuantity}" min="0" step="1">`;

  var statusCell = row.insertCell(3);
  var nameCell = row.cells[0];
  updateStatus(material, statusCell, nameCell);

  // Listen to changes in produced quantity
  row.cells[2].querySelector('input').addEventListener('change', function() {
    material.producedQuantity = parseInt(this.value, 10);
    updateStatus(material, statusCell, nameCell);
    updateMaterial(taskName, material).then(() => location.reload()); // Force page reload
  });

  // Listen to changes in required quantity
  row.cells[1].querySelector('input').addEventListener('change', function() {
    material.quantity = parseInt(this.value, 10);
    updateStatus(material, statusCell, nameCell);
    updateMaterial(taskName, material).then(() => location.reload()); // Force page reload
  });

  var deleteButtonCell = row.insertCell(4);
  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function() {
    row.remove();
    deleteMaterial(taskName, material).then(() => location.reload()); // Force page reload
  };
  deleteButtonCell.appendChild(deleteButton);

  // Insert the new row in the correct position
  if (material.isSupporting && material.supportedMaterial) {
    const parentMaterialRow = Array.from(tbody.getElementsByTagName('tr')).find(row => row.cells[0].innerText.trim() === material.supportedMaterial);
    if (parentMaterialRow) {
      parentMaterialRow.insertAdjacentElement('afterend', row);
    } else {
      tbody.appendChild(row);
    }
  } else {
    tbody.appendChild(row);
  }
}