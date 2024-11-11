// taskSheet.js
function createTaskSheet(taskName, materials = [], isLoaded = false, taskId = null) {
  var taskSheetContainer = document.getElementById('taskSheetsContainer');

  var taskSheetDiv = document.createElement('div');
  taskSheetDiv.classList.add('taskSheet');
  taskSheetDiv.dataset.materials = JSON.stringify(materials);
  taskSheetDiv.dataset.taskId = taskId || `taskSheet-${Date.now()}`; // Assign unique ID based on timestamp if not provided

  var taskSheetTitle = document.createElement('h3');
  taskSheetTitle.innerText = `${taskSheetContainer.children.length + 1}. ${taskName}`;
  taskSheetDiv.appendChild(taskSheetTitle);

  var materialsTable = document.createElement('table');
  materialsTable.innerHTML = `
    <thead>
      <tr>
        <th>Material Type</th>
        <th>Required Quantity</th>
        <th>Produced Quantity</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  taskSheetDiv.appendChild(materialsTable);

  var materialForm = document.createElement('form');
  materialForm.classList.add('materialForm');
  materialForm.innerHTML = `
    <div class="form-group">
      <label for="materialType">Material Type:</label>
      <input type="text" name="materialType" placeholder="e.g., Wood, Steel, Concrete" required>
    </div>
    
    <div class="form-group">
      <label for="isSupporting">Supporting Material?</label>
      <select name="isSupporting" id="isSupporting" required>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="supportedMaterial">Supported Material:</label>
      <select name="supportedMaterial" id="supportedMaterial" disabled>
        <option value="">Select Material</option>
      </select>
    </div>

    <button type="submit">Add Material</button>
  `;
  taskSheetDiv.appendChild(materialForm);

  var buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');
  taskSheetDiv.appendChild(buttonGroup);

  var completeButton = document.createElement('button');
  var editButton = document.createElement('button');
  var deleteButton = document.createElement('button');
  var reorderButton = document.createElement('button');
  var showSupportingButton = document.createElement('button');

  // Call functions from taskSheetButtons.js
  setupCompleteButton(completeButton, materialForm, editButton, deleteButton, reorderButton, showSupportingButton);
  setupEditButton(editButton, materialForm, completeButton, deleteButton, reorderButton, showSupportingButton);
  setupDeleteButton(deleteButton, taskSheetDiv, taskSheetContainer);
  setupReorderButton(reorderButton, taskSheetDiv, taskSheetContainer);
  setupShowSupportingButton(showSupportingButton, materialsTable);

  buttonGroup.appendChild(completeButton);
  buttonGroup.appendChild(editButton);
  buttonGroup.appendChild(deleteButton);
  buttonGroup.appendChild(reorderButton);
  buttonGroup.appendChild(showSupportingButton);

  taskSheetContainer.appendChild(taskSheetDiv);

  materials.forEach(material => {
    addMaterialToTable(materialsTable, taskName, material);
  });

  materialForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addMaterial(materialForm, materialsTable, taskName);
    materialForm.reset();
    updateTaskSheetStatus(taskSheetDiv.dataset.taskId); // Update status after adding material
  });

  if (isLoaded) {
    materialForm.style.display = 'none';
    completeButton.style.display = 'none';
    editButton.style.display = 'block';
    deleteButton.style.display = 'block';
    reorderButton.style.display = 'block';
    updateTaskSheetStatus(taskSheetDiv.dataset.taskId); // Ensure the status is updated on load
  }

  // Reattach event listener for "Supporting Material?" dropdown
  materialForm.querySelector('#isSupporting').addEventListener('change', function() {
    const supportedMaterialDropdown = materialForm.querySelector('#supportedMaterial');
    if (this.value === 'Yes') {
      supportedMaterialDropdown.removeAttribute('disabled');
      const materials = Array.from(materialsTable.querySelectorAll('tbody tr')).map(row => row.cells[0].innerText);
      supportedMaterialDropdown.innerHTML = '<option value="">Select Material</option>';
      materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.text = material;
        supportedMaterialDropdown.appendChild(option);
      });
    } else {
      supportedMaterialDropdown.setAttribute('disabled', 'disabled');
      supportedMaterialDropdown.innerHTML = '<option value="">Select Material</option>';
    }
  });

  // Update task sheet status to ensure correct appearance on load
  updateTaskSheetStatus(taskSheetDiv.dataset.taskId);
}