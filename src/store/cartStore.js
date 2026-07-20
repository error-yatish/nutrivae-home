import { persistentMap } from '@nanostores/persistent';

// Use persistentMap to store the cart in localStorage so it persists across pages
// cartItems will map product ID to cart details { id, name, price, quantity, image }
export const cartItems = persistentMap('cart:', {}, {
    encode: JSON.stringify,
    decode: JSON.parse
});

export function addToCart(product) {
    // Determine unique ID for cart item (product id + size)
    const cartId = product.size ? `${product.id}-${product.size}` : product.id;
    const existing = cartItems.get()[cartId];
    if (existing) {
        cartItems.setKey(cartId, {
            ...existing,
            quantity: existing.quantity + 1
        });
    } else {
        cartItems.setKey(cartId, {
            ...product,
            cartId, // store this for easy reference
            quantity: 1
        });
    }
}

export function removeFromCart(productId) {
    // persistentMap doesn't have a direct delete key method that triggers updates well,
    // so we get the object, delete it, and replace it.
    const current = { ...cartItems.get() };
    delete current[productId];
    cartItems.set(current);
}

export function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    const existing = cartItems.get()[productId];
    if (existing) {
        cartItems.setKey(productId, {
            ...existing,
            quantity
        });
    }
}

export function getCartTotal() {
    const items = cartItems.get();
    return Object.values(items).reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function clearCart() {
    cartItems.set({});
}
