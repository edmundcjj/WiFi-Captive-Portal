/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Variables
var current_time = "";                                                      // Get current time
var next_show_time = 0;                                                     // Next earliest possible show time
var next_feeding_time = 0;                                                  // Next earliest possible feeding time
var hours, mins = 0;                                                        // Current time in hours and minutes
var show_time = "";                                                         // Time of animal show
var show_name = "";                                                         // Name of the animal show
var feeding_time = "";                                                      // Time of feeding show
var feeding_name = "";                                                      // Name of the animal that is being fed by zookepers
var temp_feeding_list = {};                         // Array to store list of feeding and show timings
var feeding_list = [];
var temp_show_list  = {};
var show_list = [];
var feeding_boolean, show_boolean = false;                                  // Check if feeding or show node exists
var database = firebase.database();                                         // Reference to firebase database

// Get current time
var time = new Date();
hours = time.getHours();
mins = time.getMinutes();
current_time = (hours * 100) + mins;

// Save details of feeding and show into feeding_list and show_list respectively
var all_ref = database.ref();
all_ref.once("value")
    .then(function(allTimingsSnapshot){
        allTimingsSnapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            if (childSnapshot.hasChild("Feeding")){
                var feeding_exhibit_url = String(key) + "/Feeding/exhibit";
                var feeding_exhibit_ref = database.ref(feeding_exhibit_url);
                feeding_exhibit_ref.once("value")
                        .then(function(snapshot){                       // Need to change how the data is stored, save as individual object then into array
                            temp_feeding_list.push(key);
                            temp_feeding_list.push(snapshot.val());
                            feeding_list.push(temp_feeding_list);
                            temp_feeding_list = [];
                });
            }
            if (childSnapshot.hasChild("Show")){
                var show_exhibit_url = String(key) + "/Show/exhibit";
                var show_exhibit_ref = database.ref(show_exhibit_url);
                show_exhibit_ref.once("value")
                        .then(function(snapshot){                       // Need to change how the data is stored, save as individual object then into array
                            temp_show_list.push(key);
                            temp_show_list.push(snapshot.val());
                            show_list.push(temp_show_list);
                            temp_show_list = [];
                });
            }
        });
    });

// Search for next earliest possible feeding time
