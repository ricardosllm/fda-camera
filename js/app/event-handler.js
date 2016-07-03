define(["jquery","aws", "app/config","app/core"],function($,a,c,core){
	console.log("event-handler");

  var timeinterval;

	var documentReady = function(){
		var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
          console.log("Video capture error: ", error.code);
        };

      // Put video listeners into place
      if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
          video.src = stream;
          video.play();
        }, errBack);
      } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
        }, errBack);
      } else if(navigator.mozGetUserMedia) { // WebKit-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
          video.src = window.URL.createObjectURL(stream);
          video.play();
        }, errBack);
      }
      console.log(core.getCameraId());

      $("#lblCamId").text("Id : " + core.getCameraId());
      $("#lblCamName").text(core.getCameraName());

      console.log("c.durationBtwSnap:" + c.durationBtwSnap);
  };

	var btnSnap_Click = function(){

		$( "#btnSnap" ).toggleClass( "active" );
    $( "#btnSnap" ).toggleClass("btn-success");
    $( "#btnSnap" ).toggleClass("btn-danger");
    $( "#btnSnap" ).text( $( "#btnSnap" ).hasClass("active")? $( "#btnSnap" ).attr("label-active"):$( "#btnSnap" ).attr("label-inactive") );
		//$("#video").fadeOut("fast").delay(25).fadeIn("fast");
		/*$('#divFlash').show().animate({opacity: 0.5}, 300).fadeOut(300).css({'opacity': 1});*/
    var isActive = !$( "#btnSnap" ).hasClass("active");
    if(!isActive)
    {
      core.startSnap();
      core.startCountDown();
    }else
    {
      core.stopSnap();
      core.stopCountDown();
    }
  };
    $("#btnSnap").bind("click",btnSnap_Click);

    $(document).ready(documentReady);
});
