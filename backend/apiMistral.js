export const mistral = async (prompt) => {
    const url = "https://api.mistral.ai/v1/chat/completions";

    const requestBody = {
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }]
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer 2rv6mrCgjbspckbk090ZZKjFTbPjnnVD"
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json.choices[0]; 
    } catch (error) {
      console.error(error.message)
    }
  }
