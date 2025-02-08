const xIcon = document.querySelector('.xIcon');
const newFolderPopUp = document.querySelector('.newFolderPopUp');
const newFolderButton = document.querySelector('.newFolder');
const newFolderErrorText = document.querySelector('.newFolderErrorText');
const newFilePopUp = document.querySelector('.newFilePopUp');
const newFileButton = document.querySelector('.newFile');
const newFileCloseButton = document.querySelector('.newFileXIcon');
const fileInput = document.querySelector('.newFileInput');
const fileNameSpan = document.querySelector('.fileNameSpan');

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