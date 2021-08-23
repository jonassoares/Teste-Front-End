let jsonTeachersPath = "../json/teachers.json";
let jsonRelationtionsPath = "../json/relationships.json";
let jsonMattersPath = "../json/matters.json";
let jsonStudentsPath = "../json/students.json";
let jsonDegreesPath = "../json/degrees.json";
let jsonClassesPath = "../json/classes.json";

let dataTeachers, dataRelationships, dataMatters, dataStudents, dataClasses, dataDegrees;

function loadTeacher() {
  if(localStorage.hasOwnProperty("allTeachers")) {
    dataTeachers = JSON.parse(localStorage.getItem('allTeachers'));
    loadRealations();
  }
  else{
    $.getJSON(jsonTeachersPath)
      .done(function(data) {
        console.log("Load teachers done.");
        dataTeachers = data;
        loadRealations();
      })
      .fail(function(textStatus, error) {
        let err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        $("#spanFailMessage").text("Faield to load information. Erro: " + err);
        $("#alertFail").show();
      });
  }
}

function loadRealations() {
  if(localStorage.hasOwnProperty("allReleations")) {
    dataRelationships = JSON.parse(localStorage.getItem('allReleations'));
    loadMatters();
  }
  else{
    $.getJSON(jsonRelationtionsPath)
      .done(function(data) {
        console.log("Load relationships done.");
        dataRelationships = data;
        loadMatters();
      })
      .fail(function(textStatus, error) {
        let err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        $("#spanFailMessage").text("Faield to load information. Erro: " + err);
        $("#alertFail").show();
      });
  }
}

function loadMatters() {
  $.getJSON(jsonMattersPath)
    .done(function(data) {
      console.log("Load students done.");
      dataMatters = data;
      loadStudents();
    })
    .fail(function(textStatus, error) {
      let err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
      $("#spanFailMessage").text("Faield to load information. Erro: " + err);
      $("#alertFail").show();
    });
}

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

function loadFilters(){
  $("#selTeacherFilter").html("");
  $("#selDegreeFilter").html("");
  $("#selNewDegree").html("");
  $("#selNewClass").html("");
  $("#selMatterFilter").html("");
  $("#selNewMetter").html("");

  for(let i = 0; i < dataTeachers.length; i++){
    let teacherInfo = dataTeachers[i];
    $("#selTeacherFilter").append("<option selected value='" + teacherInfo.id + "'>" + teacherInfo.name + "</option>");
  }

  for(let i = 0; i < dataDegrees.length; i++){
    let degreeInfo = dataDegrees[i];
    $("#selDegreeFilter").append("<option selected value='" + degreeInfo.id + "'>" + degreeInfo.name + "</option>");
    $("#selNewDegree").append("<option value='" + degreeInfo.id + "'>" + degreeInfo.name + "</option>");
  }

  for(let i = 0; i < dataClasses.classes.length; i++){
    let classeInfo = dataClasses.classes[i];
    $("#selClassFilter").append("<option selected value='" + classeInfo.id + "'>" + classeInfo.name + "</option>");
    $("#selNewClass").append("<option value='" + classeInfo.id + "'>" + classeInfo.name + "</option>");
  }

  for(let i = 0; i < dataMatters.length; i++){
    let matterInfo = dataMatters[i];
    $("#selMatterFilter").append("<option selected value='" + matterInfo.id + "'>" + matterInfo.name + "</option>");
    $("#selNewMetter").append("<option value='" + matterInfo.id + "'>" + matterInfo.name + "</option>");
  }

  startFilter();
}

function getMatterByID(matterId){
  let matterName = dataMatters.filter(function(matter) {
    return matter.id == matterId; });
  return matterName.length >= 1 ? matterName[0].name : "";
}

function getNameByID(teacherId){
  let teacherName = dataTeachers.filter(function(teacher) {
    return teacher.id == teacherId; });
  return teacherName.length >= 1 ? teacherName[0].name : "";
}

function getDegreeByID(degreeId){
  let degreeName = dataDegrees.filter(function(degree) {
    return degree.id == degreeId; });
  return degreeName.length >= 1 ? degreeName[0].name : "";
}

function getClassByID(classId){
  let className = dataClasses.classes.filter(function(classe) {
    return classe.id == classId; });
  return className.length >= 1 ? className[0].name : "";
}

