// Clave para sessionStorage (se borra al cerrar el navegador)
const STORAGE_KEY = 'ventalite_products';

// Obtener productos del sessionStorage
function getProducts() {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Guardar productos en sessionStorage
function saveProducts(products) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Agregar un nuevo producto
function addProduct(name, quantity, price) {
    const products = getProducts();
    
    products.push({
        id: Date.now(),
        name: name,
        initialQuantity: quantity,
        currentQuantity: quantity,
        price: price,
        soldToday: 0,
        createdAt: new Date().toISOString()
    });
    
    saveProducts(products);
}

// Vender producto
function sellProduct(index, quantity) {
    const products = getProducts();
    
    if (index >= 0 && index < products.length) {
        const product = products[index];
        
        if (product.currentQuantity >= quantity) {
            product.currentQuantity -= quantity;
            product.soldToday = (product.soldToday || 0) + quantity;
            saveProducts(products);
            return true;
        }
    }
    
    return false;
}

// Eliminar producto
function deleteProduct(index) {
    const products = getProducts();
    
    if (index >= 0 && index < products.length) {
        products.splice(index, 1);
        saveProducts(products);
        return true;
    }
    
    return false;
}

// Reiniciar día (borrar todos los datos)
function resetDay() {
    sessionStorage.removeItem(STORAGE_KEY);
}

// Mostrar notificación de éxito
function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    
    if (!notification) return;
    
    // Resetear animación
    notification.classList.remove('show', 'hide');
    
    // Mostrar
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar con efecto de desvanecimiento
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 1500);
    
    // Limpiar clases
    setTimeout(() => {
        notification.classList.remove('hide');
    }, 2000);
}

// Formatear moneda
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Obtener estadísticas del día
function getDayStats() {
    const products = getProducts();
    
    let totalSold = 0;
    let totalRevenue = 0;
    
    products.forEach(product => {
        totalSold += product.soldToday || 0;
        totalRevenue += (product.soldToday || 0) * product.price;
    });
    
    return {
        totalProducts: products.length,
        totalSold: totalSold,
        totalRevenue: totalRevenue,
        products: products
    };
}