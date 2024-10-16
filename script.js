$(document).ready(function() {
    loadTasks();
    loadHeading();

    // Add task on enter key press
    $('#todo-input').keypress(function(e) {
        if (e.which === 13) {
            addTask();
        }
    });

    // Add task on button click
    $('#add-btn').click(addTask);

    // Delete task on long press
    $(document).on('contextmenu', '.todo-item', deleteTask);

    // Move task up on double tap
    $(document).on('dblclick', '.todo-item', moveTaskUp);

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
            '</li>';
            $('#todo-list').append(taskHtml);
            $('#todo-input').val('');
            saveTasks();
        }
    }

    function deleteTask(e) {
        e.preventDefault();
        $(this).remove();
        saveTasks();
    }

    function moveTaskUp() {
        var task = $(this);
        task.prev().before(task.get());
        saveTasks();
    }

    function resetTasks() {
        $('#todo-list').empty();
        localStorage.removeItem('tasks');
        $('h1').text('To-Do-List'); // Reset h1 content
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
                '</li>';
                $('#todo-list').append(taskHtml);
            });
        }
    }

    // Call saveHeading whenever the h1 content changes
    $('h1').on('input', saveHeading);
});