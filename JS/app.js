//The URIs of the REST endpoints
// post new video 
VIDEO_IUPS="https://prod-15.centralus.logic.azure.com:443/workflows/1ef4dd48cc0b43d089aa1387d93a65c7/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5NVxP2MkN5XMw_slluW5LUqz4JMxHFdXX2VUnRNZrPM";

// get all videos 
VIDEO_RAI="https://prod-18.centralus.logic.azure.com:443/workflows/4533b6d385ba4cb4a5fdf2ce3004e13d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=y6wYV38S6JD4UtY1fQrtahGQ0vA0jVETSeeMEyF6H8o";

// post new user
USER_IUPS="https://prod-13.centralus.logic.azure.com/workflows/1349ee5f08ca4d19bb5cce857641fa56/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Gg9CKCt699ANHJC-2fCSfRercY3l8eDH1ULfMmSON1Q"

// get all users
USER_RAI="https://prod-10.centralus.logic.azure.com/workflows/881140c3566a4023b7d18588b3dced4d/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PEFT7IAmOySk3FXlq1sdJW-wSnmUyM83CzNTXWDR8WM"

// delete user 
DIAURI0="https://prod-01.centralus.logic.azure.com/workflows/c3ed74230f3845fcbe252e25c825f6ed/triggers/manual/paths/invoke/rest/v1/users/";
DIAURI1="?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PIqaZbQRRIYlMKJ-OzltQAF_NsTaxi2A_EC1u9Y1sOU";

// delete video
VIDEO_DIA0="https://prod-02.centralus.logic.azure.com/workflows/987baceb086749a0a351caf7b6ad3e57/triggers/manual/paths/invoke/rest/v1/videos/"; 
VIDEO_DIA1="?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=s93oxxZr2bD6lPPoIlsWaN-K-d14aoUlXZNUQJjolRU"

// blob account
BLOB_ACCOUNT="https://blobstoragecom682mm.blob.core.windows.net";

// Handlers for button clicks
$(document).ready(function () {
  // Handler for the get videos button 
  $("#getVideos").click(function () {
    //Run the get video list function
    getVideos();
  });
  // Handler for the new video submission button
  $("#subNewVideo").click(function () {
    //Execute the submit new asset function
    submitNewVideo();
  });
  // Handler for the new user submission button
  $("#subNewUser").click(function () {
    //Execute the submit new asset function
    submitNewUser();
  });
  // Handler for the get users button
  $("#getUsers").click(function () {
    //Run the get user list function
    getUsers();
  });
});

// CREATORS ONLY: A function to POST/submit a new video to the REST endpoint
function submitNewVideo() {
  // Create a form data object
  submitData = new FormData();
  // Get form variables and append them to the form data object
  submitData.append("title", $("#title").val());
  submitData.append("producer", $("#producer").val());
  submitData.append("publisher", $("#publisher").val());
  submitData.append("genre", $("#genre").val());
  submitData.append("ageRating", $("#ageRating").val());
  submitData.append("userName", $("#username").val());
  submitData.append("userID", $("#userID").val());
  submitData.append("File", $("#UpFile")[0].files[0]);
  // Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: VIDEO_IUPS,
    data: submitData,
    cache: false,
    enctype: "multipart/form-data",
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {},
  });
}

// A function to GET a list of all the videos and write them to the Div with the VideoList Div
function getVideos() {
  //Replace the current HTML in that div with a loading message
  $("#VideoList").html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(VIDEO_RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr />");
      items.push("<div><video controls src='" + BLOB_ACCOUNT + val["filepath"] +"' width='400' type='video/mp4'/></div><br />");
      items.push('<button type="button" id="likeCounter" onclick="likeCounter()" class="btn btn-info">Like</button>');
      items.push('<button type="button" id="dislikes" class="btn btn-danger">Dislike</button><br />');
      items.push("Title: " + val["title"] + "<br />");
      items.push("Producer: " + val["producer"] + "<br />");
      items.push("Publisher: " + val["publisher"] + "<br />");
      items.push("Genre: " + val["genre"] + "<br />");
      items.push("Age Rating: " + val["ageRating"] + "<br />");
      items.push("Uploaded by: " + val["userName"] + " (user id: " + val["userID"] + ")<br />");
      items.push('<button type="button" id="deleteVideo" style="display: none;" class="btn btn-danger" onclick="deleteVideo(\''+val["id"] +'\')">Delete</button><br/>');
    });
    
    //Clear the videoList div
    $("#VideoList").empty();
    //Append the contents of the items array to the VideoList Div
    $("<ul/>", {
      class: "my-video-list",
      html: items.join(""),
    }).appendTo("#VideoList");
  })
}

// delete video: A function to delete an asset with a specific ID.
function deleteVideo(id){
  $.ajax({
    type: "DELETE",
    // concatenate DIA0 & DIA1 with id between them 
    url: VIDEO_DIAURI0 + id + VIDEO_DIAURI1,
  }).done(function( msg ) {
    // on success, update and show the userList
    getVideos();
  });
}

// SIGNUP OR ADMINS ONLY: A function to POST/submit a new user to the REST endpoint
// A function to submit a new asset to the REST endpoint 
function submitNewUser(){
  //Construct JSON Object for new item
  var subObj = {
    username: $('#username').val(),
    userPassword: $('#userPassword').val(),
    userRole: $('#userRole').val(),
  }
  //Convert to a JSON String
  subObj = JSON.stringify(subObj);
  //Post the JSON string to the endpoint, note the need to set the content type header
  $.post({
    url: USER_IUPS,
    data: subObj,
    contentType: 'application/json; charset=utf-8'
  }).done(function (response) {
    getUsers();
  });
}

// ADMIN ONLY: A function to get a list of all the Users and write them to the Div with the UserList Div
function getUsers() {
  //Replace the current HTML in that div with a loading message
  $("#UserList").html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(USER_RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      items.push("<hr />");
      items.push("Username: " + val["username"] + "<br />");
      items.push("Password: " + val["userPassword"] + "<br />");
      items.push("User Role: " + val["userRole"] + "<br />");
      items.push('<button type="button" id="deleteUser" class="btn btn-danger" onclick="deleteUser(\''+val["userID"] +'\')">Delete</button><br/>');
    });
    //Clear the UserList div
    $("#UserList").empty();
    //Append the contents of the items array to the UserList Div
    $("<ul/>", {
      class: "my-user-list",
      html: items.join(""),
    }).appendTo("#UserList");
  });
}

// delete user: A function to delete an asset with a specific ID.
function deleteUser(id){
  $.ajax({
    type: "DELETE",
    // concatenate DIA0 & DIA1 with id between them 
    url: DIAURI0 + id + DIAURI1,
  }).done(function( msg ) {
    // on success, update and show the userList
    getUsers();
  });
}