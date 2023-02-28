import { createContext, useState, useCallback } from 'react'
import axios from 'axios'

const BooksContext = createContext()

function Provider({ children }) {
  const [books, setBooks] = useState([])

  // fetch the books from the local server
  const fetchBooks = useCallback(async () => {
    const response = await axios.get('http://localhost:3001/books')

    setBooks(response.data)
  }, [])

  // creates a new book
  const createBook = async (title) => {
    const response = await axios.post('http://localhost:3001/books', {
      title
    })

    const updatedBooks = [
      ...books,
      response.data
    ]

    setBooks(updatedBooks)
  }

  // delete the book with the given id
  const deleteBookById = async (id) => {
    await axios.delete(`http://localhost:3001/books/${id}`, {
      id: id
    })
    const updatedBooks = books.filter((book) => {
      return book.id !== id
    })

    setBooks(updatedBooks)
  }

  // edit the book with the given id
  const editBookById = async (id, newTitle) => {
    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle
    })

    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...books, ...response.data }
      }
      return book
    })

    setBooks(updatedBooks)
  }

  const valueToShare = {
    books,
    deleteBookById,
    editBookById,
    createBook,
    fetchBooks
  }

  return (
    <BooksContext.Provider value={valueToShare}>
      {children}
    </BooksContext.Provider>
  )
}

export { Provider }
export default BooksContext
