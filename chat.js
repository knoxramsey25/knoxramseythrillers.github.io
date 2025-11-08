import fetch from "node-fetch";  // if using Node 18+, you can skip this import

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // safer than hardcoding

async function main() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o", // use "gpt-4o" or "gpt-4-turbo", whichever your account supports
      messages: [{ role: "user", content: "Hello!" }]
    })
  });

  const data = await response.json();
  console.log(data.choices?.[0]?.message?.content || data);
}

main().catch(console.error);