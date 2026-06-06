import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { products } from "../productsData.js";

function ProductsGrid() {
	const [openProductId, setOpenProductId] = useState(null);

	function handleProductClick(productId) {
		setOpenProductId((currentId) => (currentId === productId ? null : productId));
	}

	return (
		<div className="products-grid">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					isOpen={openProductId === product.id}
					onToggle={() => handleProductClick(product.id)}
				/>
			))}
		</div>
	);
}

export default ProductsGrid;
