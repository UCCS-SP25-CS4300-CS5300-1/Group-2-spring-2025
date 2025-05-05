# Image Scan for Barcode

---

## What Is It?
Accepts an uploaded image, scans it for a barcode, and returns product nutrition data.

---

## How it works?
A POST request with a file is processed using the `ImageScan` class. The barcode is extracted and used to fetch product info.

---

## How to Use It

1. Send a `POST` request to the endpoint with a form-data image:
```
POST /ImageScan/
```

Example using `curl`:
```bash
curl -F "file=@barcode.jpg" http://localhost:8000/ImageScan/
```

