export class CanvasEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Default Settings
        this.orientation = 'Portrait'; 
        this.image = null;
        this.imageScale = 1;
        this.imageX = 0;
        this.imageY = 0;
        
        this.text = "";
        this.textColor = "#ffffff";
        this.textSize = 80;
        this.textY = 1500; 

        this.onUpdateCallback = null;
        this.initBlank();
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        if (orientation === 'Portrait') {
            this.canvas.width = 1200;
            this.canvas.height = 1800;
        } else {
            this.canvas.width = 1800;
            this.canvas.height = 1200;
        }
        this.textY = orientation === 'Portrait' ? 1500 : 1000;
        this.render();
    }

    loadImage(dataUrl) {
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.imageScale = 1;
            this.imageX = 0;
            this.imageY = 0;
            this.render();
        };
        img.src = dataUrl;
    }

    updateImageTransform(scale, x, y) {
        this.imageScale = parseFloat(scale);
        this.imageX = parseInt(x);
        this.imageY = parseInt(y);
        this.render();
    }

    updateText(text, color, size, y) {
        this.text = text;
        this.textColor = color;
        this.textSize = parseInt(size);
        this.textY = parseInt(y);
        this.render();
    }

    initBlank() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#cccccc';
        this.ctx.font = '60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Upload Photo', this.canvas.width / 2, this.canvas.height / 2);
    }

    render() {
        try {
            // Clear background
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw Image
            if (this.image) {
                this.ctx.save();
                const cx = this.canvas.width / 2;
                const cy = this.canvas.height / 2;

                this.ctx.translate(cx + this.imageX, cy + this.imageY);
                this.ctx.scale(this.imageScale, this.imageScale);
                
                const iw = this.image.width;
                const ih = this.image.height;
                const scale = Math.max(this.canvas.width / iw, this.canvas.height / ih);
                const drawW = iw * scale;
                const drawH = ih * scale;

                this.ctx.drawImage(this.image, -drawW / 2, -drawH / 2, drawW, drawH);
                this.ctx.restore();
            } else {
                this.initBlank();
            }

            // Draw Text
            if (this.text) {
                this.ctx.fillStyle = this.textColor;
                this.ctx.font = `bold ${this.textSize}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                this.ctx.shadowColor = "rgba(0,0,0,0.5)";
                this.ctx.shadowBlur = 10;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;

                this.ctx.fillText(this.text, this.canvas.width / 2, this.textY);
                this.ctx.shadowColor = "transparent";
            }

            console.log("Canvas Render Complete.");
            if (typeof this.onUpdateCallback === 'function') {
                console.log("FIRING CALLBACK TO 3D SCENE...");
                this.onUpdateCallback(this.canvas);
            } else {
                console.warn("WARNING: onUpdateCallback is not defined.");
            }
        } catch (error) {
            console.error("Error in CanvasEditor.render():", error);
        }
    }
}