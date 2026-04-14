# Lynx Pet Shop - Frontend

React + Tailwind CSS frontend for Lynx Pet Shop marketplace.

## Setup

1. Install dependencies:
```
npm install
```

2. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ADMIN_EMAIL=admin@lynxpetshop.com
```

3. Start the development server:
```
npm start
```

## Project Structure

```
src/
├── App.js                    # Root component + routes
├── index.js                  # Entry point
├── index.css                 # Global styles
├── App.css                   # App-level styles
├── contexts/
│   └── AuthContext.js        # Auth state, login, logout, isAdmin
├── components/
│   └── Header.js             # Navbar with role-based nav links
├── constants/
│   └── seedData.js           # Empty arrays (data comes from API)
└── pages/
    ├── Home.js               # Landing page with hero, categories
    ├── Login.js              # Login form → POST /auth/login
    ├── Register.js           # Register form → POST /auth/register
    ├── Cart.js               # Local cart view
    ├── Checkout.js           # Address selection + order placement
    ├── Orders.js             # User order history
    ├── Profile.js            # User profile display
    ├── Admin.js              # Admin panel route wrapper
    ├── admin/
    │   ├── AdminDashboard.jsx # Admin homepage stats
    │   ├── AdminLayout.jsx    # Admin layout + sidebar
    │   ├── AdminOrders.jsx    # Manage orders
    │   ├── AdminProducts.jsx  # Manage products
    │   ├── AdminPets.jsx      # Manage pets
    │   ├── AdminPetTypes.jsx  # Manage pet types
    │   └── AdminCategories.jsx# Manage categories
    ├── Categories.js         # Category management (admin)
    ├── PetTypes.js           # Pet type management (admin)
    ├── ProductsPage.jsx      # Product listing with filters
    ├── ProductDetailPage.jsx # Product detail + variants
    ├── PetsPage.jsx          # Pet listing with filters
    └── PetDetailPage.jsx     # Pet detail + add to cart
```

## API
Backend: FastAPI running at REACT_APP_API_URL
Admin credentials: admin@lynxpetshop.com (set via Swagger/DB)

## Known Issues to Fix
See previous audit for full list. Key issues:
- AuthContext: Admin detection needs /profile endpoint or role in JWT
- ProductsPage: Fetches only when 1 category selected (should fetch all on mount)
- PetsPage: Uses full URL instead of relative path (double URL bug)
- Categories/PetTypes: Still use old CSS classes (need Tailwind rewrite)
- Checkout: Order payload maps product_id instead of product_variant_id
