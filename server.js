const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let taskSheets = [];

const loadTaskSheets = () => {
  if (fs.existsSync('tasksheets.json')) {
    const data = fs.readFileSync('tasksheets.json');
    taskSheets = JSON.parse(data);
  }
};

const saveTaskSheets = () => {
  fs.writeFileSync('tasksheets.json', JSON.stringify(taskSheets, null, 2));
};

loadTaskSheets();

app.get('/task-sheets', (req, res) => {
  res.json(taskSheets);
});

app.post('/task-sheets', (req, res) => {
  const { taskName, materials } = req.body;
  let taskSheet = taskSheets.find(ts => ts.taskName === taskName);

  if (!taskSheet) {
    taskSheet = { taskName, materials };
    taskSheets.push(taskSheet);
  } else {
    taskSheet.materials.push(...materials);
  }

  saveTaskSheets();
  res.json({ message: 'Task sheet added successfully' });
});

const updateMaterialInTaskSheet = (materials, material) => {
  const existingMaterialIndex = materials.findIndex(m => m.materialType === material.materialType);
  if (existingMaterialIndex !== -1) {
    materials[existingMaterialIndex] = material;
  } else {
    materials.push(material);
  }
};

app.put('/task-sheets', (req, res) => {
  const { taskName, material } = req.body;
  const taskSheet = taskSheets.find(ts => ts.taskName === taskName);

  if (taskSheet) {
    updateMaterialInTaskSheet(taskSheet.materials, material);
    saveTaskSheets();
    res.json({ message: 'Material updated successfully' });
  } else {
    res.status(404).json({ message: 'Task sheet not found' });
  }
});

app.put('/task-sheets/reorder', (req, res) => {
  const { taskSheets: reorderedTaskSheets } = req.body;
  taskSheets = reorderedTaskSheets;
  saveTaskSheets();
  res.json({ message: 'Task sheets reordered successfully' });
});

app.delete('/task-sheets', (req, res) => {
  const { taskName } = req.body;
  taskSheets = taskSheets.filter(ts => ts.taskName !== taskName);
  saveTaskSheets();
  res.json({ message: 'Task sheet deleted successfully' });
});

app.delete('/task-sheets/material', (req, res) => {
  const { taskName, material } = req.body;
  const taskSheet = taskSheets.find(ts => ts.taskName === taskName);

  if (taskSheet) {
    taskSheet.materials = taskSheet.materials.filter(m => m.materialType !== material.materialType);
    saveTaskSheets();
    res.json({ message: 'Material deleted successfully' });
  } else {
    res.status(404).json({ message: 'Task sheet not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



// Summarize material quantities across all task sheets
// http://localhost:3000/materials-summary
app.get('/materials-summary', (req, res) => {
  const basicMaterials = new Set([
    "metal", "wood", "plastic", "seeds", "minerals", "chemicals", "textiles", "sugar", "glass", 
    "feed", "electrical", "G fabric", "coconut", "cc oil", "silk"
  ]);
  const factories = {
    "Building Supplies Store": new Set(["nail", "plank", "brick", "cement", "glue", "paint"]),
    "Hardware Store": new Set(["hammer", "tape", "shovel", "utensil", "ladder", "drill"]),
    "Furniture Store": new Set(["chair", "table", "quilt", "cupboard", "couch"]),
    "Fashion Store": new Set(["cap", "shoes", "watch", "suit", "backpack"]),
    "Fast Food Restaurant": new Set(["biscuit", "pizza", "burger", "fries", "pink soda", "popcorn"]),
    "Donut Shop": new Set(["donut", "smoothie", "bread", "cake", "ice cream", "coffee"]),
    "Farmer's Market": new Set(["vegetables", "flour", "fruit", "cream", "corn", "cheese", "beef"]),
    "Gardening Supplies": new Set(["grass", "tree", "garden chair", "fire pit", "lawn mover", "gnome"]),
    "Toy Shop": new Set(["toy", "kite", "bear", "game console"]),
    "Sports Shop": new Set(["tennis racket", "soda", "football shoes", "chocolate", "ping-pong table"]),
    "Home Appliances": new Set(["bbq grill", "refrigerator", "bulb", "TV", "microwaver oven"]),
    "Bureau of Restoration": new Set(["wrought iron", "carved wood", "chiseled stone", "tapestry"]),
    "Eco Shop": new Set(["G bag", "G slides", "G mat"]),
    "Tropical Products Store": new Set(["coco oil", "coco cream", "coco milk"]),
    "Car Parts": new Set(["motor oil", "tire", "engine"]),
    "Railway Shop": new Set(["Train Shop Pickaxe", "Train Shop Light", "Train Shop Bolt", "Train Shop Hat"]),
    "Silk Store": new Set(["string", "fan", "robe"]),
    "Others": new Set()
  };

  const summaryByFactory = {};

  // Initialize the summary structure
  for (let factory in factories) {
    summaryByFactory[factory] = {};
  }

  // Summarize materials
  taskSheets.forEach(taskSheet => {
    taskSheet.materials.forEach(material => {
      let matched = false;

      if (!basicMaterials.has(material.materialType)) {
      for (let factory in factories) {
        if (factories[factory].has(material.materialType)) {
          const remainingToProduce = material.quantity - material.producedQuantity;
          if (remainingToProduce > 0) {
          if (summaryByFactory[factory][material.materialType]) {
            summaryByFactory[factory][material.materialType] += remainingToProduce;
          } else {
            summaryByFactory[factory][material.materialType] = remainingToProduce;
          }}
          matched = true;
          break;
        }
      }
      if (!matched) {
        const remainingToProduce = material.quantity - material.producedQuantity;
        if (remainingToProduce > 0) {
          if (summaryByFactory["Others"][material.materialType]) {
            summaryByFactory["Others"][material.materialType] += remainingToProduce;
          } else {
            summaryByFactory["Others"][material.materialType] = remainingToProduce;
          }
        }
      }
    }
    });
  });

  res.json(summaryByFactory);
});
