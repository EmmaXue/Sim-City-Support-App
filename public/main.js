document.addEventListener('DOMContentLoaded', function() {
  fetchTaskSheets().then(data => {
    data.forEach((taskSheet, index) => {
      createTaskSheet(taskSheet.taskName, taskSheet.materials, true);
    });
    renumberTaskSheets();
  });
});

document.getElementById('taskSheetForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var taskName = document.getElementById('taskName').value;
  createTaskSheet(taskName);
  document.getElementById('taskSheetForm').reset();
  
  addTaskSheet({ taskName: taskName, materials: [] }).then(() => {
    renumberTaskSheets();
  });
});