// mosaic.js

const SERVER_RESOURCE       = '/cgi/mosaic.cgi';
const SERVER_RESPONSE_TYPE  = 'json';
const MAX_FILESIZE          = 4000000;

var tiles128 = ' ';
var tiles64  = ' ';
var tiles32  = ' ';
var tiles16  = ' ';
var tiles8   = ' ';

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

	// Handle only one input file
	var file = files[0]
	// Do nothing for too-big files
	if (file.size > MAX_FILESIZE)
		return;
	var reader = new FileReader();
	// Read the file. The request is started when the file is finished
	// loading.
	reader.onloadend = dropfileaction;
	// The file will be loaded as base64 utf-8 string
	reader.readAsDataURL(file);
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

	tiles128 = 'data:image/png;base64,' + this.response.tiles128;
	tiles64 = 'data:image/png;base64,' + this.response.tiles64;
	tiles32 = 'data:image/png;base64,' + this.response.tiles32;
	tiles16 = 'data:image/png;base64,' + this.response.tiles16;
	tiles8 = 'data:image/png;base64,' + this.response.tiles8;
}

function show128() {
	document.getElementById('tiles').src = tiles128;
}
function show64() {
	document.getElementById('tiles').src = tiles64;
}
function show32() {
	document.getElementById('tiles').src = tiles32;
}
function show16() {
	document.getElementById('tiles').src = tiles16;
}
function show8() {
	document.getElementById('tiles').src = tiles8;
}
