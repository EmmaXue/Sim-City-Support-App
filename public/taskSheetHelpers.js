function renumberTaskSheets() {
  const taskSheetContainer = document.getElementById('taskSheetsContainer');
  Array.from(taskSheetContainer.children).forEach((div, index) => {
    const taskSheetTitle = div.querySelector('h3');
    taskSheetTitle.innerText = `${index + 1}. ${taskSheetTitle.innerText.split('. ')[1]}`;
  });
}

function reorderTaskSheets(taskSheets) {
  return fetch('http://localhost:3000/task-sheets/reorder', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskSheets }),
  });
}

function deleteTaskSheet(taskId) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId }),
  });
}