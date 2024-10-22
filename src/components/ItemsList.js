import React, { useEffect, useState } from 'react';

function ItemsList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/items/')
            .then(response => response.json())
            .then(data => setItems(data));
    }, []);

    return (
        <div>
            {items.map(item => (
                <div key={item.id}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ItemsList;
