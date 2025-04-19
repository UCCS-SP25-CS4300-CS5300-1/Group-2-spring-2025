## Allergens post/get API

---

## What Is It?  
The allergens API allows for saving and retrieving of custom allegerns.

---

## How it works?  
When sent a post, the user-allergens/ path adds an allergen to the user allergens.
When sent a get request, it returns all user allergens in a json list.
When sent a delete, it removes the specified allergen.

---

## How to Use It 
all of these requests must have the crsftoken in the header
To add an allergen, send a post request with the body being allergen: requested.
to get allergens send a get request and the API will return all saved allergens for the user
To remove an allergen, send a delete request to remove, the server will handle authentication. 
Example:  
```bash
curl -X POST https://cs4300-group2.tech/api/user-allergen \
-H "Content-Type: application/json, X-CSRFToken: csrfToken" \
-d '{ allergen: custom }'
```

It will return an HTTP status code of 201 if successful. 