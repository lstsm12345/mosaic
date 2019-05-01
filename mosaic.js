// mosaic.js

const SERVER_RESOURCE       = '/cgi/mosaic.cgi';
const SERVER_RESPONSE_TYPE  = 'json';
const MAX_FILESIZE          = 4000000;

function bodyonload() {
	dragdroplisteners();
}

function send_post(str, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', SERVER_RESOURCE);
	xhr.responseType = SERVER_RESPONSE_TYPE;
	xhr.onload = callback;
	xhr.send(str);
}

function dragdroplisteners() {
	var droparea = document.getElementById('droparea');

	droparea.addEventListener('dragenter' , preventDefaults, false);
	droparea.addEventListener('dragleave' , preventDefaults, false);
	droparea.addEventListener('dragover'  , preventDefaults, false);
	droparea.addEventListener('drop'      , preventDefaults, false);

	droparea.addEventListener('dragenter' , droparea_on, false);
	droparea.addEventListener('dragover'  , droparea_on, false);

	droparea.addEventListener('dragleave' , droparea_off, false);
	droparea.addEventListener('drop'      , droparea_off, false);

	droparea.addEventListener('drop'      , handleDrop, false)
}

function preventDefaults(e) {
	e.preventDefault()
	e.stopPropagation()
}

function droparea_on() {
	document.getElementById('droparea').style.border = '2px dashed blue';
}

function droparea_off() {
	document.getElementById('droparea').style.border = 'none';
}

function handleDrop(e) {
	var files = e.dataTransfer.files
	// For each file...
	for (i = 0; i < files.length; i++) {
		var file = files[i]
		// Do nothing for too-big files
		if (file.size > MAX_FILESIZE)
			continue;
		var reader = new FileReader();
		// Read the file. The request is started when the file is finished
		// loading.
		reader.onloadend = dropfileaction;
		// The file will be loaded as base64 utf-8 string
		reader.readAsDataURL(file);
	}
}

function dropfileaction() {
	// The result is in base64 format
	// Strip the file type at the start ("data:image/png;base64,")
	var filestring = this.result.split(',')[1];
	var request = {length: this.result.length, file: filestring};
	var request_str = JSON.stringify(request);
	send_post(request_str, response_callback);
}

function response_callback(ev) {
	if (!(this.readyState === this.DONE && this.status === 200))
		return;

	if (this.response === null)
		return;

	// Take action after fully downloaded
	// The server response as a JSON object
	console.log(this.response.transform);
	console.log(this.response.w);
	console.log(this.response.h);

	b64png(this.response.transform, 'transform');
}

// Create a new img element from base64-encoded PNG file
function b64png(b64str, id) {
	var img = document.getElementById(id);
	if (img)
		img.src = 'data:image/png;base64,' + b64str;
}