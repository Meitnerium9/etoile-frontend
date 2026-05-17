import { useState } from "react";
import "./Koszyk.css";

import iconFavourite from "../assets/ulubione.png";
import iconCart from "../assets/Cart.png";
import iconLogo from "../assets/logo.png";
import iconAcc from "../assets/account.png";
import iconSample from "../assets/Sample.png";
import iconProt from "../assets/Elogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartItem = ({ title, price }) => (
  <div className="item">
    <div className="placeholder-img" />
    <div className="item-info">
      <p>{title}</p>
      <span className="price">{price} zł</span>
    </div>
  </div>
);

const Suggestion = ({ price, name }) => (
  <div className="suggested-item">
    <div className="placeholder-img small" />
    <p className="price">{price} zł</p>
    <p className="small-text">{name}</p>
  </div>
);

const ElementKoszyka = ({ produkt, naPlus, naMinus, onToggleCheck }) => (
  <div className="cart-product">
    <label className="star-checkbox">
      <input
        type="checkbox"
        checked={produkt.checked}
        onChange={onToggleCheck}
      />
      <span className="star-icon"></span>
    </label>
    <a href="/" className="cart-koszyk">
      <img src={iconSample} alt="koszyk" />
    </a>
    <div className="product-info">
      <p className="product-name">{produkt.nazwa}</p>
      <div className="product-row">
        {/* LICZNIK - Twoja struktura 1:1 */}
        <div className="qty-picker">
          <button onClick={naMinus} type="button">
            -
          </button>
          <input type="text" value={produkt.ilosc} readOnly />
          <button onClick={naPlus} type="button">
            +
          </button>
        </div>
        <span className="price-big">{produkt.cena * produkt.ilosc} zł</span>
      </div>
    </div>
  </div>
);

/* Komponetny polecanych */
const ElementListy = ({ product, onAdd }) => (
  <div className="upsell-box shadow">
    <a href="/" className="upsell-img">
      <img src={iconSample} alt="produkt" />
    </a>
    <p className="price-mid">{product.price} zł</p>
    <p className="upsell-text">{product.title}</p>
    <button className="add-btn" onClick={() => onAdd(product)}>
      DO KOSZYKA
    </button>
  </div>
);

