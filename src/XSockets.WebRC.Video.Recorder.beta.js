var XSockets = XSockets || {};
var sourceBuffer,mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
function handleSourceOpen(event) {
   
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
   
}
XSockets.MediaRecorder = (function () {
    var recorder = function (stream, options) {
        var self = this;
        this.options = options || { mimeType: "video/webm", ignoreMutedMedia: false };
        var mediaRecorder = new MediaRecorder(stream, this.options);
        var handleStop = function (event) {
            self.isRecording = false;
            var blob = new Blob(self.blobs, { type: self.options.mimeType });
            self.oncompleted.apply(self, [blob, URL.createObjectURL(blob)]);
        };
        var handleDataAvailable = function (event) {
            if (event.data && event.data.size > 0)
                self.blobs.push(event.data);
        };
        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        this.mediaRecorder = mediaRecorder;
    };
    recorder.prototype.oncompleted = function() {
    };

    recorder.prototype.stop = function()
    {
        var mediaRecorder = this.mediaRecorder;
        mediaRecorder.stop();
    }
    recorder.prototype.blobs = [];
    recorder.prototype.start = function (ms, stop) {
        this.blobs.length = 0;
        this.isRecording = true;
        var mediaRecorder = this.mediaRecorder;
        var timeOut = window.setTimeout(function () {
            console.log("max time to record exceeded");
            mediaRecorder.stop();
            window.clearTimeout(timeOut);
        }, stop || 3001);
        mediaRecorder.start(ms);
    };
    recorder.prototype.isRecording = false;

    return recorder;

})();
