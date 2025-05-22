🔐 1. Login Admin
Endpoint: /api/admin/login
Method: POST

Request Body:
{
"email": "admin@example.com",
"password": "admin123"
}

Response:

{
"message": "Login berhasil",
"admin": {
"id": 1,
"email": "admin@example.com"
}
}

🧑‍💼 2. Register Admin
Endpoint: /api/admin/register

Method: POST

Request Body:
{
"email": "admin@example.com",
"password": "admin123"
}
Response:

{
"message": "Admin berhasil didaftarkan",
"admin": {
"id": 1,
"email": "admin@example.com"
}
}

🚪 3. Logout Admin
Endpoint: /api/admin/logout
Method: POST
