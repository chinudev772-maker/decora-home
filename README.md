# DECORA HOME

A premium home decor storefront built with plain HTML, CSS and JavaScript. There is no build step, no framework and no backend.

## How to open it (Windows)

1. Open the `DecoraHome` folder in File Explorer.
2. Double-click `index.html`. It opens in your default browser (Chrome, Edge or Firefox).

That is all. You need an internet connection, because the photos come from Unsplash and the fonts from Google Fonts.

If you prefer a local server (optional), open a terminal in this folder and run:

```bash
python -m http.server 8124
```

Then visit <http://localhost:8124>.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The page structure: header, hero, sections, footer and the dialogs (product details, cart, wishlist, checkout). |
| `style.css` | All styling. Colours, fonts and spacing are variables at the top under "Design tokens". |
| `script.js` | The product list and all behaviour. |
| `README.md` | This file. |

## Features

- Announcement bar, sticky header and a mobile menu.
- Hero banner, seven category tiles, Featured, Best Sellers and New Arrivals sections, a promotional banner, customer reviews, a newsletter form and a full footer.
- 28 products with photos, descriptions, prices in rupees, categories and ratings.
- Product search (matches name, category and description).
- Category filter, including a "Decor" group that shows Vases, Wall Art and Plants together.
- Sorting by price (both directions) and by popularity.
- Product details window with a quantity picker.
- Cart: add, remove, change quantity, with subtotal, shipping and total worked out automatically. Shipping is free above ₹999 and ₹99 otherwise.
- Wishlist: add, remove and move to cart.
- Cart and wishlist are saved in the browser's LocalStorage, so they survive a page reload.
- Empty states for the cart, the wishlist and a search with no results.
- Newsletter and checkout forms with validation and a message under each field that needs fixing.
- A placeholder is shown in place of any photo that fails to load.
- Responsive layout for desktop, laptop, tablet and phone, with keyboard support and reduced-motion support.

### About the checkout

The checkout is a **demo** and is labelled as one on screen. It has no payment fields, places no order and sends nothing anywhere. Submitting a valid form shows a confirmation and empties the cart. The newsletter form is also a demo and stores no email address.

## How to customise products

Open `script.js`. Everything you need is in section 1, "Catalogue data".

### Change or add a product

Each product is one entry in the `PRODUCTS` list:

```js
{ id: 29, name: 'Marble Side Table', category: 'Living Room', price: 5999, rating: 4.6, reviews: 80, tags: ['new'],
  image: photo('1581428982868-e410dd047a90'),
  description: 'A round marble top on a slim metal base.' },
```

- `id` must be a number that no other product uses.
- `category` must match one of the names in the `CATEGORIES` list.
- `price` is in rupees, with no commas.
- `reviews` is the number of reviews. "Most Popular" sorts by it.
- `tags` decides which homepage section shows the product: `'featured'`, `'best'` (Best Sellers) or `'new'` (New Arrivals). Use `[]` for none.
- `image` can be `photo('an-unsplash-photo-id')`, any full image address, or a local file such as `'images/table.jpg'`.

### Change categories

- `CATEGORIES` holds the seven tiles on the homepage, each with a name and a photo.
- `GROUPS` holds filters that cover several categories at once, such as `Decor`.

### Change shipping

`FREE_SHIPPING_ABOVE`, `SHIPPING_FEE` and `MAX_QTY` are at the top of section 1. If you change the free-shipping amount, also update the announcement bar text in `index.html`.

### Change colours and fonts

Edit the variables under `:root` at the top of `style.css`. The brand palette is:

| Use | Colour |
| --- | --- |
| Background | `#F8F6F3` |
| Primary beige | `#C89B6D` |
| Dark brown | `#5C4033` |
| Main text | `#25211E` |
| White | `#FFFFFF` |

## Checking your changes

Open `index.html?selfcheck` and look at the browser console (press F12). It runs a short set of checks on the cart totals, the filters and the product list, and reports anything that fails. It will tell you, for example, if two products share an id or a product has a category that does not exist.

To empty the saved cart and wishlist, run `localStorage.clear()` in the console and reload.

## Credits and notes

- Photos are loaded directly from [Unsplash](https://unsplash.com) and are free to use under the [Unsplash License](https://unsplash.com/license). The photo id of each image is in `script.js` and `index.html`.
- Fonts are Playfair Display and Poppins from Google Fonts (SIL Open Font License).
- Icons are inline SVG drawn for this project, so there is no icon library to load.
- The brand, product names, prices, reviews, address, phone number and email are made up for the demo.
- The page uses the native `<dialog>` element and the Popover API, which need a browser from 2024 or later.
