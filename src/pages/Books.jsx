import { useEffect, useState } from "react";
import api from "../services/api";
import "./Books.css";
import { useNavigate } from "react-router-dom";
function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        category: "",
        description: "",
        cover: "",
        quantity: 1
    });
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/edit-book/${id}`);
    };
    const handleDelete = async (id) => {
        try {
            await api.delete(`/books/${id}`);
            getBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };
    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = async () => {
        try {
            const response = await api.get("/books");
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "All",
        ...new Set(books.map((book) => book.category))
    ];

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    const handleChange = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        try {
            const book = {
                ...newBook,
                quantity: Number(newBook.quantity),
                available: Number(newBook.quantity)
            };

            const response = await api.post("/books", book);

            setBooks([...books, response.data]);

            setNewBook({
                title: "",
                author: "",
                category: "",
                description: "",
                cover: "",
                quantity: 1
            });

            setShowForm(false);

        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    if (loading) {
        return <h2>Loading books...</h2>;
    }

    return (
        <div>

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Books</h1>
                    <p>Manage your library books</p>
                </div>

                <button
                    className="add-button"
                    onClick={() => setShowForm(true)}
                >
                    + Add Book
                </button>
            </div>

            {/* Search + Filter */}
            <div className="filters">

                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

            </div>

            {/* Books */}
            <div className="books-grid">

                {filteredBooks.map((book) => (
                    <div className="book-card" key={book.id}>

                        <img
                            src={book.cover}
                            alt={book.title}
                        />

                        <div className="book-info">

                            <h2>{book.title}</h2>

                            <p>{book.author}</p>

                            <span>{book.category}</span>

                            <p>
                                Available: {book.available} / {book.quantity}
                            </p>

                            <div className="book-actions">
                                <button onClick={() => handleEdit(book.id)}>Edit</button>
                                <button onClick={() => handleDelete(book.id)}>Delete</button>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

            {/* Add Book Modal */}
            {showForm && (
                <div className="modal-overlay">

                    <div className="modal">

                        <h2>Add New Book</h2>

                        <form onSubmit={handleAddBook}>

                            <input
                                name="title"
                                placeholder="Book title"
                                value={newBook.title}
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="author"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="category"
                                placeholder="Category"
                                value={newBook.category}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="cover"
                                placeholder="Cover image URL"
                                value={newBook.cover}
                                onChange={handleChange}
                            />

                            <input
                                name="quantity"
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                value={newBook.quantity}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={newBook.description}
                                onChange={handleChange}
                            />

                            <div className="modal-actions">

                                <button type="submit">
                                    Add Book
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form >

                    </div >

                </div >
            )}

        </div >
    );
}

export default Books;
