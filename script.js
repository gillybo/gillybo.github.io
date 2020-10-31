var session = null;
var jsonData = null;
$( document ).ready(function(){
        $.getJSON("config.json", function(data){
                jsonData = data;
                console.log(data.id); // Prints: Harry
                $.each(data, function(key, value) {
                        $('#id_select')
                             .append($('<option>', { value : key })
                             .text(value.id));
                   });
            }).fail(function(){
                console.log("An error has occurred.");
            });

        var loadCastInterval = setInterval(function(){
                if (chrome.cast.isAvailable) {
                        console.log('Cast has loaded.');
                        clearInterval(loadCastInterval);
                        initializeCastApi();
                } else {
                        console.log('Unavailable');
                }
        }, 1000);

        $('#castme').click(function(){
                launchApp();
        });
        $('#id_loadPlayer').click(function(){
                console.log("load player clicked");
                var videoPlayer = $("#id_player").get(0);
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
                var selectedValue = $( "#id_select option:selected" ).text();
                console.log(selectedValue);
                jsonData.forEach(item => {
                        if(item.id == selectedValue){
                                //debugger;
                                setTimeout(function() {  
                                        $("#id_player").html('<source src="'+item.source+'" type="video/mp4"></source>' );
                                        videoPlayer.load();
                                        videoPlayer.play();
                                }, 3000);
                                
                                
                        }
                });
                //$("#id_player").html('<source src="mkv" type="video/mp4"></source>' );
        });
});

function initializeCastApi() {
        var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        var sessionRequest = new chrome.cast.SessionRequest(applicationID);
        var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                sessionListener,
                receiverListener);
        chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
};

function sessionListener(e) {
        session = e;
        console.log('New session');
        if (session.media.length != 0) {
                console.log('Found ' + session.media.length + ' sessions.');
        }
}
 
function receiverListener(e) {
        if( e === 'available' ) {
                console.log("Chromecast was found on the network.");
        }
        else {
                console.log("There are no Chromecasts available.");
        }
}

function onInitSuccess() {
        console.log("Initialization succeeded");
}

function onInitError() {
        console.log("Initialization failed");
}


function launchApp() {
        console.log("Launching the Chromecast App...");
        chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
        console.log("Successfully created session: " + e.sessionId);
        session = e;
}

function onLaunchError() {
        console.log("Error connecting to the Chromecast.");
}

function onRequestSessionSuccess(e) {
        console.log("Successfully created session: " + e.sessionId);
        session = e;
        loadMedia();
}

function loadMedia() {
        if (!session) {
                console.log("No session.");
                return;
        }

        var mediaInfo = new
chrome.cast.media.MediaInfo('https://nyk1.download.real-debrid.com/d/WNP35LYKMJBIK42/www.1TamilMV.win%20-%20BIGG%20BOSS%20%28Tamil%29%20S04%20EP-26%20DAY-25%20UNSEEN%20-%201080p%20-%20AVC%20-%20AAC%20-%201GB.mkv');
        mediaInfo.contentType = 'video/mp4';
  
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;

        session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
        console.log('Successfully loaded image.');
}

function onLoadError() {
        console.log('Failed to load image.');
}

$('#stop').click(function(){
        stopApp();
});

function stopApp() {
        session.stop(onStopAppSuccess, onStopAppError);
}

function onStopAppSuccess() {
        console.log('Successfully stopped app.');
}

function onStopAppError() {
        console.log('Error stopping app.');
}