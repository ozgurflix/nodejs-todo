$(function() {
  var $taskList = $('#task-list');

  $.get('/tasks', function(tasks) {
    tasks.forEach(function(task) {
      $taskList.append('<li>' + task.title + ' <button class="delete-button" data-id="' + task.id + '">Delete</button></li>');
    });
  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    var title = $('input[name="todo"]').val();

    if (!title) {
      alert('Task title is required.');
      return;
    }

    var task = { title: title };

    $.ajax({
      type: 'POST',
      url: '/tasks',
      data: JSON.stringify(task),
      contentType: 'application/json',
      success: function(newTask) {
        $taskList.append('<li>' + newTask.title + ' <button class="delete-button" data-id="' + newTask.id + '">Delete</button></li>');
        $('input[name="todo"]').val('');
      },
      error: function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
        alert('Error - ' + errorMessage);
      }
    });
  });

  // Delete task
  $taskList.on('click', '.delete-button', function() {
    var id = $(this).data('id');

    $.ajax({
      type: 'DELETE',
      url: '/tasks/' + id,
      success: function() {
        $('li').remove('[data-id="' + id + '"]');
      },
      error: function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
        alert('Error - ' + errorMessage);
      }
    });
  });
});
