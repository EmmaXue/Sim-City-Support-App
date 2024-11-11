// taskSheetButtons.js
function setupCompleteButton(completeButton, materialForm, editButton, deleteButton, reorderButton, showSupportingButton) {
    completeButton.textContent = 'Complete Task Sheet';
    completeButton.onclick = function() {
        materialForm.style.display = 'none';
        completeButton.style.display = 'none';
        editButton.style.display = 'block';
        deleteButton.style.display = 'block';
        reorderButton.style.display = 'block';
        showSupportingButton.style.display = 'inline-block'; // Show the button when task is complete
    };
}

function setupEditButton(editButton, materialForm, completeButton, deleteButton, reorderButton, showSupportingButton) {
    editButton.textContent = 'Edit Task Sheet';
    editButton.style.display = 'none';
    editButton.onclick = function() {
    if (materialForm && completeButton && deleteButton && reorderButton && showSupportingButton) {
        materialForm.style.display = 'block';
        completeButton.style.display = 'block';
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
        reorderButton.style.display = 'none';
        showSupportingButton.style.display = 'none'; // Hide the button when editing
    }
};
}

function setupDeleteButton(deleteButton, taskSheetDiv, taskSheetContainer) {
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
}

function setupReorderButton(reorderButton, taskSheetDiv, taskSheetContainer) {
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
}

function setupShowSupportingButton(showSupportingButton, materialsTable) {
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
}