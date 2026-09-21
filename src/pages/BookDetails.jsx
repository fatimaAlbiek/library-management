import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

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
                    <h1>Book Details</h1>
                    <p>View book information</p>
                </div>

                <button onClick={() => navigate("/books")}>
                    ← Back to Books
                </button>
            </div>

            <div className="book-details">

                <img
                    src={book.cover}
                    alt={book.title}
                />

                <div className="book-details-info">

                    <h2>{book.title}</h2>

                    <p>
                        <strong>Author:</strong> {book.author}
                    </p>

                    <p>
                        <strong>Category:</strong> {book.category}
                    </p>

                    <p>
                        <strong>Description:</strong>
                    </p>

                    <p>{book.description}</p>

                    <p>
                        <strong>Available:</strong>{" "}
                        {book.available} / {book.quantity}
                    </p>

                    <div className="book-actions">

                        <button
                            onClick={() =>
                                navigate(`/edit-book/${book.id}`)
                            }
                        >
                            Edit Book
                        </button>

                        <button
                            onClick={() => navigate("/books")}
                        >
                            Back
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BookDetails;

