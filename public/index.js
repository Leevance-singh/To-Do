    let data_input = document.getElementById("input_data");
    let data_submit_button = document.getElementById("data_submit_button");
    const todoList = document.getElementById("todo-list");
 
    data_submit_button.addEventListener("click",() => {
        const inputData = data_input.value;

        fetch('/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: inputData }),
        })
        .then(function (res)
        {
            return res.json();
        })
        .then(prev_then_res => {
            if (prev_then_res && prev_then_res.newItem) {
                display_on_page(prev_then_res.newItem);
            }
            data_input.value = '';
        })
        .catch(error => {
            console.error(error);
            alert("There was a problem displaying the data on your screen heheheheeheheh.");
        });
    });

    todoList.addEventListener('change', (event) => {
        if (event.target.classList.contains('checkbox_status')) {
            const id = event.target.getAttribute('id'); //doc.getelemntbyid try once
            const status = event.target.checked;

            fetch('/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            })
            .then(res => res.json())
            .then(function(prev_then_res)
            {
                current_elemnt = event.target.parentNode;
                textElement = current_elemnt.querySelector('span');
                if (status) {
                    textElement.classList.add("completed");
                } else {
                    textElement.classList.remove("completed");
                }
            })    
            .catch(error => {
                console.error(error);
            });
        }
    });

    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete_button')) {
            const id = event.target.getAttribute('id');
    
            fetch('/delete-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(prev_then_res) {
                if (prev_then_res.success) {
                    const li = event.target.parentNode;
                    li.remove(); 
                }
            })
            .catch(function(error) {
                console.error(error);
            });
        }
    });
    

    function display_on_page(item) {
        const li = document.createElement('li');
        li.setAttribute('data-id', item._id);

        span = document.createElement('span');
        span.textContent = item.name;
        if (item.Check_status) {
            span.classList.add('completed');
        }
        li.appendChild(span);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox_status');
        checkbox.id = item._id;
        checkbox.checked = item.Check_status;
        li.appendChild(checkbox);

        const deleteButton = document.createElement('img');
        deleteButton.src = 'pinwheel.png';
        deleteButton.classList.add('delete_button');
        deleteButton.height = 10;
        deleteButton.width = 10;
        deleteButton.id = item._id;
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    }

