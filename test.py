import http.client

conn = http.client.HTTPSConnection("online-code-compiler.p.rapidapi.com")

payload = '{"language":"python3","version":"latest","code":"print(\\"Hello, World!\\");","input":null}'

headers = {
    "x-rapidapi-key": "beffd5b897mshfc71b5776ff983dp145860jsn33dd55627068",
    "x-rapidapi-host": "online-code-compiler.p.rapidapi.com",
    "Content-Type": "application/json",
}

conn.request("POST", "/v1/", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
