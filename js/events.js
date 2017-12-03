
// Global Variables
var current_time = 0;                                                       // Get current time based on browser's time zone
var next_show_time = 0;                                                     // Next earliest possible animal show time
var next_feeding_time = 0;                                                  // Next earliest possible anmimal feeding time
var feeding_location = " ";                                                 // Location of exhibit for animal feeding
var show_location = " ";                                                    // Location of exhibit for animal show
var show_title = " ";                                                       // Title of animal show
var feeding_title = " ";                                                    // Title of animal feeding
var database = firebase.database();                                         // Reference to firebase database
var feeding_ref = database.ref("/Feeding");                                 // Reference to Feeding node in Firebase
var show_ref = database.ref("/Show");                                       // Reference to Show node in Firebase
var show_not_found = true;                                                  // Boolean value to determine show found or not, default set to true
var feeding_not_found = true;                                               // Boolean value to determine feeding found or not, default set to true

// Function to get current time in the format of HHMM
function get_current_time(){
    var time = new Date();
    console.log("time = " + time);
    hours = time.getHours();
    console.log("Hours = " + hours);
    mins = time.getMinutes();
    console.log("mins = " + mins);
    console.log("Time now = " + (hours * 100) + mins);
    return((hours * 100) + mins);
}

// Function to search for an animal show timing closest to current time from the Show node in Firebase
function get_next_show_time(){
    show_ref.once("value")
    .then(function(allSnapshot){
        allSnapshot.forEach(function(childSnapshot){        // Equivalent to a for loop to loop through all the child nodes under the parent Show node
            if(show_not_found){                             // if a timing has not been found
                if (childSnapshot.key > current_time){      // Only interested in timings later than current time
                    next_show_time = childSnapshot.key;     // Store next earliest animal show timing

                    // Route to title child node to capture value of animal show title
                    var show_title_ref = database.ref("/Show/" + String(next_show_time) + "/title");
                    show_title_ref.once("value")
                        .then(function(titleSnapshot){
                            show_title = titleSnapshot.val();                                             // Store title of animal show in local variable
                            document.getElementById("show_name").innerHTML = show_title;                  // Display title of animal show
                            document.getElementById("show_img").src = "img/show/" + show_title + ".jpg";  // Display image of animal show
                    });

                    // Route to exhibit child node to capture value of animal show location
                    var show_exhibit_ref = database.ref("/Show/" + String(next_show_time) + "/exhibit");
                    show_exhibit_ref.once("value")
                        .then(function(exhibitSnapshot){
                            show_location = exhibitSnapshot.val();                                        // Store location of animal show in local variable
                            document.getElementById("show_location").innerHTML = String(show_location);   // Display location of animal show
                            document.getElementById("show_time").innerHTML = next_show_time;              // Display animal show time
                    });

                    show_not_found = false;                                                               // Update boolean to false to stop the forEach loop as an animal show has been found
                }
            }
        });
    });
}

// Function to search for a animal feeding timing closest to current time
function get_next_feeding_time(){
    feeding_ref.once("value")
    .then(function(allSnapshot){
        allSnapshot.forEach(function(childSnapshot){        // Equivalent to a for loop to loop through all the child nodes under the parent Feeding node
            if(feeding_not_found){                          // if a timing has not been found
                if (childSnapshot.key > current_time){      // Only interested in timings later than current time
                    next_feeding_time = childSnapshot.key;  // Store next earliest feeding timing

                    // Route to animal child node to capture value of animal name
                    var feeding_title_ref = database.ref("/Feeding/" + String(next_feeding_time) + "/animal");
                    feeding_title_ref.once("value")
                        .then(function(titleSnapshot){
                            feeding_title = titleSnapshot.val();                                        // Store title of animal feeding in local variable
                            document.getElementById("feeding_name").innerHTML = feeding_title           // Display title of animal feeding
                            document.getElementById("feeding_img").src = "img/feeding/" + feeding_title  + " Feeding.jpg";  // Display image of animal feeding
                    });

                    // Route to exhibit child node to capture value of animal feeding location
                    var feeding_exhibit_ref = database.ref("/Feeding/" + String(next_feeding_time) + "/exhibit");
                    feeding_exhibit_ref.once("value")
                        .then(function(exhibitSnapshot){
                            feeding_location = exhibitSnapshot.val();                                   // Store location of animal feeding in local variable
                            document.getElementById("feeding_location").innerHTML = feeding_location;   // Display location of animal feeding
                            document.getElementById("feeding_time").innerHTML = next_feeding_time;      // Display feeding time
                    });

                    feeding_not_found = false;                                                          // Update boolean to false to stop the forEach loop as an animal feeding has been found
                }
            }
        });
    });
}

current_time = get_current_time();          // Get current time in 24hr format
console.log("Current Time = " + current_time);

if (current_time > 1700){                   // No animal shows or feedings available after 1700
  document.getElementById("show_name").innerHTML = "Sorry, No more shows for the day";
  document.getElementById("feeding_name").innerHTML = "Sorry, No more feedings for the day";
}
else if (current_time > 0 && current_time < 700) {  // No animal shows or feedings available after 12 midnight
  document.getElementById("show_name").innerHTML = "Sorry, No more shows for the day";
  document.getElementById("feeding_name").innerHTML = "Sorry, No more feedings for the day";
}
else {                                      // There are still available aninmal shows or feedings
  get_next_show_time();                     // Get show time closest to current time
  get_next_feeding_time();                  // Get feeding time closest to current time
}