function startFilter(){
  let filterClass = $("#selClassFilter").val();
  let filterDegree = $("#selDegreeFilter").val();
  let filterTeacher = $("#selTeacherFilter").val();
  let filterMatter = $("#selMatterFilter").val();

  $("#divLoadingData").css("display", "block");
  processData(filterClass, filterDegree, filterTeacher, filterMatter);

}

function loadStudentsView(dID, cID){
  let degree = getDegreeByID(dID);
  let className = getClassByID(cID);

  modalTitleClassInfo = document.getElementById("modalTitleClassInfo");
  modalTitleClassInfo.innerText = degree +" - "+ className;


  let getStudents = dataStudents.filter(function(students) {
    return students.degreeId == dID && students.classId == cID;
  });

  $("#tbodyStudentsByDegree").html("");
  getStudents.forEach((student, i) => {
    $("#tbodyStudentsByDegree").append("<tr><td>" + student.id + "</td><td>" + student.name +  "</td><td>" + student.ra + "</td></tr>");
  });

  $('#modalAllClassInfo').modal("toggle");

}

function processData(filterClass, filterDegree, filterTeacher, filterMatter) {
  $("#tableBodyTeachers").html("");
  if (dataRelationships.length <= 0) {
    $("#spanFailMessage").text("Faield to load information. Erro: " + err);
    $("#alertFail").show();
    return;
  }

  var i = 0;
  for(i = 0; i < dataRelationships.length; i++){
    let relation = dataRelationships[i];

    let teacherName = getNameByID(relation.teacherId);
    let metterName = getMatterByID(relation.matterId);

    let teacherDegreesClasses = {};

    relation.degrees.forEach((item, j) => {

      let classesIDs = [];
      item.classes.forEach((itemClassesID, k) => {
        classesIDs.push(itemClassesID.classId);
      });

      teacherDegreesClasses[item.degreeId] = classesIDs;

    });

    for (const [key, value] of Object.entries(teacherDegreesClasses)) {
      value.forEach((classeFilter, idx) => {
        //console.log("Serie:" + key + "Salas:" + classeFilter);

        if(($.inArray(relation.teacherId.toString(), filterTeacher) > -1 ) && ($.inArray(relation.matterId.toString(), filterMatter) > -1 ) &&  ($.inArray(key.toString(), filterDegree) > -1 ) && ($.inArray(classeFilter.toString(), filterClass) > -1 ) ){
          $("#tableBodyTeachers").append("<tr><td>" + relation.teacherId + "</td><td>" + teacherName + "</td><td>" + metterName + "</td><td>" + getDegreeByID(key) +  " - " + getClassByID(classeFilter) + "</td><td><i class='fas fa-users' style='cursor: pointer' id='btnSeeStudents_"+ key +"_"+ classeFilter + "' onClick='loadStudentsView(" + key + "," + classeFilter +")' ></i></td></tr>");
        }

      });
    }
  }

  if(i == dataRelationships.length){
    $("#divLoadingData").css("display", "none");
  }
}

function addNewTeacher(){
  $('#modalAddTeacher').modal("toggle");
}

function saveNewTeacher(){
  let newTeacherName = $("#txtNewTeacherName").val();
  if(newTeacherName.length <= 0){
    alert("Please inform teachers name.");
    return;
  }

  let newTeacherClass = $("#selNewClass").val();
  let newTeacherDegree = $("#selNewDegree").val();
  let newTeacherMatter = $("#selNewMetter").val();

  let newTeacherID = dataTeachers.length + 1;

  let teacher = new Object();
  teacher.id = newTeacherID;
  teacher.name = newTeacherName;

  dataTeachers.push(teacher);
  localStorage.setItem("allTeachers", JSON.stringify(dataTeachers));

  let newRelationshipID = dataRelationships.length + 1

  let relationship = new Object();
  relationship.id = newRelationshipID;
  relationship.teacherId = newTeacherID;
  relationship.matterId = parseInt(newTeacherMatter);
  relationship.degrees = [{
    "degreeId": parseInt(newTeacherDegree),
    "classes": [{"classId": parseInt(newTeacherClass)}]
  }]

  dataRelationships.push(relationship);
  localStorage.setItem("allReleations", JSON.stringify(dataRelationships));

  loadFilters();
  $('#modalAddTeacher').modal('hide');

}

loadTeacher();
