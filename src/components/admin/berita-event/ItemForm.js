'use client';
import { useState, useEffect } from 'react';
import FormInput from '@/components/ui/FormInput';
import TextArea from '@/components/ui/TextArea';

const ItemForm = ({ item, onSave, onCancel, itemType }) => {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        image: '',
        date: '',
        author: '',
        time: '',
        location: '',
        status: '',
        organizer: '',
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            setFormData({
                title: '',
                excerpt: '',
                image: '',
                date: '',
                author: '',
                time: '',
                location: '',
                status: '',
                organizer: '',
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">
                {item ? 'Edit' : 'Tambah'} {itemType === 'berita' ? 'Berita' : 'Event'}
            </h2>
            <FormInput
                label="Judul"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <TextArea
                label="Kutipan"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
            />
            <FormInput
                label="URL Gambar"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
            />
            <FormInput
                label="Tanggal"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            {itemType === 'berita' ? (
                <FormInput
                    label="Penulis"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
            ) : (
                <>
                    <FormInput
                        label="Waktu"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Lokasi"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Penyelenggara"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                    />
                </>
            )}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
};

export default ItemForm;
