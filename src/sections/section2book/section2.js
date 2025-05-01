import Button from '@/components/button/Button';
import BookCard from '@/components/card/BookCard';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// src/sections/Section2Books/Section2Books.js

const dummyBooks = [
    {
        id: 1,
        title: 'Seni Rupa SMA/MA Kelas X',
        subtitle: 'Untuk SMA/MA/SMK',
        image: '/unmuhpress.png', // ganti nanti dengan API
    },
    {
        id: 2,
        title: 'Seni Rupa SMA/MA Kelas X',
        subtitle: 'Untuk SMA/MA/SMK',
        image: '/unmuhpress.png', // ganti nanti dengan API
    },
    {
        id: 3,
        title: 'Seni Rupa SMA/MA Kelas X',
        subtitle: 'Untuk SMA/MA/SMK',
        image: '/unmuhpress.png', // ganti nanti dengan API
    },
    {
        id: 4,
        title: 'Seni Rupa SMA/MA Kelas X',
        subtitle: 'Untuk SMA/MA/SMK',
        image: '/unmuhpress.png', // ganti nanti dengan API
    },
];

export default function Section2Books() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-10 -mt-10">
                    Buku Terbit Minggu ini
                </h2>
                <div className="flex flex-col-reverse md:flex-row">
                    <div className="mb-8 flex flex-col items-center justify-center md:block md:mt-20  mx-auto mt-9 md:mr-1 flex-shrink-0 w-full md:w-64">
                        <h3 className="text-2xl flex items-center text-center font-bold text-blue-800 ">
                            Buku-Buku Terbaru
                        </h3>
                        <Button
                            icon={faArrowRight}
                            variant="primary"
                            className="flex items-center"
                        >
                            Buku lainnya
                        </Button>
                    </div>
                    <div className="flex-1 overflow-x-auto flex space-x-4">
                        {dummyBooks.map((book) => (
                            <BookCard key={book.id} {...book} />
                        ))}
                    </div>
                    {/* Arrow Button */}
                    <div className="hidden sm:flex items-center justify-center min-w-[48px]">
                        <Button
                            icon={faArrowRight}
                            variant="primary"
                            className="flex items-center"
                        ></Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
