const xIcon = document.getElementById('xIcon');
const newFolderPopUp = document.getElementById('newFolderPopUp');
const newFolderButton = document.getElementById('newFolder');
const newFolderErrorText = document.getElementById('newFolderErrorText');

function closeNewFolderForm() {
    newFolderPopUp.classList.remove('display');
}

function openNewFolderForm() {
    newFolderPopUp.classList.add('display');
}

document.addEventListener('DOMContentLoaded', function() {
    if (newFolderErrorText) {
        openNewFolderForm();
    }
});

xIcon.addEventListener('click', closeNewFolderForm);
newFolderButton.addEventListener('click', openNewFolderForm);