document.addEventListener('DOMContentLoaded', async () => {
    const socket = io();
    const list = document.getElementById('productList');
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");
    const currentPageElement = document.getElementById("current-page");

    const params = new URLSearchParams(location.search);
    let page = parseInt(params.get("page"), 10) || 1; // Valor por defecto es 1

    let maxPage;
    let currentPageNumber;

    // Función para renderizar productos en la lista
    const renderProducts = (products) => {
        list.innerHTML = ''; // Vaciar la lista actual
        products.forEach(product => {
            const li = document.createElement('li');
            // Crear un contenedor para el texto
            const textContainer = document.createElement('span');
            textContainer.textContent = `${product.title} - $${product.price}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            const addToCart = document.createElement('button');
            addToCart.textContent = 'AddCart';
            deleteButton.onclick = () => {
                // Eliminar el elemento `li` del DOM
                list.removeChild(li);
                // Emitir el evento para borrar el producto en el servidor
                socket.emit('borrarProducto', product._id);
            };
            addToCart.onclick = () => {
                // Emitir el evento para agregar el producto al carrito en el servidor
                socket.emit('agregarProductoAlCarrito', product._id);
            };

            li.appendChild(textContainer); // Añadir el contenedor de texto al li
            li.appendChild(addToCart);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });
    };

    // Función para actualizar los botones de paginación
    const updatePaginationButtons = () => {
        btnNext.disabled = currentPageNumber >= maxPage;
        btnPrev.disabled = currentPageNumber <= 1;
        currentPageElement.textContent = currentPageNumber;
    };

    // Función para obtener productos
    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/products/?page=${page}`); // Solicitud GET con número de página
            if (response.ok) {
                const data = await response.json();
                maxPage = data.totalPages; // Asegúrate de que tu backend envíe 'totalPages'
                currentPageNumber = data.page; // Asegúrate de que tu backend envíe 'page'
                const products = data.payload || [];
                renderProducts(products);
                updatePaginationButtons(); // Actualiza los botones de paginación
            } else {
                console.error('Error al obtener productos:', response.statusText);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    // Inicializa la carga de productos
    await fetchProducts();

    socket.on('actualizarProductos', (products) => {
        //renderProducts(products);
        fetchProducts()
    });

    // Redireccionar a la siguiente página
    btnNext.addEventListener('click', () => {
        if (currentPageNumber < maxPage) {
            page++;
            params.set('page', page);
            history.pushState(null, '', `?${params.toString()}`);
            fetchProducts();
        }
    });

    // Redireccionar a la página anterior
    btnPrev.addEventListener('click', () => {
        if (currentPageNumber > 1) {
            page--;
            params.set('page', page);
            history.pushState(null, '', `?${params.toString()}`);
            fetchProducts();
        }
    });

    // Manejo del estado del historial para actualizaciones de página
    window.addEventListener('popstate', async () => {
        const params = new URLSearchParams(location.search);
        page = parseInt(params.get("page"), 10) || 1;
        await fetchProducts();
    });
});
