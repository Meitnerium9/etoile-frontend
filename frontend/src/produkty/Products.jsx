import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import ProductsHeader from "./componenty/ProductsHeader.jsx";
import ProductsGrid from "./componenty/ProductsGrid.jsx";

import "./Products.css";
import { useEffect, useState } from "react";

function Products() {
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
