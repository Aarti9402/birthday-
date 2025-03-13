document.addEventListener('DOMContentLoaded', function() {
    const canvases = document.querySelectorAll('canvas');
    const bases = document.querySelectorAll('.base');

    canvases.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match parent
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;

        // Fill with pink color
        ctx.fillStyle = 'rgba(255, 105, 180, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let isDragged = false;
        const rect = canvas.getBoundingClientRect();

        canvas.addEventListener('mousedown', (e) => {
            isDragged = true;
            scratch(e.clientX - rect.left, e.clientY - rect.top, ctx, bases[index]);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragged) {
                scratch(e.clientX - rect.left, e.clientY - rect.top, ctx, bases[index]);
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragged = false;
        });
    });

    function scratch(x, y, ctx, base) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2); // Larger scratch radius
        ctx.fill();

        // Check transparency
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const transparentPixels = Array.from(imageData.data)
            .filter((_, i) => i % 4 === 3 && imageData.data[i] === 0)
            .length;

        const transparencyPercentage = (transparentPixels / (imageData.data.length / 4)) * 100;
        
        console.log(`Transparency: ${transparencyPercentage}%`);
        
        if (transparencyPercentage > 40) {
            base.style.display = 'flex';
        }
    }
});
