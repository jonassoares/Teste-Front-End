let jsonStudentsPath = "../json/students.json";
let jsonDegreesPath = "../json/degrees.json";
let jsonClassesPath = "../json/classes.json";

let dataStudents, dataClasses, dataDegrees;

function loadStudents() {
  $("#divLoadingData").css("display", "block");
  if(localStorage.hasOwnProperty("allStudents")) {
    dataStudents = JSON.parse(localStorage.getItem('allStudents'));
    loadDegrees();
  }
  else{
    $.getJSON(jsonStudentsPath)
      .done(function(data) {
        console.log("Load students done.");
        dataStudents = data;
        loadDegrees();
      })
      .fail(function(textStatus, error) {
        let err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        $("#spanFailMessage").text("Faield to load information. Erro: " + err);
        $("#alertFail").show();
      });
  }
}

function loadDegrees() {
  $.getJSON(jsonDegreesPath)
    .done(function(data) {
      console.log("Load degress done.");
      dataDegrees = data;
      loadClasses();
    })
    .fail(function(textStatus, error) {
      let err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
      $("#spanFailMessage").text("Faield to load information. Erro: " + err);
      $("#alertFail").show();
    });
}

function loadClasses() {
  $.getJSON(jsonClassesPath)
    .done(function(data) {
      console.log("Load classes done.");
      dataClasses = data;
      loadFilters();
    })
    .fail(function(textStatus, error) {
      let err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
      $("#spanFailMessage").text("Faield to load information. Erro: " + err);
      $("#alertFail").show();
    });
}

function getStudentDegreeByID(id){
  let student_degree = dataDegrees.filter(function(degree) {
    return degree.id == id; });
  return student_degree.length >= 1 ? student_degree[0].name : "";
}

function getStudentClassByID(id){
  let student_class = dataClasses.classes.filter(function(class_student) {
    return class_student.id == id; });
  return student_class.length >= 1 ? student_class[0].name : "";
}

function editStudentInfo(studentId, studantName, studantRA, studantDegree, studantClasse){;
  $('#txtEditID').val(studentId);
  $('#txtEditName').val(studantName);
  $('#txtEditRA').val(studantRA);
  $('#txtEditDegree').val(studantDegree);
  $('#selEditClass').val(studantClasse);

  $('#modalUpdateStudentInfo').modal("toggle");

}

function updateStudentInfo(){
  let studentToUpdateID = $('#txtEditID').val();
  let studentNameUpdated = $('#txtEditName').val();
  let studantClassUpdated = $('#selEditClass').val();

  if(studentNameUpdated.length <=0 || studantClassUpdated.length <= 0){
    alert("Invalid name or class.");
    return;
  }

  let currentStudent = dataStudents.filter(function(student){
    return student.id == studentToUpdateID;
  });

  currentStudent[0].name = studentNameUpdated;
  currentStudent[0].classId = parseInt(studantClassUpdated);

  localStorage.setItem("allStudents", JSON.stringify(dataStudents));

  startFilter();
  $('#modalUpdateStudentInfo').modal('hide');

}

function loadFilters(){
  for(let i = 0; i < dataDegrees.length; i++){
    let degreeInfo = dataDegrees[i];
    $("#selDegreeFilter").append("<option selected value='" + degreeInfo.id + "'>" + degreeInfo.name + "</option>");
  }

  for(let i = 0; i < dataClasses.classes.length; i++){
    let classeInfo = dataClasses.classes[i];
    $("#selClassFilter").append("<option selected value='" + classeInfo.id + "'>" + classeInfo.name + "</option>");
  }

  startFilter();
}

function startFilter(){
  let filterClass = $("#selClassFilter").val();
  let filterDegree = $("#selDegreeFilter").val();

  $("#divLoadingData").css("display", "block");
  processData(filterClass, filterDegree);

}

function loadStudantChart(){
  var table = document.getElementById("tableStudents");
  var tableLen = table.rows.length;
  var degreeQty = {};

  for (var i = 1; i < tableLen; i++) {
    if(!(table.rows[i].cells[3].innerText in degreeQty)){
      degreeQty[table.rows[i].cells[3].innerText] = 1;
    }
    else{
      degreeQty[table.rows[i].cells[3].innerText] += 1;
    }
  }

  var arrayDegreeQty = {labels: [], qty: []};
  for (var key in degreeQty) {
    if (degreeQty.hasOwnProperty(key)) {
      arrayDegreeQty.labels.push(key);
      arrayDegreeQty.qty.push(degreeQty[key]);
    }
  }

  var pieChartContent = document.getElementById('pieChartContent');
  pieChartContent.innerHTML = '&nbsp;';
  $('#pieChartContent').append('<canvas id="studentsPieChart"><canvas>');

  var canvasP = document.getElementById("studentsPieChart")
  var ctxP = canvasP.getContext('2d')
  var myPieChart = new Chart(ctxP, {
    type: 'pie',
    data: {
      labels: arrayDegreeQty.labels,
      datasets: [{
        data: arrayDegreeQty.qty,
        backgroundColor: ["#64B5F6", "#FFD54F", "#2196F3",  "#1976D2", "#FFA000", "#0D47A1","#B2EBF2", "#FFCCBC", "#4DD0E1", "#FF8A65", "#FF5722" , "#FF1222", "#FF8822" , "#FF1572"],
      }]
    },
    options: {
      legend: {
        display: true,
        position: "bottom"
      }
    }
  })
}

function processData(filterClass, filterDegree) {
  $("#tableBodyStudents").html("");
  if (dataStudents.length <= 0) {
    $("#spanFailMessage").text("Faield to load information. Erro: " + err);
    $("#alertFail").show();
    return;
  }

  var i = 0;
  for(i = 0; i < dataStudents.length; i++){
    let student = dataStudents[i];
    if(($.inArray(student.classId.toString(), filterClass) > -1 ) && ($.inArray(student.degreeId.toString(), filterDegree) > -1)){
        let degree = getStudentDegreeByID(student.degreeId);
        let classe = getStudentClassByID(student.classId);
        $("#tableBodyStudents").append("<tr><td>" + student.id + "</td><td>" + student.name + "</td><td>" + student.ra + "</td><td>" + degree +  "</td><td>" + classe + "</td><td><i class='fas fa-edit' style='cursor: pointer' id='btnEditStudent" + student.id + "' onClick='editStudentInfo(" + student.id + ",\"" + student.name + "\", " + student.ra + ",\"" + degree + "\", " + student.classId + ")' ></i></td></tr>");
    }
  }

  if(i == dataStudents.length){
    $("#divLoadingData").css("display", "none");
    loadStudantChart();
  }
}

function createRandomStudents(){
  $("#divLoadingData").css("display", "block");
  let lastStudentID = dataStudents.length;

  for(let i = 1; i <= 300; i++){
    let newStudent = new Object();

    newStudent.id = parseInt(lastStudentID) + i;
    newStudent.ra = Math.floor(Math.random() * 999999);
    newStudent.name = "Nome do Aluno " + (parseInt(lastStudentID) + i);
    newStudent.degreeId = Math.floor(Math.random() * 13);
    newStudent.classId = Math.floor(Math.random() * 6)

    dataStudents.push(newStudent);
  }

  localStorage.setItem("allStudents", JSON.stringify(dataStudents));

  startFilter();
}


loadStudents();
