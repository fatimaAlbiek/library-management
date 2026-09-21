
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);

                console.log("Book:", response.data);

                setBook(response.data);

            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setBook((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();

        try {
            const updatedBook = {
                ...book,
                quantity: Number(book.quantity),
                available: Number(book.available)
            };

            console.log("Updating:", updatedBook);

            await api.put(`/books/${id}`, updatedBook);

            alert("Book updated successfully!");

            navigate("/books");

        } catch (error) {
            console.error("Error updating book:", error);
            alert("Failed to update book.");
        }
    };

    if (loading) {
        return <h2>Loading book...</h2>;
    }

    if (!book) {
        return <h2>Book not found</h2>;
    }

    return (
        <div>

            <div className="page-header">
                <div>
                    <h1>Edit Book</h1>
                    <p>Update book information</p>
                </div>
            </div>

            <div className="modal">

                <form onSubmit={handleUpdateBook}>

                    <input
                        name="title"
                        placeholder="Book title"
                        value={book.title || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="author"
                        placeholder="Author"
                        value={book.author || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={book.category || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="cover"
                        placeholder="Cover image URL"
                        value={book.cover || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="quantity"
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={book.quantity || ""}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={book.description || ""}
                        onChange={handleChange}
                    />

                    <div className="modal-actions">

                        <button type="submit">
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/books")}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditBook;
