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
    quantityInput.classList.add('quantity-input'); // Add this line to apply CSS class
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
    producedQuantityInput.classList.add('quantity-input'); // Add this line to apply CSS class
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