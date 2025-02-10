const getData = async (api_key, prompt) => {
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
            "Authorization": `Bearer ${api_key}`
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

console.log(getData("2rv6mrCgjbspckbk090ZZKjFTbPjnnVD", "Cocorico ça veut dire quoi ?").then((data) => {
    console.log(data)
}))