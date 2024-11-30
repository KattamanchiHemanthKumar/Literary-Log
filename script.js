document.addEventListener('DOMContentLoaded', () => {
    const libraryForm = document.getElementById('libraryForm');
    const tableBody = document.getElementById('tableBody');
    const messageDiv = document.getElementById('message');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');

    let books = JSON.parse(localStorage.getItem('books')) || [];
    
    function updateStats() {
        const activeBooks = books.filter(book => !book.returned);
        const uniqueAuthors = [...new Set(books.map(book => book.author))];
        const uniqueCustomers = [...new Set(books.filter(book => !book.returned).map(book => book.customerName))];

        document.getElementById('totalBooks').textContent = activeBooks.length;
        document.getElementById('totalAuthors').textContent = uniqueAuthors.length;
        document.getElementById('totalCustomers').textContent = uniqueCustomers.length;
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    function calculateDaysIssued(issueDate) {
        const difference = new Date().getTime() - new Date(issueDate).getTime();
        return Math.ceil(difference / (1000 * 3600 * 24));
    }

    function addBookToTable(book) {
        const daysIssued = calculateDaysIssued(book.issueDate);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.customerName}</td>
            <td>${new Date(book.issueDate).toLocaleDateString()}</td>
            <td>${daysIssued} days</td>
            <td>
                <button class="btn btn-danger btn-sm return-book">Return</button>
            </td>
        `;

        if (daysIssued > 14) {
            row.style.backgroundColor = '#fff3cd';
        }

        row.querySelector('.return-book').addEventListener('click', () => {
            book.returned = true;
            row.remove();
            localStorage.setItem('books', JSON.stringify(books));
            updateStats();
            showMessage('Book returned successfully!', 'success');
        });

        tableBody.appendChild(row);
    }

    function filterAndDisplayBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterType.value;
        
        tableBody.innerHTML = '';
        
        let filteredBooks = books.filter(book => !book.returned);

        if (filterValue === 'overdue') {
            filteredBooks = filteredBooks.filter(book => 
                calculateDaysIssued(book.issueDate) > 14
            );
        } else if (filterValue === 'recent') {
            filteredBooks = filteredBooks.filter(book => 
                calculateDaysIssued(book.issueDate) <= 7
            );
        }

        if (searchTerm) {
            filteredBooks = filteredBooks.filter(book =>
                book.bookName.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.customerName.toLowerCase().includes(searchTerm)
            );
        }

        filteredBooks.forEach(addBookToTable);
    }

    libraryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newBook = {
            bookName: document.getElementById('bookName').value,
            author: document.getElementById('author').value,
            customerName: document.getElementById('customerName').value,
            issueDate: document.getElementById('issueDate').value,
            returned: false
        };

        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        
        addBookToTable(newBook);
        updateStats();
        
        libraryForm.reset();
        showMessage('Book added successfully!', 'success');
    });

    searchInput.addEventListener('input', filterAndDisplayBooks);
    filterType.addEventListener('change', filterAndDisplayBooks);

    // Initial load
    books.filter(book => !book.returned).forEach(addBookToTable);
    updateStats();
});