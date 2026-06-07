import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";

function ProductsGrid() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch("http://127.0.0.1:8000/products/", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			setProducts(await response.json());
		}
		fetchData();
	}, []);

	const [openProductId, setOpenProductId] = useState(null);

	function handleProductClick(productId) {
		setOpenProductId((currentId) => (currentId === productId ? null : productId));
	}

	return (
		<div className="products-grid">
			{products.map((product) => (
				<ProductCard
					key={product.product_id}
					product={product}
					isOpen={openProductId === product.product_id}
					onToggle={() => handleProductClick(product.product_id)}
				/>
			))}
		</div>
	);
}

export default ProductsGrid;
