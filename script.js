document.addEventListener('DOMContentLoaded', () => {
    const libraryForm = document.getElementById('libraryForm');
    const bookNameInput = document.getElementById('bookName');
    const authorInput = document.getElementById('author');
    const customerNameInput = document.getElementById('customerName');
    const tableBody = document.getElementById('tableBody');
    const messageDiv = document.getElementById('message');
    const countButton = document.getElementById('countButton');
    const historyButton = document.getElementById('historyButton');
    const customerHistoryButton = document.getElementById('customerHistoryButton');
    const authorHistoryButton = document.getElementById('authorHistoryButton'); // New button for author history
    const countHistory = document.getElementById('countHistory');
    const bookHistory = document.getElementById('bookHistory');
    const customerHistory = document.getElementById('customerHistory');
    const authorHistory = document.getElementById('authorHistory'); // New element for author history

    // Array to store book data, with each entry including a "removed" status
    const books = [];
    const authors = []; // Array to keep track of authors

    libraryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const bookName = bookNameInput.value;
        const author = authorInput.value;
        const customerName = customerNameInput.value;

        if (bookName && author && customerName) {
            const newBook = {
                bookName: bookName,
                author: author,
                customerName: customerName,
                removed: false  // Track if the book is removed
            };
            books.push(newBook);

            // Add author to the authors array if it's not already included
            if (!authors.includes(author)) {
                authors.push(author);
            }

            addBookToTable(newBook);

            // Clear form fields
            bookNameInput.value = '';
            authorInput.value = '';
            customerNameInput.value = '';

            // Display success message
            messageDiv.textContent = 'Book added successfully!';
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 2000);
        } else {
            // Display error message
            messageDiv.textContent = 'Please fill in all fields.';
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 2000);
        }
    });

    // Function to add a book to the table
    function addBookToTable(book) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.customerName}</td>
            <td><button class="remove-book">Remove</button></td>
        `;
        tableBody.appendChild(newRow);

        // Event listener to remove a book
        newRow.querySelector('.remove-book').addEventListener('click', () => {
            book.removed = true;  // Mark the book as removed in the array
            newRow.remove();

            // Remove the author from authors array if there are no more books by that author
            const authorBooks = books.filter(b => b.author === book.author && !b.removed);
            if (authorBooks.length === 0) {
                const authorIndex = authors.indexOf(book.author);
                if (authorIndex !== -1) {
                    authors.splice(authorIndex, 1);
                }
            }
        });
    }

    // Count Books
    countButton.addEventListener('click', () => {
        const activeBooks = books.filter(book => !book.removed).length;
        countHistory.textContent = `Total Books: ${activeBooks}`;
    });

    // Display Book History
    historyButton.addEventListener('click', () => {
        let historyString = '';
        books.forEach(book => {
            if (!book.removed) {
                historyString += `<p>${book.bookName} by ${book.author} issued to ${book.customerName}</p>`;
            }
        });
        bookHistory.innerHTML = historyString;
    });

    // Display Customer History (includes removed books)
    customerHistoryButton.addEventListener('click', () => {
        const customers = [...new Set(books.map(book => book.customerName))];
        let historyString = '';
        customers.forEach(customer => {
            historyString += `<p>${customer}</p>`;
        });
        customerHistory.innerHTML = historyString;
    });

    // Display Author History (current active authors)
    authorHistoryButton.addEventListener('click', () => {
        let historyString = '';
        authors.forEach(author => {
            historyString += `<p>${author}</p>`;
        });
        authorHistory.innerHTML = historyString;
    });
});
