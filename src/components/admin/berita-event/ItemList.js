import ItemCard from './ItemCard';

const ItemList = ({ items, onEdit, onDelete, itemType }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
                <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    itemType={itemType}
                />
            ))}
        </div>
    );
};

export default ItemList;
