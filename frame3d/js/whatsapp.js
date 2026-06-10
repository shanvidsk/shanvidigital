export function sendWhatsAppOrder(size, orientation, frameColor) {
    const phoneNumber = "919507675743";
    
    const message = `Hello,\n\nI want to order this frame.\n\nSize: ${size}\nOrientation: ${orientation}\nFrame Color: ${frameColor}\n\nThank You`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}