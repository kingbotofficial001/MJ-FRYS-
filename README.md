# MJ FRYS 🍟🔥
### Your Daily Dose of Delicious

A high-tech, modern online food-ordering website for **MJ FRYS** — a street-food spot serving crispy chips, flame-grilled chicken, sausages, smokies, samosas and cold drinks.

Built with pure **HTML + CSS + JavaScript** — no frameworks, no build step, no backend required. Just drop the folder onto any static host (GitHub Pages, Netlify, Vercel, S3, etc.) and it works.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 **Modern dark/neon UI** | Glassmorphism cards, gradient accents, scroll-reveal animations, scroll progress bar |
| 🛒 **Shopping cart** | Add/remove items, quantity controls, persists in `localStorage` |
| 💳 **Online payments** | M-Pesa (STK push simulation) + Cash on Delivery option |
| 🛵 **Delivery ordering** | Flat KSh 100 delivery fee, **FREE over KSh 1,500** |
| 📱 **WhatsApp order confirmation** | One-tap deep link sends the full order to the shop's WhatsApp |
| 📞 **Delivery hotline** | `0734463997` — clickable call + WhatsApp buttons |
| 🖼️ **Real & AI-generated food images** | Bundled locally — no broken external links |
| 📱 **Fully responsive** | Works on mobile, tablet & desktop |
| ⚡ **Lightweight** | Single page, vanilla JS, loads instantly |

---

## 🍽️ Menu & Prices (KES)

| Item | Price | Category |
|---|---|---|
| Chips (Large) | 100 | Chips |
| Chips (Small) | 70 | Chips |
| Full Chicken | 640 | Chicken |
| Half Chicken | 320 | Chicken |
| Quarter Chicken | 160 | Chicken |
| Sausage | 50 | Grill |
| Smokie | 40 | Grill |
| Samosa | 30 | Snacks |
| Soda 300ml | 50 | Drinks |
| Tomato Sauce | 5 | Extras |

---

## 📁 Project Structure

```
mjfrys/
├── index.html          # Single-page site (hero, menu, cart, checkout, footer)
├── css/
│   └── style.css       # All styling — dark/neon/glassmorphism theme
├── js/
│   └── app.js          # Menu rendering, cart, checkout, payments, WhatsApp link
├── images/
│   ├── hero.png        # Hero banner
│   ├── logo.png        # Brand logo
│   ├── chips-large.jpg # Real food photography (Unsplash)
│   ├── chips-small.jpg # Real food photography (Unsplash)
│   ├── chicken-full.png
│   ├── sausage.png
│   ├── smokie.png
│   ├── samosa.png
│   ├── soda.png
│   └── sauce.png
├── README.md           # This file
└── .gitignore
```

---

## 🚀 How to Run Locally

Because the site uses relative image paths, you should serve it over HTTP (not just open the file directly) so images load correctly:

```bash
# Option 1: Python
cd mjfrys
python3 -m http.server 8000
# Open http://localhost:8000

# Option 2: Node (if you have npx)
npx serve mjfrys
```

---

## 🌐 Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `mjfrys`).
2. Push this folder's contents to the `main` branch:

   ```bash
   cd mjfrys
   git init
   git add .
   git commit -m "MJ FRYS website"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/mjfrys.git
   git push -u origin main
   ```

3. In GitHub → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Save.

4. Your site goes live at `https://<YOUR_USERNAME>.github.io/mjfrys/`

> You can also deploy to **Netlify**, **Vercel**, or **Cloudflare Pages** by dragging the `mjfrys` folder into their dashboard — zero config needed.

---

## 🔧 Customisation

All key settings live at the top of `js/app.js`:

```js
const DELIVERY_FEE = 100;          // flat delivery fee in KES
const FREE_DELIVERY_OVER = 1500;   // free delivery threshold
const SHOP_PHONE = '0734463997';   // order / delivery line
const WHATSAPP = '254734463997';   // WhatsApp international format
```

To change menu items, edit the `PRODUCTS` array in the same file. To change colours/fonts, edit the CSS variables at the top of `css/style.css`.

---

## 📞 Contact

- **Delivery / Orders:** 0734463997
- **WhatsApp:** [wa.me/254734463997](https://wa.me/254734463997)

---

© MJ FRYS. Made with 🔥 & ❤️
