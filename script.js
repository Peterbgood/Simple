$(document).ready(function() {
    loadTasks();
    loadHeading();
    var holdTimeout;
    var startTime;
    var longPress = 500; // 0.5 seconds
    var editing = false;

    // Add task on enter key press
    $('#todo-input').keypress(function(e) {
        if (e.which === 13) {
            addTask();
        }
    });

    // Add task on button click
    $('#add-btn').click(addTask);

    // Edit task on long press
    $(document).on('touchstart mousedown', '.todo-item', function(e) {
        var $this = $(this);
        startTime = new Date().getTime();
        holdTimeout = setTimeout(function() {
            editTask($this);
        }, longPress);
        e.preventDefault(); // Prevent text selection
    });

    $(document).on('touchend mouseup', '.todo-item', function(e) {
        var endTime = new Date().getTime();
        var holdTime = endTime - startTime;
        if (holdTime < longPress) {
            clearTimeout(holdTimeout);
        }
    });

    $(document).on('touchmove mousemove', '.todo-item', function() {
        clearTimeout(holdTimeout);
    });

    // Move task up on double tap
    $(document).on('dblclick', '.todo-item', function() {
        moveTaskUp($(this));
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
        var input = $('<input type="text" class="form-control" value="' + taskText + '" autofocus>');
        
        // Temporarily hide the delete button
        $task.find('.delete-btn').hide();
    
        // Replace the span with input
        $task.find('span').replaceWith(input);
    
        // Blur the current active element
        if (document.activeElement) {
            $(document.activeElement).blur();
        }
    
        setTimeout(function() {
            input.attr('autofocus', true);
    
            // Forcing focus using plain JavaScript
            var element = input[0];
            element.focus();
            element.click(); // Simulate a click to force keyboard display
            element.setSelectionRange(0, element.value.length); // Select text for easier editing
        }, 100);
    
        editing = true;
    
        input.on('keypress', function(e) {
            if (e.which === 13) { // Enter key
                var newText = input.val();
                input.replaceWith('<span>' + newText + '</span>');
                saveTasks();
                editing = false;
                $task.find('.delete-btn').show(); // Show the delete button again
            }
        });
    
        input.blur(function() {
            var newText = input.val();
            input.replaceWith('<span>' + newText + '</span>');
            saveTasks();
            editing = false;
            $task.find('.delete-btn').show(); // Show the delete button again
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
                    '<button class="delete-btn btn btn-danger btn-sm">Delete</button>' +
                '</li>';
                $('#todo-list').append(taskHtml);
            });
        }
    }

    // Call saveHeading whenever the h1 content changes
    $('h1').on('input', saveHeading);
});
