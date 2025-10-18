import fetch from 'node-fetch';
import fs from 'fs';

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
                model: "llama3-8b-8192", // Un modelo rápido y gratuito
                temperature: 0.8,
                max_tokens: 100,
                top_p: 1,
                stream: false,
                response_format: { type: "json_object" },
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error! status: ${response.status}`);
        }

        const data = await response.json();
        const quoteJson = JSON.parse(data.choices[0].message.content);
        
        console.log("Successfully fetched quote:", quoteJson);
        return quoteJson;

    } catch (error) {
        console.error("Error fetching new quote:", error);
        return null;
    }
}

async function updateQuoteFile() {
    const newQuote = await fetchNewQuote();
    if (newQuote && newQuote.quote) {
        fs.writeFileSync('./data/quote.json', JSON.stringify(newQuote, null, 2));
        console.log("quote.json has been updated successfully.");
    } else {
        console.error("Failed to update quote.json because the new quote was invalid.");
    }
}

updateQuoteFile();