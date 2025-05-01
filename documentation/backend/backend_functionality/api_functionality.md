# Product Lookup

This feature allows users to look up a food product's information by its barcode number. By entering the barcode value, 
the Open Food Facts API is able to retrieve the name and nutritional information about the product, including ingredients, allergens, and more.

---

## What Is It?
The Product Lookup feature allows users to quickly find the details of a food product by entering its barcode number.
This is useful for easily accessing nutritional data and other product details without manually searching for it elsewhere. 

For this feature, we utilize the Open Food Facts API, which is a comprehensive database for food products globally. 
The barcode number is sent to the API, which then returns a full set of information about the product.

---

## How it works?
The feature works by taking the barcode number as part of the URL endpoint. When the barcode is provided, a request is 
sent to the Open Food Facts API. The API then response with the product's data, including various attributes like the 
product's name, ingredients, nutrition facts, allergens, and more. 

---

## How to Use It
To look up a product, follow these steps:

1. Obtain the barcode number of the product you want to look up.
2. http://localhost:8000/api/product/barcode_number/

   for example: http://localhost:8000/api/product/5000157062673/
3. Enter the URL into your browser
4. Review the returned product data

Example:  
```bash
# While running the django project, run:
$ curl http://127.0.0.1:8000/api/product/1234567890/

# This will return a json string of information
```

## Image Scanner

Required installs over base django:
pip install pyzbar opencv-python numpy

The API takes an image in the body of an HTTP request and returns the food value based on the barcode. It utilizes the product information on the server to speed things up.

## What is it?
The image scanner allows for a UPC/EAN13 image to be uploaded to the server and retrieve the product data back. It utilizes the same lookup functions as the text barcode lookup but allows for barcode image uploads rather than typing in the barcode.

## How does it work?
Simply attach an image to the body of the HTTP request sent to the server:
```javascript
const formData = new FormData();
formData.append("file", barcode);
const response = await fetch(`http://127.0.0.1:8000/api/ImageScan/`, {
      method: "POST",
      body: formData,
});
if (!response.ok) {
      throw new Error("Network response was not ok");
}
const data = await response.json();
// this will return the same format and information as above but with an easier input method
```