const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const db = require("./db/db.json");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const id = 0;

// serve static files 
app.use(express.static(path.join(__dirname, './public')));


// ========== API ROUTES ==========

// showing notes
app.get("/api/notes", function (req, res) {
	res.sendFile(path.join(__dirname, './db/db.json'))
});

// adding a note
app.post("/api/notes", function (req, res) {

	let addedNote = JSON.stringify(req.body);

	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		if (err) throw err;

		let dataArray = JSON.parse(data);
		let lastNoteId = dataArray[dataArray.length - 1].id;

		if (lastNoteId === undefined ){
			lastNoteId = 0;
		}
		console.log("last note id", lastNoteId);

		let newId = lastNoteId + 1;
		console.log("new ID", newId);

		addedNote = '{' + `"id":${newId},` + addedNote.substr(1);
		let addedNoteJSON = JSON.parse(addedNote);
		console.log('addedNoteJSON', addedNoteJSON);
		
		console.log('dataArray', dataArray);
		dataArray.push(addedNoteJSON);
		console.log('updated dataArray', dataArray);

		let newDataString = JSON.stringify(dataArray);
		console.log(newDataString);

		fs.writeFile('./db/db.json', newDataString, function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
	});

	res.sendFile(path.join(__dirname, './db/db.json'));
});

app.delete('/api/notes/:id', function (req, res) {
	let deleteId = req.params.id;
	console.log(req.params.id);
	
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		let dataArray = JSON.parse(data);

		dataArray = dataArray.filter(function (note) {
			return note.id != deleteId;
		});

		let newDataString = JSON.stringify(dataArray);

		fs.writeFile('./db/db.json', newDataString, function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
	});

	res.sendFile(path.join(__dirname, './db/db.json'))
});


// ========== HTML ROUTES ==========

// get home page
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

// get notes page
app.get("/notes", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// (catch all other urls) get home page
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});


// ========== LISTEN ========== 

app.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}.`)
}); 