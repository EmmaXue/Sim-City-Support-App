function addMaterial(form, table, taskName) {
  var materialType = form.elements['materialType'].value;
  var quantity = 1; // Set initial required quantity to 1
  var producedQuantity = 0; // Set initial produced quantity to 0
  var status = 'Pending';
  var isSupporting = form.elements['isSupporting'].value === 'Yes';
  var supportedMaterial = form.elements['supportedMaterial'].value;
  var supportLevel = getSupportLevel(supportedMaterial);

  var material = { materialType, quantity, producedQuantity, status, isSupporting, supportedMaterial, supportLevel };

  addMaterialToTable(table, taskName, material);

  addTaskSheet({ taskName, materials: [material] }).then(() => {
    const taskSheetContainer = document.getElementById('taskSheetsContainer');
    taskSheetContainer.lastChild.dataset.materials = JSON.stringify([material]);
    updateTaskSheetStatus(taskName);
  });
}

function getSupportLevel(supportedMaterial) {
  if (!supportedMaterial) return 0;
  const hyphens = supportedMaterial.match(/-/g);
  return hyphens ? hyphens.length / 2 + 1 : 1;
}

function addMaterialToTable(table, taskName, material) {
  var tbody = table.getElementsByTagName('tbody')[0];
  var newRow = document.createElement('tr');
  if (material.isSupporting && material.supportedMaterial) {
    newRow.classList.add('supporting-material', `level-${material.supportLevel}`);
  } else {
    newRow.classList.add('main-material');
  }

  if (material.isSupporting && material.supportedMaterial) {
    var rows = Array.from(tbody.getElementsByTagName('tr'));
    var parentRow = rows.find(row => row.cells[0].innerText.trim() === material.supportedMaterial);
    if (parentRow) {
      parentRow.insertAdjacentElement('afterend', newRow);
    } else {
      tbody.appendChild(newRow);
    }
  } else {
    tbody.appendChild(newRow);
  }

  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);
  var cell4 = newRow.insertCell(3);
  var cell5 = newRow.insertCell(4);

  cell1.innerHTML = (material.isSupporting ? '-'.repeat(material.supportLevel * 2) + ' ' : '') + material.materialType;

  var quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.value = material.quantity;
  quantityInput.min = '1';
  quantityInput.addEventListener('change', function() {
    material.quantity = quantityInput.value;
    updateStatus(material, cell4, cell1);
    updateMaterial(taskName, material).then(() => updateTaskSheetStatus(taskName));
  });
  cell2.appendChild(quantityInput);

  var producedQuantityInput = document.createElement('input');
  producedQuantityInput.type = 'number';
  producedQuantityInput.value = material.producedQuantity;
  producedQuantityInput.min = '0';
  producedQuantityInput.addEventListener('change', function() {
    material.producedQuantity = producedQuantityInput.value;
    updateStatus(material, cell4, cell1);
    updateMaterial(taskName, material).then(() => updateTaskSheetStatus(taskName));
  });
  cell3.appendChild(producedQuantityInput);

  updateStatus(material, cell4, cell1);

  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function() {
    table.deleteRow(newRow.rowIndex);
    deleteMaterial(taskName, material).then(() => updateTaskSheetStatus(taskName));
  };
  cell5.appendChild(deleteButton);
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

function updateMaterial(taskName, material) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName, material }),
  }).then(() => {
    const taskSheetContainer = document.getElementById('taskSheetsContainer');
    const taskSheetDiv = Array.from(taskSheetContainer.children).find(div => {
      return div.querySelector('h3').innerText.split('. ')[1] === taskName;
    });
    if (taskSheetDiv) {
      const materials = JSON.parse(taskSheetDiv.dataset.materials);
      const existingMaterialIndex = materials.findIndex(m => m.materialType === material.materialType);
      if (existingMaterialIndex !== -1) {
        materials[existingMaterialIndex] = material;
      } else {
        materials.push(material);
      }
      taskSheetDiv.dataset.materials = JSON.stringify(materials);
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
    const taskSheetContainer = document.getElementById('taskSheetsContainer');
    const taskSheetDiv = Array.from(taskSheetContainer.children).find(div => {
      return div.querySelector('h3').innerText.split('. ')[1] === taskName;
    });
    if (taskSheetDiv) {
      let materials = JSON.parse(taskSheetDiv.dataset.materials);
      materials = materials.filter(m => m.materialType !== material.materialType);
      taskSheetDiv.dataset.materials = JSON.stringify(materials);
    }
  });
}

function updateTaskSheetStatus(taskName) {
  const taskSheetContainer = document.getElementById('taskSheetsContainer');
  const taskSheetDiv = Array.from(taskSheetContainer.children).find(div => {
    return div.querySelector('h3').innerText.split('. ')[1] === taskName;
  });
  if (taskSheetDiv) {
    const materials = JSON.parse(taskSheetDiv.dataset.materials);
    const allComplete = materials.every(material => material.status === 'Complete');
    if (allComplete) {
      taskSheetDiv.classList.add('complete', 'ready-to-go');
      taskSheetDiv.querySelector('h3').innerText = `${taskSheetDiv.querySelector('h3').innerText} - Ready to go!`;
      taskSheetDiv.querySelectorAll('.supporting-material').forEach(row => {
        row.style.display = 'none';
      });
      taskSheetDiv.querySelector('.show-supporting-button').style.display = 'inline-block';
    } else {
      taskSheetDiv.classList.remove('complete', 'ready-to-go');
      taskSheetDiv.querySelector('h3').innerText = taskSheetDiv.querySelector('h3').innerText.replace(' - Ready to go!', '');
      taskSheetDiv.querySelectorAll('.supporting-material').forEach(row => {
        row.style.display = 'table-row';
      });
      taskSheetDiv.querySelector('.show-supporting-button').style.display = 'none';
    }
  }
}