
# Feature Documentation Template

## Heath Score Generator

---

## What Is It?  
The Health Score Generator is a feature that evaluates a food product’s nutritional information and returns a health score on a scale from 1 to 10.  
This helps users quickly gauge the overall nutritional quality of a scanned or manually entered product.

---

## How it works?  
When a product name and its nutrition data are submitted via a POST request, a prompt is generated and sent to OpenAI's API.  
The AI model evaluates the data and returns a health score in the format "x.x/10" with no additional summary or explanation.

---

## How to Use It  
To use the Health Score feature:

1. Send a `POST` request to the `/api/health-score-only/` endpoint.
2. Include `name` and `nutrition_data` in the JSON body.
3. Receive a JSON response containing the `health_score`.

Example:  
```bash
curl -X POST https://cs4300-group2.tech/api/health-score-only/ \
-H "Content-Type: application/json" \
-d '{"name": "Diet Soda", "nutrition_data": "{\"caffeine\": 0.068, \"carbohydrates\": 0, \"energy\": 0, \"fat\": 0}"}'
```

This returns a payload like:

```json
{
  health_score: "8.0/10"
}

```

---

## Health Summary Generator

---

## What Is It?  
The Health Summary Generator produces a 50-75 word explanation of the health aspects of a given food product.  
This is useful for users who want a more detailed narrative about the product’s nutrition profile.

---

## How it works?  
Upon receiving the product name and its nutrition data, the API sends a prompt to OpenAI's API.  
The model returns a concise and informative summary without explicitly mentioning the health score, though it considers one internally.

---

## How to Use It  
To use the Health Summary feature:

1. Send a `POST` request to the `/api/health-summary-only/` endpoint.
2. Include `name` and `nutrition_data` in the JSON body.
3. Receive a JSON response containing the `health_score_summary`.

Example:  
```bash
curl -X POST https://cs4300-group2.tech/api/health-summary-only/ \
-H "Content-Type: application/json" \
-d '{"name": "Diet Soda", "nutrition_data": "{\"caffeine\": 0.068, \"carbohydrates\": 0, \"energy\": 0, \"fat\": 0}"}'
```
This returns a payload like:

```json
{
  health_score_summary: "some summary goes here"
}

```