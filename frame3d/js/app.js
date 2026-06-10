import { CanvasEditor } from './editor.js';
import { SceneController } from './controls.js';

document.addEventListener('DOMContentLoaded', () => {
    const editor = new CanvasEditor('textureCanvas');
    const scene3D = new SceneController('canvas-container');
    const loadingOverlay = document.getElementById('loadingOverlay');

    editor.onUpdateCallback = (canvas) => {
        console.log("CALLBACK FIRED: Canvas passed to 3D Scene.");
        scene3D.updateTexture(canvas);
    };

    scene3D.onFirstTextureLoad = () => {
        if(loadingOverlay) {
            console.log("Hiding Loading Overlay.");
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.style.display = 'none', 700);
        }
    };
    
    // Explicit call to start rendering chain
    editor.render();
    scene3D.animate();

    let currentSize = '9x12';
    let currentOrientation = 'Portrait';
    let currentFrameColorName = 'Black';
    let currentPrice = '299'; // Default setup for 9x12

    const uploadPhotoInput = document.getElementById('uploadPhoto');
    const btnBrownFrame = document.getElementById('btnBrownFrame');
    const btnBlackFrame = document.getElementById('btnBlackFrame');
    const btnAddText = document.getElementById('btnAddText');
    
    const editorPanel = document.getElementById('editorPanel');
    const textPanel = document.getElementById('textPanel');
    
    const photoScale = document.getElementById('photoScale');
    const photoX = document.getElementById('photoX');
    const photoY = document.getElementById('photoY');
    
    const customText = document.getElementById('customText');
    const textColor = document.getElementById('textColor');
    const textSize = document.getElementById('textSize');
    const textY = document.getElementById('textY');

    const sizeBtns = document.querySelectorAll('.size-btn');
    const btnWhatsapp = document.getElementById('btnWhatsapp');
    
    const productPrice = document.getElementById('productPrice');
    const originalPrice = document.getElementById('originalPrice');

    uploadPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editor.loadImage(event.target.result);
                editorPanel.classList.remove('hidden'); 
            };
            reader.readAsDataURL(file);
        }
    });

    const updatePhotoTransform = () => {
        editor.updateImageTransform(photoScale.value, photoX.value, photoY.value);
    };
    photoScale.addEventListener('input', updatePhotoTransform);
    photoX.addEventListener('input', updatePhotoTransform);
    photoY.addEventListener('input', updatePhotoTransform);

    const resetColorButtons = () => {
        btnBrownFrame.classList.remove('border-blue-600');
        btnBlackFrame.classList.remove('border-blue-600');
        btnBrownFrame.classList.add('border-gray-300');
        btnBlackFrame.classList.add('border-gray-300');
    };

    btnBrownFrame.addEventListener('click', () => {
        scene3D.setFrameColor(0x4a2f20); 
        currentFrameColorName = 'Brown';
        resetColorButtons();
        btnBrownFrame.classList.remove('border-gray-300');
        btnBrownFrame.classList.add('border-blue-600');
    });

    btnBlackFrame.addEventListener('click', () => {
        scene3D.setFrameColor(0x222222);
        currentFrameColorName = 'Black';
        resetColorButtons();
        btnBlackFrame.classList.remove('border-gray-300');
        btnBlackFrame.classList.add('border-blue-600');
    });

    // Default select Black
    btnBlackFrame.click();

    btnAddText.addEventListener('click', () => {
        textPanel.classList.toggle('hidden');
        btnAddText.classList.toggle('border-blue-600');
    });

    const updateTextData = () => {
        editor.updateText(customText.value, textColor.value, textSize.value, textY.value);
    };
    customText.addEventListener('input', updateTextData);
    textColor.addEventListener('input', updateTextData);
    textSize.addEventListener('input', updateTextData);
    textY.addEventListener('input', updateTextData);

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => {
                b.classList.remove('active', 'border-[#cc0100]', 'bg-[#fff4f4]', 'text-[#cc0100]');
                b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
            });
            
            const clickedBtn = e.target;
            clickedBtn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
            clickedBtn.classList.add('active', 'border-[#cc0100]', 'bg-[#fff4f4]', 'text-[#cc0100]');
            
            currentSize = clickedBtn.getAttribute('data-size');
            const newOrientation = clickedBtn.getAttribute('data-orientation');

            // EXACT PRICING LOGIC
            if (currentSize === '9x12' || currentSize === '12x9') {
                currentPrice = '299';
                productPrice.innerText = '₹299';
                originalPrice.innerText = '₹499';
            } else if (currentSize === '12x18' || currentSize === '18x12') {
                currentPrice = '599';
                productPrice.innerText = '₹599';
                originalPrice.innerText = '₹999';
            }

            if (currentOrientation !== newOrientation) {
                currentOrientation = newOrientation;
                editor.setOrientation(currentOrientation);
                scene3D.setOrientation(currentOrientation === 'Portrait');
                textY.max = currentOrientation === 'Portrait' ? 1800 : 1200;
            }
        });
    });

    btnWhatsapp.addEventListener('click', () => {
        const productName = "Personalised Photo Frame for Birthday Gifts Collage";
        const phoneNumber = "919507675743";
        const message = `Hello,\n\nI want to order this frame.\n*${productName}*\n\nSize: ${currentSize}\nOrientation: ${currentOrientation}\nFrame Color: ${currentFrameColorName}\nPrice: ₹${currentPrice}\n\nPlease share payment details.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });


    const checkPinBtn = document.getElementById('checkPin');
const pinInput = document.getElementById('pincode');
const pinResult = document.getElementById('pinResult');

if (checkPinBtn) {

    checkPinBtn.addEventListener('click', () => {

        const pin = pinInput.value.trim();

        if (pin.length !== 6 || isNaN(pin)) {

            pinResult.style.display = 'block';
            pinResult.innerHTML =
                '❌ Please enter a valid 6 digit pincode';

            return;
        }

        pinResult.style.display = 'block';

        pinResult.innerHTML = `
<div>✅ Delivery Available</div>
<div>🚚 Estimated Delivery: 3-7 Working Days</div>
<div>📦 Free Shipping Across India</div>
`;

    });

}
});