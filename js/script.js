const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

document.addEventListener(RENDER_EVENT, () =>{
    const unFinishBook = document.getElementById('belumBaca');
    unFinishBook.innerHTML = "";

    const FinishBook = document.getElementById('sudahBaca');
    FinishBook.innerHTML = "";

    for (const bookItem of books) {
        const booksElement = makeBookElement(bookItem);
        if(!bookItem.isComplete) {
            unFinishBook.append(booksElement);
        } else{
            FinishBook.append(booksElement);
        }
    }
});

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung Web Storage");
    return false;  
  }
  return true;
};

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};
const saveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
};
  
const moveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(MOVED_EVENT));
    }
};
  
const deleteData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(DELETED_EVENT));
    }
};

const addBook = () => {
    const bookTitle = document.getElementById("judulBuku");
    const bookAuthor = document.getElementById("penulisBuku");
    const bookYear = document.getElementById("tahunBuku");
    const bookFinished = document.getElementById("isRead");
    let bookStatus;
    if (bookFinished.checked) {
      bookStatus = true;
    } else {
      bookStatus = false;
    }
  
    books.push({
      id: +new Date(),
      title: bookTitle.value,
      author: bookAuthor.value,
      year: Number(bookYear.value),
      isComplete: bookStatus,
    });
  
    bookTitle.value = null;
    bookAuthor.value = null;
    bookYear.value = null;
    bookFinished.checked = false;
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const makeBookElement = (bookObject) => {
    const elementBookTitle = document.createElement("p");
    elementBookTitle.classList.add("item-title");
    elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;
  
    const elementBookAuthor = document.createElement("p");
    elementBookAuthor.classList.add("item-writer");
    elementBookAuthor.innerText = bookObject.author;
  
    const descContainer = document.createElement("div");
    descContainer.classList.add("item-desc");
    descContainer.append(elementBookTitle, elementBookAuthor);
  
    const actionContainer = document.createElement("div");
    actionContainer.classList.add("item-action");
  
    const container = document.createElement("div");
    container.classList.add("item");
    container.append(descContainer);
    container.setAttribute("id", `book-${bookObject.id}`);
  
    if (bookObject.isComplete) {
      const returnBtn = document.createElement("button");
      returnBtn.classList.add("kembalikan-btn");
  
      returnBtn.addEventListener("click", () => {
        returnBookFromFinished(bookObject.id);
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("hapus-btn");
  
      deleteBtn.addEventListener("click", () => {
        deleteBook(bookObject.id);
      });
  
      actionContainer.append(returnBtn, deleteBtn);
      container.append(actionContainer);
    } else {
      const finishBtn = document.createElement("button");
      finishBtn.classList.add("selesai-btn");
  
      finishBtn.addEventListener("click", () => {
        addBookToFinished(bookObject.id);
      });
  
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("hapus-btn");
  
      deleteBtn.addEventListener("click", () => {
        deleteBook(bookObject.id);
      });
  
      actionContainer.append(finishBtn, deleteBtn);
      container.append(actionContainer);
    }
  
    return container;
};
  
const addBookToFinished = (bookId) => {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};
  
const returnBookFromFinished = (bookId) => {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};
  
const deleteBook = (bookId) => {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
};
  
const findBook = (bookId) => {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
  
    return null;
};
  
const findBookIndex = (bookId) => {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
  
    return -1;
};
  
document.addEventListener("DOMContentLoaded", () => {
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  
    const simpanForm = document.getElementById("formInputBuku");
    simpanForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addBook();
    });
  
    const searchForm = document.getElementById("formCariBuku");
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchBook();
    });
  
});
  
const searchBook = () => {
    const searchInput = document.getElementById("cariBuku").value.toLowerCase();
    const bookItems = document.getElementsByClassName("item");
  
    for (let i = 0; i < bookItems.length; i++) {
      const itemTitle = bookItems[i].querySelector(".item-title");
      if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
        bookItems[i].classList.remove("hidden");
      } else {
        bookItems[i].classList.add("hidden");
      }
    }
  };
