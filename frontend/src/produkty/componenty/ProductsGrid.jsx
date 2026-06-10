import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";

function ProductsGrid() {
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(12);
	const [openProductId, setOpenProductId] = useState(null);

	// 🔥 FILTRY
	const [category, setCategory] = useState("");
	const [sort, setSort] = useState("");

	// paginacja frontendowa (z Twojej wersji)
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
	const totalPages = Math.ceil(products.length / productsPerPage);

	// 🔥 FETCH Z FILTRAMI
	async function fetchProducts() {
		const params = new URLSearchParams();

		if (category) params.append("category_id", category);
		if (sort) params.append("sort", sort);

		const response = await fetch(
			`http://127.0.0.1:8000/products/filter/?${params.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();
		setProducts(data);
		setCurrentPage(1); // reset paginacji po filtrze
	}

	// 🔥 pierwszy load
	useEffect(() => {
		fetchProducts();
	}, []);

	function handleProductClick(productId) {
		setOpenProductId((currentId) => (currentId === productId ? null : productId));
	}

	return (
		<>
			<div className="products-toolbar">
				<div className="products-toolbar-box">
					<span className="products-filter-label">Kategoria</span>
					<div className="products-filter-group">
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="products-filter-select">
							<option value="">Wszystkie</option>
							<option value="1">Bransoletki</option>
							<option value="2">Naszyjniki</option>
							<option value="3">Pierścionki</option>
							<option value="4">Kolczyki</option>
						</select>
					</div>
					<span className="products-filter-label">Sortowanie</span>
					<div className="products-filter-group">
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							className="products-filter-select">
							<option value="">Domyślnie</option>
							<option value="asc">Cena ↑</option>
							<option value="desc">Cena ↓</option>
						</select>
					</div>

					<button className="products-filter-button" onClick={fetchProducts}>
						Filtruj
					</button>
				</div>
			</div>

			{/* 🔥 GRID */}
			<div className="products-grid">
				{currentProducts.map((product) => (
					<ProductCard
						key={product.product_id}
						product={product}
						isOpen={openProductId === product.product_id}
						onToggle={() => handleProductClick(product.product_id)}
					/>
				))}
			</div>

			{/* 🔥 PAGINACJA */}
			{totalPages > 1 && (
				<div className="products-pagination">
					<button
						onClick={() => setCurrentPage((prev) => prev - 1)}
						disabled={currentPage === 1}
						className="products-pagination-button">
						← Poprzednia
					</button>

					<span className="products-pagination-info">
						Strona {currentPage} z {totalPages}
					</span>

					<button
						onClick={() => setCurrentPage((prev) => prev + 1)}
						disabled={currentPage === totalPages}
						className="products-pagination-button">
						Następna →
					</button>
				</div>
			)}
		</>
	);
}

export default ProductsGrid;
