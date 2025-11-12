// api.js

async function apiRequest(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`http://localhost:8081${endpoint}`, options);

    // Lê o corpo apenas uma vez
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData)
      );
    }

    return responseData;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}
