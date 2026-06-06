import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import ProductsHeader from "./componenty/ProductsHeader.jsx";
import ProductsGrid from "./componenty/ProductsGrid.jsx";

import "./Products.css";
import { useEffect, useState } from "react";

function Products() {
	useEffect(() => {
		fetchProduct();
	}, []);

	async function fetchProduct() {
		try {
			setLoading(true);
			setError("");

			const response = await fetch("http://localhost:8000/products/", {
				headers: {
					"Access-Control-Allow-Origin": "",
					"Access-Control-Allow-Methods": "",
					"Access-Control-Allow-Headers": "*",
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Nie udało się pobrać produktów.");
			}

			const data = await response.json();

			const products = data.map((item) => ({
				...item,
				id: item.product_id,
				category_id: item.category_id,
				checked: true,
				title: item.name,
				price: item.price || 0,
				seller: item.seller || "Etoile_Jewelry",
				image: item.image_path,
			}));

			console.log(products);

			setProducts(products);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Navbar />

			<main className="products-page">
				<div className="products-container">
					<ProductsHeader />
					<ProductsGrid />
				</div>
			</main>

			<Footer />
		</>
	);
}

export default Products;
