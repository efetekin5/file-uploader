const xIcon = document.getElementById('xIcon');
const newFolderPopUp = document.getElementById('newFolderPopUp');
const newFolderButton = document.getElementById('newFolder');
const newFolderErrorText = document.getElementById('newFolderErrorText');
const newFilePopUp = document.getElementById('newFilePopUp');
const newFileButton = document.getElementById('newFile');
const newFileCloseButton = document.getElementById('newFileXIcon');
const fileInput = document.getElementById('newFileInput');
const fileNameSpan = document.getElementById('fileNameSpan');

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

function openFileUploadForm() {
    newFilePopUp.classList.add('display');
}

function closeFileUploadForm() {
    newFilePopUp.classList.remove('display');
}

function displayFileName() {
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
    fileNameSpan.textContent = fileName;
}

document.addEventListener('DOMContentLoaded', function() {
    displayFileName();
});

xIcon.addEventListener('click', closeNewFolderForm);
newFolderButton.addEventListener('click', openNewFolderForm);
newFileButton.addEventListener('click', openFileUploadForm);
newFileCloseButton.addEventListener('click', closeFileUploadForm);
fileInput.addEventListener('change', displayFileName);