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

  var buttonGroup = document.createElement('div');
  buttonGroup.classList.add('button-group');
  taskSheetDiv.appendChild(buttonGroup);

  var completeButton = document.createElement('button');
  completeButton.textContent = 'Complete Task Sheet';
  completeButton.onclick = function() {
    materialForm.style.display = 'none';
    completeButton.style.display = 'none';
    editButton.style.display = 'block';
    deleteButton.style.display = 'block';
    reorderButton.style.display = 'block';
    showSupportingButton.style.display = 'inline-block'; // Show the button when task is complete
  };
  buttonGroup.appendChild(completeButton);

  var editButton = document.createElement('button');
  editButton.textContent = 'Edit Task Sheet';
  editButton.style.display = 'none';
  editButton.onclick = function() {
    materialForm.style.display = 'block';
    completeButton.style.display = 'block';
    editButton.style.display = 'none';
    deleteButton.style.display = 'none';
    reorderButton.style.display = 'none';
    showSupportingButton.style.display = 'none'; // Hide the button when editing
  };
  buttonGroup.appendChild(editButton);

  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Task Sheet';
  deleteButton.style.display = 'none';
  deleteButton.onclick = function() {
    taskSheetContainer.removeChild(taskSheetDiv);
    deleteTaskSheet(taskSheetDiv.dataset.taskId).then(() => {
      reorderTaskSheets(Array.from(taskSheetContainer.children).map((div, index) => ({
        taskId: div.dataset.taskId,
        taskName: div.querySelector('h3').innerText.split('. ')[1],
        materials: JSON.parse(div.dataset.materials)
      }))).then(() => renumberTaskSheets());
    });
  };
  buttonGroup.appendChild(deleteButton);

  var reorderButton = document.createElement('button');
  reorderButton.textContent = 'Reorder Task Sheet';
  reorderButton.style.display = 'none';
  reorderButton.onclick = function() {
    const newPosition = prompt('Enter new position for this task sheet:', '1');
    if (newPosition !== null && newPosition > 0 && newPosition <= taskSheetContainer.children.length) {
      const currentIndex = Array.from(taskSheetContainer.children).indexOf(taskSheetDiv);
      taskSheetContainer.insertBefore(taskSheetDiv, taskSheetContainer.children[newPosition - 1]);
      reorderTaskSheets(Array.from(taskSheetContainer.children).map((div, index) => ({
        taskId: div.dataset.taskId,
        taskName: div.querySelector('h3').innerText.split('. ')[1],
        materials: JSON.parse(div.dataset.materials)
      }))).then(() => renumberTaskSheets());
    }
  };
  buttonGroup.appendChild(reorderButton);

  var showSupportingButton = document.createElement('button');
  showSupportingButton.textContent = 'Show Supporting Materials';
  showSupportingButton.classList.add('show-supporting-button');
  showSupportingButton.style.display = 'none';
  showSupportingButton.onclick = function() {
    const rows = materialsTable.querySelectorAll('.supporting-material');
    const isHidden = Array.from(rows).some(row => row.style.display === 'none');
    rows.forEach(row => {
      row.style.display = isHidden ? 'table-row' : 'none';
    });
    showSupportingButton.textContent = isHidden ? 'Hide Supporting Materials' : 'Show Supporting Materials';
  };
  buttonGroup.appendChild(showSupportingButton);

  var materialForm = document.createElement('form');
  materialForm.classList.add('materialForm');
  materialForm.innerHTML = `
    <div class="form-group" style="display: flex; align-items: center; margin-right: 10px;">
      <label for="materialType" style="margin-right: 8px;">Material Type:</label>
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