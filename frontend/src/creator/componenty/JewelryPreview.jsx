import "./JewelryPreview.css";
import sampleImage from "../../assets/Sample.webp";

function JewelryPreview({ image }) {
	return (
		<section className="jewelry-preview">
			<div className="preview-box">
				<img src={image || sampleImage} alt="Podgląd biżuterii" className="preview-image" />

				<h3 className="preview-title">Podgląd projektu</h3>
			</div>
		</section>
	);
}

export default JewelryPreview;
