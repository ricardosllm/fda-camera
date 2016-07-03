define(["jquery","aws", "app/config", "timersjs"],function($,a,c){

  var imgList = [];
  var timeinterval;
  var timerCountDown;
  var timerSnap;

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var createImgFileName = function(cameraId){
    var d1 = new Date();

    var curr_year = d1.getFullYear();

    var curr_month = d1.getMonth() + 1; //Months are zero based
    if (curr_month < 10)
      curr_month = "0" + curr_month;

    var curr_date = d1.getDate();
    if (curr_date < 10)
      curr_date = "0" + curr_date;

    var curr_hour = d1.getHours();
    if (curr_hour < 10)
      curr_hour = "0" + curr_hour;

    var curr_min = d1.getMinutes();
    if (curr_min < 10)
      curr_min = "0" + curr_min;

    var curr_sec = d1.getSeconds();
    if (curr_sec < 10)
      curr_sec = "0" + curr_sec;

    var newtimestamp =
          curr_sec   + "-" +
          curr_min   + "-" +
          curr_hour  + "-" +
          curr_date  + "-" +
          curr_month + "-" +
          curr_year  + "-" +
          cameraId   + ".png";

    return newtimestamp;
  };

  var dataURItoBlob = function (dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  };

  var getCameraId = function (){
    //console.log(queryStrings);
    //console.log(getParameterByName("cameraId"));
    var cameraId = getParameterByName("cameraid")!="" ? getParameterByName("cameraid") : c.defaultCameraId;
    return cameraId;
  };

  var isRecording = function(){
    return !($( "#btnSnap" ).hasClass("active"));
  };

  var startCountDown = function (){
    $("#lblCounter").text(Math.floor(c.durationBtwSnap/1000));

    if(!timerCountDown)
      initTimerCountDown();
    else
      timerCountDown.restart();
  };

  var stopCountDown = function (){
    $("#lblCounter").text("");
    if(timerCountDown)
      timerCountDown.pause();
  };

  function initTimerCountDown(){
    timerCountDown = TimersJS.timer(1000, function() {
      $("#lblCounter").text(parseInt($("#lblCounter").text())-1);
      this.restart();
    });
  }

  var startSnap = function (){
    if(!timerSnap)
      initTimerSnap();
    else
      timerSnap.restart();
  };

  var stopSnap = function (){
    if(timerSnap)
      timerSnap.pause();
  };

  function initTimerSnap(){
    $("#lblCounter").text(Math.floor(c.durationBtwSnap/1000));

    timerSnap = TimersJS.timer(c.durationBtwSnap, function() {
      //readMessageFromAWS
      stopCountDown();
      uploadImgToS3();
      this.restart();
      startCountDown();;
    });
  }

  var uploadImgToS3 = function (){
    $('#divFlash').show().animate({opacity: 0.5}, 300).fadeOut(300).css({'opacity': 1});

    var sqsQueryUrl     = c.AWS.sqsQueryUrl;
    var cameraId        = getCameraId();
    var durationBtwSnap = c.durationBtwSnap;

    AWS.config.region   = c.AWS.region;
    AWS.config.credentials =
      new AWS.CognitoIdentityCredentials({ IdentityPoolId: c.AWS.identityPoolId });

    var fileName = createImgFileName(cameraId);
    var folder   = "input";

    console.log(fileName);
    console.log("btnSnap_Click");
    var canvas   = document.getElementById("canvas"),
        context  = canvas.getContext("2d"),
        video    = document.getElementById("video"),
        videoObj = { "video": true },
        errBack  = function(error) {
          console.log("Video capture error: ", error.code); 
        };

    context.drawImage(video, 0, 0, 640, 480);

    var dataURL = canvas.toDataURL();
    //dataURL = dataURL.replace(/^data:image\/png;base64,/, '');
    var blob = dataURItoBlob(dataURL);

    console.log("uploadfile: " + fileName);
    // console.log(dataURL);
    var metaData = { cameraId:cameraId};

    var params = {
      Key:         folder + "/" + fileName,
      Body:        blob,
      ACL:         "public-read",
      ContentType: "image/png",
      Metadata:    { cameraId:cameraId}
    };

    var bucket = new AWS.S3({params: {Bucket: c.AWS.s3Bucket}, signatureVersion: 'v4'});
    console.log(params);
    console.log(fileName);
    // console.log(dataURL);

    bucket.upload(params, function (err, data) {
      debugger;
      console.log(err ? 'ERROR!' : 'SAVED.');
      console.log(err);
      if(!err)
      {
        var linksContainer = $('#imgContainer');
        var imgUrl = data.Location;
        // console.log(data);
        imgList.push({cameraId:cameraId, url:data.Location});
        console.log(imgList);
        if($('.imgSnap') && $('.imgSnap').size() >= 3)
          $('.imgSnap').first().remove();

        $('<img class="imgSnap">').prop('src', imgUrl).appendTo($('#imgContainer'));
        $("#imgCounter").text(parseInt($("#imgCounter").text())+1);
      }
    });
  }

  var core = {
    createImgFileName : createImgFileName,
    dataURItoBlob : dataURItoBlob,
    uploadImgToS3 : uploadImgToS3,
    getCameraId : getCameraId,
    startSnap : startSnap,
    stopSnap : stopSnap,
    startCountDown : startCountDown,
    stopCountDown : stopCountDown
  };

  return core;
});
