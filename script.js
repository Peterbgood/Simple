$(document).ready(function() {
    loadTasks();
    loadHeading();
    var editing = false;

    // Add task on enter key press
    $('#todo-input').keypress(function(e) {
        if (e.which === 13) {
            addTask();
        }
    });

    // Add task on button click
    $('#add-btn').click(addTask);

    // Edit task on tap
    $(document).on('click', '.todo-item', function(e) {
        var $this = $(this);
        if (!editing) {
            editTask($this);
        }
    });

    // Move task up on double tap
    $(document).on('dblclick', '.todo-item', function() {
        if (!editing) {
            moveTaskUp($(this));
        }
    });

    // Delete task on delete button click
    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation(); // Prevent editTask from triggering
        var $task = $(this).closest('.todo-item');
        deleteTask($task);
    });

    // Reset all tasks
    $('#reset-btn').click(resetTasks);

    // Save h1 content to local storage
    function saveHeading() {
        var heading = $('h1').text().trim();
        localStorage.setItem('heading', heading);
    }

    // Load h1 content from local storage
    function loadHeading() {
        var storedHeading = localStorage.getItem('heading');
        if (storedHeading) {
            $('h1').text(storedHeading);
        }
    }

    function addTask() {
        var task = $('#todo-input').val();
        if (task !== '') {
            var taskHtml = '<li class="todo-item">' +
                '<span>' + task.trim() + '</span>' +
                '<button class="delete-btn btn btn-danger btn-sm">Delete</button>' +
            '</li>';
            $('#todo-list').append(taskHtml);
            $('#todo-input').val('');
            saveTasks();
        }
    }

    function editTask($task) {
        var taskText = $task.find('span').text();
        var editableSpan = $('<span contenteditable="true" class="form-control">' + taskText + '</span>');

        // Temporarily hide the delete button
        $task.find('.delete-btn').hide();

        // Replace the span with an editable span
        $task.find('span').replaceWith(editableSpan);

        editableSpan.focus();
        editableSpan.click(); // Trigger click to force keyboard display
        editing = true;

        editableSpan.on('blur', function() {
            var newText = editableSpan.text();
            editableSpan.replaceWith('<span>' + newText + '</span>');
            saveTasks();
            editing = false;
            $task.find('.delete-btn').show(); // Show the delete button again
        });

        editableSpan.on('keypress', function(e) {
            if (e.which === 13) { // Enter key
                e.preventDefault(); // Prevent new line in contenteditable
                editableSpan.blur();
            }
        });
    }

    function deleteTask($task) {
        $task.remove();
        saveTasks();
    }

    function moveTaskUp($task) {
        if (!editing) {
            $task.prev().before($task.get());
            saveTasks();
        }
    }

    function resetTasks() {
        $('#todo-list').empty();
        localStorage.removeItem('tasks');
        $('h1').text('Max'); // Reset h1 content
        localStorage.removeItem('heading'); // Remove saved heading
    }

    function saveTasks() {
        var tasks = [];
        $('#todo-list li span').each(function() {
            var taskText = $(this).text().trim();
            if (taskText !== '') {
                tasks.push(taskText);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        saveHeading(); // Call saveHeading here
    }

    function loadTasks() {
        $('#todo-list').empty();
        var storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            $.each(storedTasks, function(index, task) {
                var taskHtml = '<li class="todo-item">' +
                    '<span>' + task.trim() + '</span>' +
                    '<button class="delete-btn btn btn-danger btn-sm">Del</button>' +
                '</li>';
                $('#todo-list').append(taskHtml);
            });
        }
    }

    // Call saveHeading whenever the h1 content changes
    $('h1').on('input', saveHeading);
});
