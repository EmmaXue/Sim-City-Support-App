function fetchTaskSheets() {
  return fetch('http://localhost:3000/task-sheets')
    .then(response => response.json());
}

function addTaskSheet(taskSheet) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskSheet),
  });
}

function updateMaterial(taskName, material) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName, material }),
  });
}

function deleteTaskSheet(taskName) {
  return fetch('http://localhost:3000/task-sheets', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskName }),
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