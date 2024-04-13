const form = document.querySelector('#formSubmit')
const countTotalNotes = document.getElementById('totalNotes')

/*function updateNotesCount() {
    const notesList = document.querySelectorAll('#bookList li')
    const notesCount = notesList.length
    countTotalNotes.textContent = `Total Notes: ${notesCount}`
}*/

function updateNotesCount() {
    const notesList = document.querySelectorAll('#bookList li');
    const notesCount = notesList.length;

    let displayedCount = 0; // Initialize displayed count

    // Loop through the notes list to count displayed items
    for (let i = 0; i < notesList.length; i++) {
        if (notesList[i].style.display !== 'none') {
            displayedCount++;
        }
    }
    countTotalNotes.textContent = `Total Notes: ${notesCount} | Showing: ${displayedCount}`;
}



const searchNotes = document.getElementById('searchNotes');
searchNotes.addEventListener('keyup', function(event) {
    const searchValue = this.value.toLowerCase();
    const notesList = document.querySelectorAll('#bookList li');

    for (let i = 0; i < notesList.length; i++) {
        const item = notesList[i];
        const title = item.querySelector('h2').textContent.toLowerCase();
        
        if (title.includes(searchValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
    updateNotesCount(); // Call the function to update total notes count
});



form.addEventListener('submit', function(event) {
    event.preventDefault()

    const noteTitle = event.target.noteTitle.value
    const noteDesc = event.target.noteDesc.value

    const obj = {
        noteTitle: noteTitle,
        noteDesc: noteDesc
    }

    const newObj = JSON.stringify(obj) 
    localStorage.setItem(noteTitle, newObj)

    axios
        .post("https://crudcrud.com/api/e8390f02230f4ce68204548067d2711b/NoteBook",obj)
        .then((response) => displayNotesOnScreen(response.data))
        .catch((error) => console.log(error))

    event.target.reset()
})

window.addEventListener('DOMContentLoaded', () => {
    axios
        .get("https://crudcrud.com/api/e8390f02230f4ce68204548067d2711b/NoteBook")
        .then((response) => {
            response.data.forEach((noteData) => {
                displayNotesOnScreen(noteData)
            });
        })
        .catch((error) => console.log(error))
})

function displayNotesOnScreen(obj) {
    const mainList = document.querySelector('#bookList');
    const list = document.createElement('li');

    const title = document.createElement('h2');
    title.textContent = obj.noteTitle;
    list.appendChild(title);
    
    const desc = document.createElement('p');
    desc.textContent = obj.noteDesc;
    list.appendChild(desc);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete Note';
    list.appendChild(deleteButton);

    mainList.appendChild(list);
    list.style.marginBottom = '20px';

    deleteButton.addEventListener('click', function(event) {
        list.remove(); 
        updateNotesCount()

        const noteId = obj._id; 
        axios
            .delete(`https://crudcrud.com/api/e8390f02230f4ce68204548067d2711b/NoteBook/${noteId}`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => console.log(error));
    });

    updateNotesCount()
}
