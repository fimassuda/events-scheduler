var schedule = require('node-schedule');
var request = require('request');

function sendEvent () {
    getUnprocessedEvents();
}

var getUnprocessedEvents = function(){
    var eventsURL = process.env.EVENTS_URL; 

    request.get({
        url: eventsURL,
            json: true
        },
        function(error, response, events) {

            if (!error && response.statusCode == 200) {
                if (events.length > 0) {
                    
                    events.forEach(function(event){
                        request.post({
                                url: event.url,
                                json: true
                            }, function(error, res){
                                if (!error && res.statusCode == 200){
                                    console.log('ok to delete...');
                                    request.delete({
                                        url: eventsURL + '/' + event._id
                                    }, function(err, res){
                                        if (!err && res.statusCode == 204){
                                            console.log('Event Delivered');
                                        } else {
                                            console.error('Problem to delete the event');
                                        }
                                    })
                                } else {
                                    console.log('not ok to delete ...');
                                }
                        });
                    });
                } else {
                    console.log('There are no events to process');
                }
            } else {
                console.error(error);
            }
        }
    );
};

//Initialze the schedule
schedule.scheduleJob('0 * * * * *', sendEvent);

console.log('Schedule task to retry to send the event');