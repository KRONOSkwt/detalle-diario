document.addEventListener('DOMContentLoaded', () => {
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    fetch('data/quote.json')
        .then(response => response.json())
        .then(data => {
            quoteTextElement.textContent = `“${data.quote}”`;
            quoteAuthorElement.textContent = `— ${data.author}, ${data.source}`;
        })
        .catch(error => {
            console.error('Error al cargar la frase:', error);
            quoteTextElement.textContent = 'No se pudo cargar la frase de hoy. Inténtalo de nuevo más tarde.';
        });
});