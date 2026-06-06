from fastapi import FastAPI
from app.api.routes import auth, users, products, cart, orders, projects, favorites, posts, orderitems
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(products.router, prefix="/products")
app.include_router(cart.router, prefix="/cart")
app.include_router(orders.router, prefix="/orders")
app.include_router(projects.router, prefix="/projects")
app.include_router(favorites.router, prefix="/favorites")
app.include_router(posts.router, prefix="/posts")
app.include_router(orderitems.router, prefix="/orderitems")