function App() {
  // Stan dla licznika sztuk
  const [quantity, setQuantity] = useState(1);

  // Produkty w koszyku
  const [produktyWKoszyku, setProduktyWKoszyku] = useState([
    {
      id: 1,
      nazwa: "BRANSOLETKA SŁÓŃCE 45 CM ŻÓŁTE ZŁOTO",
      cena: "6200",
      ilosc: 1,
      checked: true, // Dodane pole
    },
    {
      id: 2,
      nazwa: "PIERŚCIONEK DIAMENTOWY 585",
      cena: "3500",
      ilosc: 1,
      checked: true,
    },
  ]);

  // FUNKCJA DODAWANIA DO KOSZYKA
  const addToCart = (product) => {
    setProduktyWKoszyku((prev) => {
      // Sprawdzamy czy produkt już jest w koszyku
      const exists = prev.find((p) => p.id === product.id + 100); // +100 aby uniknąć konfliktów ID z sugestii
      if (exists) {
        return prev.map((p) =>
          p.id === product.id + 100 ? { ...p, ilosc: p.ilosc + 1 } : p,
        );
      }
      // Jeśli nie ma, dodajemy nowy obiekt
      return [
        ...prev,
        {
          id: product.id + 100,
          nazwa: product.title,
          cena: product.price,
          ilosc: 1,
          checked: true,
        },
      ];
    });
  };

  // Funkcje do zmiany ilości
  const increment = (id) => {
    setProduktyWKoszyku((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ilosc: p.ilosc + 1 } : p)),
    );
  };

  const decrement = (id) => {
    setProduktyWKoszyku((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ilosc: Math.max(1, p.ilosc - 1) } : p,
      ),
    );
  };

  // Obsługa zaznaczania pojedynczego produktu
  const toggleCheck = (id) => {
    setProduktyWKoszyku((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
    );
  };

  const removeSelected = () => {
    setProduktyWKoszyku((prev) => prev.filter((p) => !p.checked));
  };

  const suggestedProducts = [
    { id: 1, price: "5000", title: "NASZYJNIK KONICZYNA 40 PLATYNA" },
    { id: 2, price: "6600", title: "BRANSOLETKA KRZYŻ 20 CM ŻÓŁTE ZŁOTO" },
    { id: 3, price: "2700", title: "NASZYJNIK GWIAZDKA 30 CM SREBRO" },
    { id: 4, price: "8000", title: "NASZYJNIK SERCE 45 CM RÓŻOWE ZŁOTO" },
  ];

  const sumaProduktow = produktyWKoszyku.reduce(
    (acc, curr) => acc + Number(curr.cena) * curr.ilosc,
    0,
  );
  const kosztDostawy = 14.99;

  return (
    <div className="app-container">
      <Navbar />
      <div className="cart-page-container">
        <div className="cart-layout">
          {/* LEWA STRONA: KOSZYK I PROPOZYCJE */}
          <div className="cart-main">
            <h1 className="cart-heading">Koszyk</h1>
            <div className="white-card shadow">
              <div className="cart-top-bar">
                <label className="star-checkbox">
                  <input
                    type="checkbox"
                    // Checkbox jest zaznaczony tylko wtedy, gdy w koszyku są produkty i WSZYSTKIE mają checked: true
                    checked={
                      produktyWKoszyku.length > 0 &&
                      produktyWKoszyku.every((p) => p.checked)
                    }
                    // Funkcja zmieniająca stan wszystkich produktów na raz
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setProduktyWKoszyku((prev) =>
                        prev.map((p) => ({ ...p, checked: isChecked })),
                      );
                    }}
                  />
                  <span className="star-icon"></span>
                  <div className="star-napis">{"cały koszyk"}</div>
                </label>
                <button className="text-btn" onClick={removeSelected}>
                  USUŃ ZAZNACZONE
                </button>
              </div>

              <div className="delivery-section">
                {/* 3. GENEROWANIE PRODUKTÓW Z LICZNIKAMI */}
                {produktyWKoszyku.map((item) => (
                  <ElementKoszyka
                    key={item.id}
                    produkt={item}
                    naPlus={() => increment(item.id)}
                    naMinus={() => decrement(item.id)}
                    onToggleCheck={() => toggleCheck(item.id)}
                  />
                ))}
              </div>
            </div>

            <h2 className="upsell-heading">Dorzuć do przesyłki!</h2>
            <div className="upsell-grid">
              {/* GENEROWANIE LISTY: Mapujemy tablicę na komponenty */}
              {suggestedProducts.map((item) => (
                <ElementListy key={item.id} product={item} onAdd={addToCart} />
              ))}
            </div>
          </div>

          {/* PRAWA STRONA: PODSUMOWANIE */}
          <div className="cart-sidebar">
            <div className="white-card shadow summary-box">
              <div className="summary-line">
                <span>Wartość produktów</span>
                <span>{sumaProduktow} zł</span>
              </div>

              <div className="summary-line">
                <span>Dostawa od</span>
                {/* Wyświetlamy z przecinkiem dla użytkownika jako tekst */}
                <span>14,99 zł</span>
              </div>

              <hr className="divider-line" />

              <div className="summary-line total-line">
                <span>Razem z dostawą</span>
                <span className="final-price">
                  {/* Dodajemy sumę produktów i koszt dostawy */}
                  {(sumaProduktow + kosztDostawy)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  zł
                </span>
              </div>

              <button className="btn-etoile blue">ZAPŁAĆ PÓŹNIEJ</button>
              <button className="btn-etoile green">DOSTAWA I PŁATNOŚĆ</button>
              <button className="btn-etoile transparent">
                KONTYNUUJ ZAKUPY
              </button>
            </div>

            <div className="white-card shadow protection-box">
              <a href="/" className="protection-img">
                <img src={iconProt} alt="Ochrona" />
              </a>
              <div className="protection-text">
                <strong>Étoile Ochrona Kupujących</strong>
                <p>
                  Wygodne zwroty, reklamacje online oraz 2 lata ochrony zakupu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
