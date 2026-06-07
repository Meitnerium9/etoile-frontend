-- Users
INSERT INTO Users (username, email, password_hash, is_designer) VALUES
('jan_kowalski', 'jan@example.com', 'hash123', FALSE),
('anna_nowak', 'anna@example.com', 'hash456', TRUE),
('piotr_wisniewski', 'piotr@example.com', 'hash789', FALSE),
('kasia_zielinska', 'kasia@example.com', 'hash101', TRUE);

-- Categories
INSERT INTO Categories (name) VALUES
('Bransoletki'),
('Naszyjniki'),
('Pierścionki'),
('Kolczyki');

-- Products
INSERT INTO Products (category_id, name, price, image_path) VALUES
(1, 'Bransoletka Srebrna Classic', 149.99, 'produkty/Bransoletka1.png'),
(1, 'Bransoletka Gold Luxury', 299.99, 'produkty/Bransoletka2.png'),
(2, 'Naszyjnik Elegance', 199.99, 'produkty/Naszyjnik1.png'),
(3, 'Pierścionek Diamond', 499.99, 'produkty/Pierscionek2.png'),
(4, 'Kolczyki Pearl', 129.99, 'produkty/ZloteKolczyki3.png');

-- Custom_Projects
INSERT INTO Custom_Projects
(user_id, name, total_price, category_id, metal, project_size, trinket1, trinket2)
VALUES
(1, 'Projekt Bransoletki Jan', 179.99, 1, 'Srebro', 19, 'Serce', 'Gwiazda'),
(2, 'Projekt Naszyjnika Anna', 249.99, 2, 'Złoto', 50, 'Motyl', NULL),
(3, 'Projekt Pierścionka Piotr', 599.99, 3, 'Platyna', 15, 'Diament', NULL);

-- Orders
INSERT INTO Orders (user_id, status) VALUES
(1, 'Zrealizowane'),
(2, 'W realizacji'),
(3, 'Oczekujące');

-- Cart
INSERT INTO Cart (user_id, product_id, project_id, quantity) VALUES
(1, 1, NULL, 2),
(1, NULL, 1, 1),
(2, 3, NULL, 1),
(3, NULL, 3, 1);

-- Order_Items
INSERT INTO Order_Items
(order_id, product_id, project_id, quantity, price_at_purchase)
VALUES
(1, 1, NULL, 1, 149.99),
(1, NULL, 1, 1, 179.99),
(2, 3, NULL, 2, 199.99),
(3, NULL, 3, 1, 599.99);

-- Blog_Posts
INSERT INTO Blog_Posts
(user_id, project_id, title, description, image_path)
VALUES
(
    2,
    2,
    'Mój autorski naszyjnik',
    'Projekt inspirowany naturą i motywem motyla.',
    'blog/post1.jpg'
),
(
    4,
    3,
    'Ekskluzywny pierścionek',
    'Pierścionek wykonany z platyny z ozdobnym kamieniem.',
    'blog/post2.jpg'
);

-- Favorites
INSERT INTO Favorites (user_id, product_id, project_id) VALUES
(1, 3, NULL),
(1, NULL, 2),
(2, 1, NULL),
(3, NULL, 1),
(4, 4, NULL);