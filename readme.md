##MediaStream Recorder for XSockets.NET using MediaRecorderAPI


This i just a  hint of how you use the Recorder.  See for an live example **Adding url later **


##Installation

Add the XSockets.MediaRecorder to your .html file

##API


###XSockets.MediaRecorder(stream:MediaStream,*options:object*): XSockets.MediaRecorder


    

    getUserMedia({
        audio: true,
        video: {
            mandatory: {
                maxWidth: 320,
                maxHeight: 240
            }
        }
    }, function (mediaStream) {

		var recorder = Sockets.MediaRecorder(stream:MediaStream); 

	}, function(ex) { })


####Options

To set the mimeType and other options for the recorder pass a object as the seconds argument

Default options are:

    { mimeType: "video/webm", ignoreMutedMedia: false }


## .start(maxTimeInMilliseconds: number) : void

Start the recorder. After `maxTimeInMilliseconds` is exceeds the recorder fires the on `oncompleted(blob:Blob,blobUrl: url)` event.

## .stop() : void

Stop recording


##Events

##oncompleted(blob:Blob,blobUrl);

When `maxTimeInMilliseconds` ( passed via .start  ) or the stop method is called this event will fire.


##Misc

###Sending a recorded mediaStream to XSockets.NET using a BinaryMessage

As the XSockets.NET WebSockets implementation for BinaryMessages needs a arrayBuffer we need to convert our blob, this is easily done by using a `FileReader`


    var blobToArrayBuffer = function (blob, fn) {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            fn.apply(this.result, [blob.size, blob.type]);
        };
        fileReader.readAsArrayBuffer(blob);
    };

   	videoRecorder.oncompleted = function(blob, url) {
		blobToArrayBuffer(function(size,type) {
			var arrayBuffer = this;
			// on your XSockets Controller do...
				yourController.invokeBinary("myMethod", arrayBuffer, {
					size: size, type:type
				});
		});		
	};
   
