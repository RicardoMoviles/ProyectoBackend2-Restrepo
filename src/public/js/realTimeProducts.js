const socket = io();
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoProducto = Array.from(e.target.elements)
        .filter(el => el.id && el.value) // Filter only input elements with an id and non-empty value
        .reduce((acc, el) => {
            acc[el.id] = el.type === 'number' ? (el.id === 'price' ? parseFloat(el.value) : parseInt(el.value)) : el.value;
            return acc;
        }, {});

    //socket.emit('nuevoProducto', nuevoProducto);

    try {
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});
