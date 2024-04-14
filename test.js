const axios = require("axios");

const api = async () => {
  const options = {
    method: "POST",
    url: "https://online-code-compiler.p.rapidapi.com/v1/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "beffd5b897mshfc71b5776ff983dp145860jsn33dd55627068",
      "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
    },
    data: {
      language: "python3",
      version: "latest",
      code: `print("Hello World")
      for i in range(0, 10):
          print(i)`,
      input: null,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

api();
