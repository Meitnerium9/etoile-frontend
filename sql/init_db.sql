-- Tabele słownikowe i główne (bez kluczy obcych do innych)
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_designer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabele z zależnościami 1-go stopnia
CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES Categories(category_id),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(500)
);

CREATE TABLE Custom_Projects (
    project_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    image_path VARCHAR(500),
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id INT,
    metal VARCHAR(50) not null,
    project_size int not null,
    trinket1 VARCHAR(50) not null,
    trinket2 VARCHAR(50)
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(10, 2) NOT NULL
);

-- Tabele z zależnościami 2-go stopnia
CREATE TABLE Cart (
    cart_item_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(product_id),
    project_id INT REFERENCES Custom_Projects(project_id),
    quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE Order_Items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(product_id),
    project_id INT REFERENCES Custom_Projects(project_id),
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Blog_Posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    project_id INT UNIQUE REFERENCES Custom_Projects(project_id), -- UNIQUE robi z tego relację 1:1
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(product_id),
    project_id INT REFERENCES Custom_Projects(project_id)
);