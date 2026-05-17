import { useState, useRef } from "react";
import "./Post_creator.css";
import Navbar from "../components/Navbar"; // Navbar zostaje w osobnym pliku, tak jak chciałeś wcześniej

function Post_creator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Obsługa wyboru zdjęcia z dysku
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Tworzy tymczasowy URL do podglądu pliku
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current.click(); // Wywołuje kliknięcie ukrytego inputu file
  };

  const handleSave = () => {
    console.log("Zapisywanie posta:", { title, description, image });
    alert("Post został zapisany!");
  };

  return (
    <div className="app-container">
      {/* Navbar na górze strony */}
      <Navbar />

      {/* Główna sekcja z kreatorem (wywalony boczny koszyk) */}
      <main className="main-content">
        <div className="kreator-wrapper">
          <div className="kreator-container">
            {/* Pole tytułu stylizowane na zwykły tekst */}
            <input
              type="text"
              className="kreator-title-input"
              placeholder="Dodaj tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="kreator-row">
              {/* Boks wyboru zdjęcia */}
              <div className="image-upload-box" onClick={handleBoxClick}>
                {image ? (
                  <img src={image} alt="Podgląd" className="uploaded-preview" />
                ) : (
                  <span className="placeholder-text">+ Dodaj zdjęcie</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              {/* Jedno duże, połączone pole opisu */}
              <textarea
                className="kreator-description-input"
                placeholder="+ Dodaj opis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Przycisk na samym dole */}
            <button className="save-post-btn" onClick={handleSave}>
              Zapisz post
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Post_creator;
