const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'home')));

const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.get('/tasks', (req, res) => {
  fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the tasks file.');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/tasks', function(req, res) {
    if (!req.body.title) {
      res.status(400).send('Task title is required.');
      return;
    }
  
    fs.readFile(TASKS_FILE, function(err, data) {
      if (err) throw err;
      var tasks = JSON.parse(data);
      var newTask = { id: tasks.length + 1, title: req.body.title };
      tasks.push(newTask);
      fs.writeFile(TASKS_FILE, JSON.stringify(tasks), function(err) {
        if (err) throw err;
        res.send(newTask);
      });
    });
  });

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      res.status(400).send('Invalid task ID');
      return;
    }

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading tasks file');
        return;
      }

      const tasks = JSON.parse(data);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        res.status(404).send('Task not found, probably deleted.');
        return;
      }

      tasks.splice(taskIndex, 1);

      fs.writeFile(TASKS_FILE, JSON.stringify(tasks), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing tasks file');
          return;
        }
        res.send('Task deleted successfully');
      });
    });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
