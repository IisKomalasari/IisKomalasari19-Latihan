/**
 * [
 *    {
 *      id: string | number,
 *      title: string,
 *      author: string,
 *      year: number,
 *      isComplete: boolean
 *    }
 * ]
 */

const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelfs';
const SAVED_EVENT = 'saved-bookshelfs';
const STORAGE_KEY = 'bookshelfs_APPS';

function generateId() {
  return +new Date();
}

// Fungsi untuk menambahkan data buku baru
function menambahBuku(id, title, author, year, isComplete) {
  const newBooks = {
    id: +new Date(),
    title: title,
    author: author,
    year: Number(year),
    isComplete: isComplete,
  };

  bookshelfs.push(newBooks);
}

menambahBuku( 34, "Harry Potter and the Philosopher\'s Stone", "J.K Rowling", 1997, false);
// Tampilkan isi bookshelf setelah menambahkan buku
console.log(bookshelfs);


function generateBookshelfObject(id, title, author, year, isComplete) {
  return {
    id: +new Date(),
    title: title,
    author: author,
    year: Number(year),
    isComplete: isComplete
  };
}


function findBookshelf(BookshelfId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === BookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookshelfIndex(BookshelfId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === BookshelfId) {
      return index;
    }
  }
  return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
 function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see bookshelfs}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBookshelf(BookshelfObject) {

  const {id, title, author, year, isComplete} = BookshelfObject;

  const NoId = document.createElement('h5');
  NoId.innerText = id;

  const textTitle = document.createElement('p');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textyear = document.createElement('p');
  textyear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(NoId, textTitle, textAuthor, textyear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `bookshelf-${id}`);

  if (isComplete) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromComplete(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
        //pop-up konfirmasi 
        const konfirmasi = confirm("Apakah kamu yakin ingin menghapus?");
        if (konfirmasi) {
            removeTaskFromComplete(id);
        }
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToComplete(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
        //pop-up konfirmasi 
        const konfirmasi = confirm("Apakah kamu yakin ingin menghapus?");
        if (konfirmasi) {
            removeTaskFromComplete(id);
        }
    });

    container.append(checkButton, trashButton); 
  }

  return container;
}

function addBookshelf() {
  const   NoId = document.getElementById("id").value;
  const textTitle = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const textyear = document.getElementById('Year').value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const BookshelfObject = generateBookshelfObject( NoId, textTitle, textAuthor, textyear, isComplete, false);
  bookshelfs.push(BookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}


function addTaskToComplete(BookshelfId /* HTMLELement */) {
  const BookshelfTarget = findBookshelf(BookshelfId);

  if (BookshelfTarget == null) return;

  BookshelfTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromComplete(BookshelfId /* HTMLELement */) {
  const BookshelfTarget = findBookshelfIndex(BookshelfId);

  if (BookshelfTarget === -1) return;

  bookshelfs.splice(BookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromComplete(BookshelfId /* HTMLELement */) {

  const BookshelfTarget = findBookshelf(BookshelfId);
  if (BookshelfTarget == null) return;

  BookshelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBookshelf();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});



document.addEventListener(RENDER_EVENT, function () {
  const uncompletebookshelfList = document.getElementById('bookshelfs');
  const listComplete = document.getElementById('complete-bookshelfs');

  // clearing list item
  uncompletebookshelfList.innerHTML = '';
  listComplete.innerHTML = '';

  for (const BookshelfItem of bookshelfs) {
    const BookshelfElement = makeBookshelf(BookshelfItem);
    if (BookshelfItem.isComplete) {
      listComplete.append(BookshelfElement);
    } else {
      uncompletebookshelfList.append(BookshelfElement);
    }
  }
});
