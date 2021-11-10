var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//ADD FUNCTIONALITY FOR EDITING THE CONTENTS AFTER TASK IS CLICKED
//WHEN THE P element is selected, replace the area with a textarea element so that they cna edit the contents
$(".list-group").on("click", "p", function(){
  var text = $(this).text().trim(); //setting a variable for text to select THIS(left element)
  var textInput = $("<textarea>").addClass("form-control").val(text); // using no <> means LOOK FOR AN ELEMENT, when using <>, its saying CREATE an element
  $(this).replaceWith(textInput); //this is replacing the P element, with the text area element created above when clicked
  textInput.trigger("focus");
});

//after the editing is done in the above code, convert it back to a P element (blur means once we click away, or dorp its focus)
$(".list-group").on("blur", "textarea", function(){
  // get the textarea's current value/text
  var text = $(this).val().trim();

  //get the parent UL id attribute
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  
  //get the task's position in the list of other LI elements
  var index = $(this).closest(".list-group-item").index();

  //update the tasks object with the values captured by the edit
  tasks[status][index].text = text;
  saveTasks();

  //recreate the P element
  var taskP = $("<p>").addClass("m-1").text(text);

  // replace the textarea with P element
  $(this).replaceWith(taskP);
});

//ADD FUNCTIONALITY FOR EDITING THE DATE AFTER ITS CLICKED
//Due date has been clicked, and convert the form to an input
$(".list-group").on("click","span", function(){
  var date = $(this).text().trim();
  //create a new input element after being clicked, give it the CSS class
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);
  $(this).replaceWith(dateInput);
  dateInput.trigger("focus");
});
  //after editing is complete, revert it back to a SPAN element with the contents
  $(".list-group").on("blur", "input", function(){
    //get the input boxes current value
    var date = $(this).val().trim();
    //get the parent UL ID Attribute
    var status = $(this).closest(".list-group").attr("id").replace("list-", "");
    //get the taks position in the list of other LI elements
    var index = $(this).closest(".list-group-item").index();
    //update the tasks objects with the values captured by the edit and save it
    tasks[status][index].date = date;
    saveTasks();
    //recreate the span element
    var dateSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
    //replace the input, with the span
    $(this).replaceWith(dateSpan);
  });


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});


//making the task cards draggable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"), //makes them "snap" in with whatever location has a .card and .list-group class
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event){
  },
  deactivate: function(event){
  },
  over: function(event){
  },
  out: function(event) {
  },
  update: function(event) {
  //declare empty array to be updated
    var tempArray = [];
    //loop through each child of the card and get the details of each P and SPAN element
    $(this).children().each(function(){
      var text = $(this).find("p").text().trim();
      var date = $(this).find("span").text().trim();
      //push the values in date and and text variables, to the text and date kay pairs in the object
      tempArray.push({
        text: text,
        date: date
      });
    });
    //replce the child attributes contents to the new card its been dragged into
    var arrName = $(this).attr("id").replace("list-", "");
    //update the main object "tasks" at this index to equal the value of the tempArray we just made and used
    tasks[arrName] = tempArray;
    //save the updated values to localStorage
    saveTasks();
  }
});

//making the trash droppable
$("#trash").droppable({
  accept: ".card .list-group-item", //telling the system what classes of items will be accepted when dropped on
  tolerance: "touch",
  drop: function(event, ui){
    console.log("drop");
    ui.draggable.remove();
  },
  over: function(event, ui){
    console.log("over");
  },
  out: function(event, ui){
    console.log("out");
  }
});



// load tasks for the first time
loadTasks();


