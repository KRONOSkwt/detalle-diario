document.addEventListener('DOMContentLoaded', () => {
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    fetch('data/quote.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.quote && data.author) {
                quoteTextElement.textContent = `“${data.quote}”`;
                quoteAuthorElement.textContent = `— ${data.author}, ${data.source || ''}`;
            } else {
                 quoteTextElement.textContent = 'La frase de hoy es un secreto entre nosotros dos.';
                 quoteAuthorElement.textContent = '❤️';
            }
        })
        .catch(error => {
            console.error('Error al cargar la frase:', error);
            quoteTextElement.textContent = 'Parece que la flor de hoy aún no ha florecido. Vuelve a intentarlo.';
        });

    const petalContainer = document.getElementById('petal-container');
    const petalsCount = 20;

    for (let i = 0; i < petalsCount; i++) {
        let petal = document.createElement('div');
        petal.className = 'petal';
        
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 5 + 8}s`;
        petal.style.animationDelay = `${Math.random() * 7}s`;
        
        const scale = Math.random() * 0.5 + 0.5;
        petal.style.transform = `scale(${scale})`;
        petal.style.opacity = scale; 
        
        petalContainer.appendChild(petal);
    }
    
    const wateringCan = document.getElementById('watering-can');
    const quoteContainer = document.querySelector('.quote-container');

    wateringCan.addEventListener('click', () => {
        quoteContainer.style.boxShadow = '0 0 20px 8px rgba(144, 238, 144, 0.5)';
        setTimeout(() => {
            quoteContainer.style.boxShadow = 'none';
        }, 1200);
    });

    const hiddenBud = document.getElementById('hidden-bud');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');

    hiddenBud.addEventListener('click', () => {
        modalOverlay.classList.add('visible');
    });

    closeModal.addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
    });
    
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
    });
});