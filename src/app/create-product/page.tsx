'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { productService } from '@/services/productService'

export default function CreateProductPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [errors, setErrors] = useState<{[k:string]:string}>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e: {[k:string]:string} = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    const p = Number(price)
    if (isNaN(p) || p <= 0) e.price = 'Price must be a number greater than 0'
    if (!thumbnail.trim()) e.thumbnail = 'Thumbnail URL is required'
    else if (!/^https?:\/\//i.test(thumbnail.trim())) e.thumbnail = 'Thumbnail must be a valid URL (http/https)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      productService.addProduct({ title: title.trim(), isbn: description.trim(), pageCount: Number(price), authors: [thumbnail.trim()] })
      router.push('/')
    } catch (err) {
      console.error('Error adding product', err)
      setErrors({ form: 'Failed to add product' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Create product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {errors.form && <div className="text-red-600">{errors.form}</div>}
        <div>
          <label className="block mb-1">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2" />
          {errors.title && <div className="text-red-600 mt-1">{errors.title}</div>}
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2" />
          {errors.description && <div className="text-red-600 mt-1">{errors.description}</div>}
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" className="w-full border p-2" />
          {errors.price && <div className="text-red-600 mt-1">{errors.price}</div>}
        </div>

        <div>
          <label className="block mb-1">Thumbnail URL</label>
          <input value={thumbnail} onChange={e => setThumbnail(e.target.value)} className="w-full border p-2" />
          {errors.thumbnail && <div className="text-red-600 mt-1">{errors.thumbnail}</div>}
        </div>

        <div>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  )
}
