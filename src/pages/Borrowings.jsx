import { useEffect, useState } from "react";
import api from "../services/api";

function Borrowings() {
    const [borrowings, setBorrowings] = useState([]);
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    const displayedBorrowings = showHistory ? borrowings.filter((borrowing) => borrowing.status === "returned") : borrowings.filter((borrowing) => borrowing.status === "borrowed");
    const [newBorrowing, setNewBorrowing] = useState({
        bookId: "",
        memberId: "",
        dueDate: ""
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [borrowingsResponse, booksResponse] = await Promise.all([
                    api.get("/borrowings"),
                    api.get("/books")
                ]);
                setBorrowings(borrowingsResponse.data);
                setBooks(booksResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewBorrowing((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleBorrowBook = async (e) => {
        e.preventDefault();

        try {
            const selectedBook = books.find(
                (book) => String(book.id) === String(newBorrowing.bookId)
            );
            if (!selectedBook) {
                alert("Please select a book.");
                return;
            }
            if (selectedBook.available <= 0) {
                alert("This book is not available for borrowing.");
                return;
            }
            const borrowing = {
                bookId: newBorrowing.bookId,
                memberId: newBorrowing.memberId,
                borrowDate: new Date().toISOString().split("T")[0],
                dueDate: newBorrowing.dueDate,
                returnDate: null,
                status: "borrowed"
            };
            const borrowingResponse =
                await api.post("/borrowings", borrowing);
            const updatedBook = {
                ...selectedBook,
                available: Number(selectedBook.available) - 1
            };

            await api.put(`/books/${selectedBook.id}`, updatedBook);
            console.log("Updated book")
            setBorrowings((prevBorrowings) => [...prevBorrowings, borrowingResponse.data]);
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === selectedBook.id
                        ? { ...book, available: book.available - 1 }
                        : book
                )
            );
            setNewBorrowing({
                bookId: "",
                memberId: "",
                dueDate: ""
            });
            setShowForm(false);
            alert("Book borrowed successfully.");
        } catch (error) {
            console.error("Borrow error:", error);
            console.error("Response:", error.response?.data);
            console.error("Status:", error.response?.status);

            alert(
                error.response?.data
                    ? JSON.stringify(error.response.data)
                    : "Failed to borrow book."
            );
        }
    };
    if (loading) {
        return <h2>Loading borrowings...</h2>;
    }
    const handleReturnBook = async (borrowing) => {
        try {
            const book = books.find(
                (book) => String(book.id) === String(borrowing.bookId)
            );

            if (!book) {
                alert("Book not found.");
                return;
            }

            const updatedBorrowing = {
                ...borrowing,
                status: "returned",
                returnDate: new Date().toISOString().split("T")[0]
            };

            await api.put(
                `/borrowings/${borrowing.id}`,
                updatedBorrowing
            );

            const updatedBook = {
                ...book,
                available: Number(book.available) + 1
            };

            await api.put(
                `/books/${book.id}`,
                updatedBook
            );

            setBorrowings((prev) =>
                prev.map((item) =>
                    String(item.id) === String(borrowing.id)
                        ? updatedBorrowing
                        : item
                )
            );

            setBooks((prev) =>
                prev.map((item) =>
                    String(item.id) === String(book.id)
                        ? updatedBook
                        : item
                )
            );

            alert("Book returned successfully!");

        } catch (error) {
            console.error("Error returning book:", error);
            alert("Failed to return book.");
        }
    };

    const getBorrowingStatus = (borrowing) => {
        if (borrowing.status === "returned") {
            return "Returned";
        }
        const today = new Date().toISOString().split("T")[0];
        if (borrowing.dueDate < today) {
            return "Overdue";
        }
        return "Borrowed";
    };

    return (
        <div className="borrowings-page">
            <div className="borrowings-header">
                <div>
                    <h1>Borrowings</h1>
                    <p>Manage book borrowing and returns</p>
                </div>

                <div className="borrowings-actions">
                    <button
                        className="add-borrowing-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Borrowing
                    </button>

                    <button
                        className="history-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "Current Borrowings" : "Borrowing History"}
                    </button>
                </div>
            </div>
            {showForm && (
                <div className="borrownige-actions">
                    <form onSubmit={handleBorrowBook}>

                        <h2>Borrow Book</h2>

                        <select
                            name="bookId"
                            value={newBorrowing.bookId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a book</option>

                            {books
                                .filter((book) => book.available > 0)
                                .map((book) => (
                                    <option key={book.id} value={book.id}>
                                        {book.title} ({book.available} available)
                                    </option>
                                ))}
                        </select>

                        <input
                            type="text"
                            name="memberId"
                            placeholder="Member ID"
                            value={newBorrowing.memberId}
                            onChange={handleChange}
                            required
                        />

                        <label>Due Date</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={newBorrowing.dueDate}
                            onChange={handleChange}
                            required
                        />

                        <div className="modal-actions">
                            <button type="submit">
                                Borrow
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            )}
            {displayedBorrowings.length === 0 ? (
                <div>
                    <h3>No borrowings yet</h3>
                    <p>There are no borrowed books at the moment.</p>
                </div>
            ) : (
                <div className="borrowings-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Member</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayedBorrowings.map((borrowing) => (
                                <tr key={borrowing.id}>
                                    <td>{books.find((book) => String(book.id) === String(borrowing.bookId))?.title || "Unknown Book"}</td>
                                    <td>{borrowing.memberId}</td>
                                    <td>{borrowing.borrowDate}</td>
                                    <td>{borrowing.dueDate}</td>
                                    <td>
                                        <span
                                            className={`borrowing-status ${getBorrowingStatus(borrowing) === "Overdue"
                                                ? "status-overdue"
                                                : getBorrowingStatus(borrowing) === "Returned"
                                                    ? "status-returned"
                                                    : "status-borrowed"
                                                }`}
                                        >
                                            {getBorrowingStatus(borrowing)}
                                        </span>
                                    </td>


                                    <td>
                                        {borrowing.status === "borrowed" && (
                                            <button className="return-btn" onClick={() => handleReturnBook(borrowing)}>
                                                Return
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
}

export default Borrowings;