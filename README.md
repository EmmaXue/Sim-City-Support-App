# Sim City Support App

This repository contains the "Sim City Support App" – a task management application for tracking various tasks and materials required when you play SimCity, an open-ended city-building video game. The web-based app allows users to create, edit, reorder, and delete task sheets, each of which can list required materials with details on quantities and production status, running on `http://localhost:3000`. A seperate page, running on `http://localhost:3000/materials-summary` summarises materials you currently in need, categorised by factories/shops/stores/etc. . 

## Features

- **Create Task Sheets:** Add new tasks and define materials required.
- **Edit Materials:** Update quantities and production status of materials.
- **Reorder Task Sheets:** Organize tasks in preferred order.
- **Supporting Materials Management:** Mark materials as "supporting" for other materials and toggle their visibility.
- **Summary View:** Summarize material requirements across all task sheets.

## Folder Structure

```
.
├── public
│   ├── api.js                  # API calls to the backend for task and material management
│   ├── index.html              # HTML file for the main interface
│   ├── main.js                 # Main JavaScript for initializing the app
│   ├── material.js             # Script for handling material logic
│   ├── materialManagement.js   # Script for managing material CRUD operations
│   ├── materialTable.js        # Script for rendering material tables
│   ├── styles.css              # CSS for styling the app interface
│   ├── taskSheet.js            # Script for creating and managing task sheets
│   ├── taskSheetButtons.js     # Button actions for each task sheet
│   ├── taskSheetHelpers.js     # Helper functions for task sheets
│   ├── taskSheetStatus.js      # Logic for task sheet status updates
├── server.js                   # Express server setup for API routes
├── tasksheets.json             # JSON file for storing task sheets data
└── package.json                # Node.js dependencies
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sim-city-support-app.git
   cd sim-city-support-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the server:**

   ```bash
   node server.js
   ```

   The server will start at `http://localhost:3000`.

## Usage

1. **Open the App:**
   - Navigate to `http://localhost:3000` in your web browser to access the application interface.

2. **Creating Task Sheets:**
   - Use the form at the top to create a new task by entering a task name. Click "Create Task Sheet" to add it to the list.

3. **Adding and Managing Materials:**
   - For each task sheet, add materials by specifying type and quantity. You can edit or delete materials as needed.

4. **Reordering Task Sheets:**
   - Use the "Reorder Task Sheet" option to change the position of a task sheet in the list.

5. **Show/Hide Supporting Materials:**
   - Toggle visibility of supporting materials for each task sheet using the "Show Supporting Materials" button.

6. **Material Summary:**
   - To view a summary of all materials needed across tasks, access the `/materials-summary` endpoint on the server.

## API Endpoints

- `GET /task-sheets`: Retrieve all task sheets.
- `POST /task-sheets`: Add a new task sheet with a list of materials.
- `PUT /task-sheets`: Update materials within a task sheet.
- `PUT /task-sheets/reorder`: Reorder task sheets.
- `DELETE /task-sheets`: Delete a task sheet.
- `GET /materials-summary`: Get a summary of material requirements by factory.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Data Storage:** JSON file (`tasksheets.json`)

## Versions
- V1 (2024-Nov-11)
