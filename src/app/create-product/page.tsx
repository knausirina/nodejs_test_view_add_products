"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductsStore } from "@/store/productStore";

export default function CreateProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [authors, setAuthors] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const productsStore = useProductsStore.getState();

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!title.trim()) e.title = "Title is required";
    if (!isbn.trim()) e.isbn = "ISBN is required";
    const p = Number(pageCount);
    if (isNaN(p) || p <= 0) e.pageCount = "pageCount must be a number greater than 0";
    
    const emptyAuthors = authors.filter(a => !a.trim());
    if (emptyAuthors.length > 0) e.authors = `${emptyAuthors.length} author field(s) are empty`;
    
    const trimmedAuthors = authors.map(a => a.trim()).filter(a => a);
    if (trimmedAuthors.length === 0) e.authors = "At least one author is required";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const trimmedAuthors = authors.map(a => a.trim()).filter(a => a);
      productsStore.addProduct({
        title: title.trim(),
        isbn: isbn.trim(),
        pageCount: Number(pageCount),
        authors: trimmedAuthors,
      });
      router.push("/");
    } catch (err) {
      console.error("Error adding product", err);
      setErrors({ form: "Failed to add product" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Create product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {errors.form && <div className="text-red-600">{errors.form}</div>}
        <div>
          <label className="block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2"
          />
          {errors.title && (
            <div className="text-red-600 mt-1">{errors.title}</div>
          )}
        </div>

        <div>
          <label className="block mb-1">ISBN</label>
          <input
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full border p-2"
          />
          {errors.isbn && (
            <div className="text-red-600 mt-1">{errors.isbn}</div>
          )}
        </div>

        <div>
          <label className="block mb-1">Page Count</label>
          <input
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
            type="number"
            className="w-full border p-2"
          />
          {errors.pageCount && (
            <div className="text-red-600 mt-1">{errors.pageCount}</div>
          )}
        </div>

        <div>
          <label className="block mb-2">Authors</label>
          {authors.map((author, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={author}
                onChange={(e) => handleAuthorChange(index, e.target.value)}
                placeholder={`Author ${index + 1}`}
                className={`flex-1 border p-2 ${!author.trim() ? 'border-red-500 bg-red-50' : ''}`}
              />
              {authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAuthor(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAuthor}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Author
          </button>
          {errors.authors && (
            <div className="text-red-600 mt-1">{errors.authors}</div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}