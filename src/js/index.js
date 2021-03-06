const TodoApp = {};
window.TodoApp = TodoApp;
TodoApp.items = [];




if(localStorage.getItem('items')){
    TodoApp.items = JSON.parse(localStorage.getItem('items'));
}


function updateLocalStorage(){
    localStorage.setItem('items', JSON.stringify(TodoApp.items));
}



function addTask(task){
    if(task===undefined || task.lenght===0){
        return;
    }
    TodoApp.items.push({
        id: new Date().getTime(),
        name:task,
        completed:false,
        timeSpent : 0,
        timerActive: false
    });

    updateLocalStorage();
    updateUI();
}

//window.addTask = addTask;


function toggleTask(task_id) {    
    const task_local = TodoApp.items.filter(t => t.id === task_id);    
    if(task_local) {
        task_local[0].completed = !task_local[0].completed;
    }
    if(task_local[0].completed){
        task_local[0].timerActive= false;
    }
    updateLocalStorage();
    updateUI();
}
TodoApp.toggleTask = toggleTask;



//Delete ıtems
function deleteTask(task_id) {
    TodoApp.items = TodoApp.items.filter( t => t.id !== task_id );
    updateLocalStorage();
    updateUI();
}
TodoApp.deleteTask = deleteTask;




//DELETE all task
function deleteAllTasks(){
    TodoApp.items =[];
    updateLocalStorage();
    updateUI();
}
TodoApp.deleteAllTasks = deleteAllTasks;

// Start Timer
function startTimer(task_id){
    const task_other = TodoApp.items.filter(t => t.id !== task_id);
    task_other.map(task => task.timerActive = false);
    const task_local = TodoApp.items.filter(t => t.id === task_id);
    if(task_local) {
        task_local[0].timerActive = true;
    }
    updateLocalStorage();
    updateUI();
}
TodoApp.startTimer = startTimer;


// Pause Timer 
function pauseTimer(task_id){
    const task_local = TodoApp.items.filter(t => t.id === task_id);
    if(task_local) {
        task_local[0].timerActive = false;
    }
    updateLocalStorage();
    updateUI();
}
TodoApp.pauseTimer = pauseTimer;


//Timer
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

setInterval(function(){
    TodoApp.items.filter(task => task.timerActive).map(task => task.timeSpent++);
    updateLocalStorage();
    updateUI();
}, 1000);



// UI ---------------------------

const getTasksMarkup = (is_completed) => 
    TodoApp.items.filter(task => task.completed === is_completed)
        .map(task => `<li><input type="checkbox" onclick="TodoApp.toggleTask(${task.id})" 
        ${task.completed ? 'checked' : ''}>${task.name}
        ${secondsToHms(task.timeSpent)} 
        ${task.completed ? '' : 
        `<button onclick="${task.timerActive ? 'TodoApp.pauseTimer(' + task.id + ')' : 'TodoApp.startTimer(' + task.id + ')'}">${task.timerActive ? 'Durdur' : 'Başlat'}</button>`}
        ${task.completed ? '' : `<a onclick="TodoApp.deleteTaskUi(${task.id})" href="#" id="itemDelete" class="delete-all float-right">Task remove</a>`}
        </li>`).join('\n');

//window.getTasksMarkup = getTasksMarkup;

window.addEventListener('load', function(){
    updateUI();
});

function updateUI() {
    document.getElementById('task-list').innerHTML = getTasksMarkup(false);
    document.getElementById('done_list').innerHTML = getTasksMarkup(true);
}

const form = document.getElementById('addTaskForm');


form.addEventListener('submit', function(e){

    const input = document.getElementById('txtTaskName');

    addTask(input.value);

    input.value = '';

    e.preventDefault();
})

const deleteAll = document.getElementById('btnDeleteAll');

deleteAll.addEventListener('click', function(e){
    if(confirm('are you sure ?')){
        deleteAllTasks();
    }    
});



// delete items ui
function deleteTaskUi(task_id){
    if(confirm('are you sure ?')){
        deleteTask(task_id);
    }
}
TodoApp.deleteTaskUi = deleteTaskUi;

  