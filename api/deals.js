export default function handler(req, res) {
  const deals = Array.from({length: 20}, (_, i) => ({
    name_fr: `Produit en liquidation ${i+1}`,
    name_en: `Clearance Product ${i+1}`,
    price: (Math.random()*100+10).toFixed(2),
    image: `https://via.placeholder.com/200x150.png?text=Product+${i+1}`
  }));
  res.status(200).json(deals);
}