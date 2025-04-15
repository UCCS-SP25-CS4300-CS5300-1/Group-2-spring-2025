# Product Lookup by Barcode

---

## What Is It?
Fetches detailed product nutrition data using a barcode.

---

## How it works?
Accepts a `GET` request with the barcode in the URL path. It uses the `Product` model to query data and returns it serialized.

---

## How to Use It

1. Make a GET request to the following endpoint:
```
GET /product/<barcode>/
```

Example:
```bash
curl https://cs4300-group2.tech/api/product/0123456789012/
```

This returns a payload like:
```json
{
  "barcode": "0",
  "name": "Vegan Protein Superblend",
  "nutrition_data": {
    "carbohydrates": 6.9,
    "fiber": 10,
    "proteins": 67
  }
}

```