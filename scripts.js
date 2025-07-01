const myLibrary = [];

function Book(title, author, pages, hasRead) {
    
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor")
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    this.id = crypto.randomUUID();
}

Book.prototype.toggleRead = function() {
    this.hasRead = !this.hasRead;
}

function addBookToLibrary(title, author, pages, hasRead) {
    const book = new Book(title, author, pages, hasRead);
    myLibrary.push(book);
    return book;
}

function removeBookById(id) {
    let x = myLibrary.findIndex(a => a.id === id);
    if (x !== -1) {
        myLibrary.splice(x, 1);
    }
}

function renderLibrary() {
    const libraryDiv = document.getElementById('library');
    libraryDiv.textContent = '';

    myLibrary.forEach(book => {
        // Card container
        const card = document.createElement('div');
        card.classList.add('book-card');

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('book-title');
        titleDiv.textContent = book.title;

        // Author
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('book-author');
        authorDiv.textContent = "by " + book.author

        // Pages
        const pagesDiv = document.createElement('div');
        pagesDiv.classList.add('book-pages');
        pagesDiv.textContent = book.pages + " pages"

        // Status
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('book-status');
        if (book.hasRead) {
            statusDiv.textContent = "Read";
            statusDiv.classList.add('status-read');
        } else {
            statusDiv.textContent = "Not read yet";
            statusDiv.classList.add('status-not-read');
        }

        // Action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('card-actions');

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            removeBookById(book.id);
            renderLibrary();
        });

        // Toggle read button
        const toggleStatusBtn = document.createElement('button');
        toggleStatusBtn.textContent = "Change read status";
        toggleStatusBtn.classList.add('toggle-status-btn');
        toggleStatusBtn.addEventListener('click', () => {
            book.toggleRead();
            renderLibrary();
        });

        actionsDiv.appendChild(deleteBtn);
        actionsDiv.appendChild(toggleStatusBtn);

        // Assemble
        card.appendChild(titleDiv);
        card.appendChild(authorDiv);
        card.appendChild(pagesDiv);
        card.appendChild(statusDiv);
        card.appendChild(actionsDiv);

        libraryDiv.appendChild(card);
    });
}

renderLibrary();

// Modal dialog 
document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('new-book-dialog');
    const newBookBtn = document.getElementById('new-book-btn');
    const form = document.getElementById('new-book-form');
    const cancelBtn = document.getElementById('cancel-btn');

    newBookBtn.addEventListener('click', () => dialog.showModal());
    cancelBtn.addEventListener('click', () => dialog.close());

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const author = formData.get('author').trim();
        const pages = parseInt(formData.get('pages'), 10);
        const hasRead = !!formData.get('hasRead');
        if (title && author && pages > 0) { 
            addBookToLibrary(title, author, pages, hasRead);
            renderLibrary();
            form.reset();
            dialog.close();
        }
    });

    // Example books
    addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, false);
    addBookToLibrary("1984", "George Orwell", 328, true);

    renderLibrary();
});