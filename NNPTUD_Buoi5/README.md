# NNPTUD Buoi 5 - User/Role API

## 1) Cai dat

```bash
npm install
```

## 2) Tao file moi truong

Tao file `.env` tu `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

## 3) Chay project

```bash
npm run dev
```

## API theo de bai

### Role

- `POST /roles`
- `GET /roles`
- `GET /roles/:id`
- `PUT /roles/:id`
- `DELETE /roles/:id` (xoa mem)
- `GET /roles/:id/users` (lay user theo role)

### User

- `POST /users`
- `GET /users?username=abc` (query includes username)
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id` (xoa mem)
- `POST /users/enable` body: `{ "email": "...", "username": "..." }`
- `POST /users/disable` body: `{ "email": "...", "username": "..." }`
