import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Construye la ruta absoluta al directorio del script para evitar errores
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPT = `
Actúa como un curador de literatura clásica y poesía. 
Proporciona una única frase o verso corto (máximo 30 palabras) de un libro o poema famoso que exprese un amor profundo, sincero y elegante.
La respuesta debe ser solo un objeto JSON con las claves "quote", "author" y "source" (el nombre del libro o poema).
Ejemplo de formato: {"quote": "El amor no mira con los ojos, sino con el alma.", "author": "William Shakespeare", "source": "El sueño de una noche de verano"}
No añadas nada más a la respuesta, solo el JSON.
`;

async function fetchNewQuote() {
    console.log("Fetching new quote from Groq...");
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Eres un experto en literatura y poesía romántica." },
                    { role: "user", content: PROMPT }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                max_tokens: 100,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Groq API error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const quoteJson = typeof content === 'string' ? JSON.parse(content) : content;
        
        console.log("Successfully fetched quote:", quoteJson);
        return quoteJson;

    } catch (error) {
        console.error("Error fetching new quote:", error);
        process.exit(1); 
    }
}

async function updateQuoteFile() {
    const newQuote = await fetchNewQuote();
    if (newQuote && newQuote.quote) {
        const filePath = path.join(__dirname, '../data/quote.json');
        fs.writeFileSync(filePath, JSON.stringify(newQuote, null, 2));
        console.log("quote.json has been updated successfully.");
    } else {
        console.error("Failed to update quote.json because the new quote was invalid.");
        process.exit(1); 
    }
}

updateQuoteFile();