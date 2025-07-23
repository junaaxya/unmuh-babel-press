import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ItemCard = ({ item, onEdit, onDelete, itemType }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 w-full">
                <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{item.date}</span>
                    <span>{item.author || item.organizer}</span>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
