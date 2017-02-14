/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Variables
var current_time = 0;                                                       // Get current time
var next_show_time = 0;                                                     // Next earliest possible show time
var next_feeding_time = 0;                                                  // Next earliest possible feeding time
var feeding_exhibit_name = "";                                              // Name of exhibit for feeding time
var show_exhibit_name = "";                                                 // Name of exhibit for show time
var database = firebase.database();                                         // Reference to firebase database
var feeding_ref = database.ref("/Feeding");                                 // Reference to Feeding node
var show_ref = database.ref("/Show");                                       // Reference to Show node
var show_not_found = true;                                                  // Boolean value to determine show found or not
var feeding_not_found = true;                                               // Boolean value to determine feeding found or not

// Function to get current time
function get_current_time(){
    var time = new Date();
    hours = time.getHours();
    mins = time.getMinutes();
    return((hours * 100) + mins);
}

// Function to find show timing closest to current time
function get_next_show_time(){
    show_ref.once("value")
    .then(function(allSnapshot){
        allSnapshot.forEach(function(childSnapshot){
            if(show_not_found){                                                                         // if a timing has not been found
                if (childSnapshot.key > current_time){                                                  // Only interested in timings later than current time
                    next_show_time = childSnapshot.key;                                                 // Store next earliest show timing
                    
                    var show_exhibit_ref = database.ref("/Show/" + String(next_show_time) + "/exhibit");
                    show_exhibit_ref.once("value")
                        .then(function(exhibitSnapshot){
                            show_exhibit_name = exhibitSnapshot.val();                                  // Store exhibit name
                            document.getElementById("show_time").innerHTML = next_show_time;            // Display feeding time
                            document.getElementById("show_name").innerHTML = show_exhibit_name;         // Display feeding exhibit name
//                            document.getElementById("show_pic").src = "images/" + String(feeding_exhibit_name) + ".png";
                    });
                    
                    show_not_found = false;                                                             // Update found to be true to stop the forEach loop
                }
            }
        });
    });
}
    
// Function to find feeding timing closest to current time
function get_next_feeding_time(){
    feeding_ref.once("value")
    .then(function(allSnapshot){
        allSnapshot.forEach(function(childSnapshot){
            if(feeding_not_found){                                                                      // if a timing has not been found
                if (childSnapshot.key > current_time){                                                  // Only interested in timings later than current time
                    next_feeding_time = childSnapshot.key;                                              // Store next earliest feding timing
                    
                    var feeding_exhibit_ref = database.ref("/Feeding/" + String(next_feeding_time) + "/exhibit");
                    feeding_exhibit_ref.once("value")
                        .then(function(exhibitSnapshot){
                            feeding_exhibit_name = exhibitSnapshot.val();                               // Store exhibit name
                            document.getElementById("feeding_time").innerHTML = next_feeding_time;      // Display feeding time
                            document.getElementById("feeding_name").innerHTML = feeding_exhibit_name;   // Display feeding exhibit name
//                            document.getElementById("feeding_pic").src = "images/" + String(feeding_exhibit_name) + ".png";
                    });
                    
                    feeding_not_found = false;                                                          // Update found to be true to stop the forEach loop
                }
            }
        });
    });
}

current_time = get_current_time();          // Get current time in 24hr format
get_next_show_time();                       // Get show time closest to current time
get_next_feeding_time();                    // Get feeding time closest to current time