const CATEGORIES = [
  { id: "electronics", name: "إلكترونيات", icon: "📱", count: 24 },
  { id: "fashion", name: "أزياء", icon: "👕", count: 32 },
  { id: "home", name: "المنزل والمطبخ", icon: "🏠", count: 18 },
  { id: "beauty", name: "العناية والجمال", icon: "💄", count: 21 },
  { id: "sports", name: "رياضة", icon: "⚽", count: 14 },
  { id: "toys", name: "ألعاب وأطفال", icon: "🧸", count: 16 },
  { id: "groceries", name: "بقالة", icon: "🛒", count: 28 },
  { id: "books", name: "كتب وأدوات مكتبية", icon: "📚", count: 12 },
];

const PRODUCTS = [
  {
    id: 1, name: "سماعة لاسلكية بلوتوث 5.3 مع عزل الضوضاء",
    category: "electronics", price: 899, oldPrice: 1299, rating: 4.8, reviews: 342,
    stock: 45, tag: "sale", desc: "سماعة أذن لاسلكية بتقنية بلوتوث 5.3، صوت نقي مع خاصية عزل الضوضاء النشط ANC، وبطارية تدوم حتى 30 ساعة.",
    options: { "اللون": ["أسود", "أبيض", "أزرق"], "المقاس": ["قياسي"] },
    images: ["https://picsum.photos/seed/headphone1/800/800", "https://picsum.photos/seed/headphone2/800/800", "https://picsum.photos/seed/headphone3/800/800"],
    flash: true,
  },
  {
    id: 2, name: "ساعة ذكية بشاشة AMOLED وقياس نبض القلب",
    category: "electronics", price: 1499, oldPrice: 0, rating: 4.6, reviews: 218,
    stock: 3, tag: "new", desc: "ساعة ذكية بشاشة AMOLED فائقة الوضوح، تتبع النشاط الرياضي والنوم وقياس نبض القلب والأكسجين.",
    options: { "اللون": ["فضي", "ذهبي"], "المقاس": ["42mm", "46mm"] },
    images: ["https://picsum.photos/seed/watch1/800/800", "https://picsum.photos/seed/watch2/800/800"],
    flash: false,
  },
  {
    id: 3, name: "حذاء رياضي خفيف للمشي والجري",
    category: "fashion", price: 1150, oldPrice: 1500, rating: 4.5, reviews: 176,
    stock: 25, tag: "sale", desc: "حذاء رياضي مريح وخفيف الوزن بنعل مرن يمتص الصدمات، مناسب للجري والمشي اليومي.",
    options: { "المقاس": ["40", "41", "42", "43", "44"], "اللون": ["أسود", "رمادي"] },
    images: ["https://picsum.photos/seed/shoes1/800/800", "https://picsum.photos/seed/shoes2/800/800"],
    flash: true,
  },
  {
    id: 4, name: "باور بانك 20000mAh شحن سريع 33W",
    category: "electronics", price: 699, oldPrice: 950, rating: 4.7, reviews: 421,
    stock: 0, tag: "sale", desc: "باور بانك بسعة 20000 مللي أمبير مع شحن سريع بقوة 33 واط ومنفذين USB، وشاشة رقمية تعرض النسبة.",
    options: { "اللون": ["أسود", "أبيض"] },
    images: ["https://picsum.photos/seed/powerbank1/800/800"],
    flash: false,
  },
  {
    id: 5, name: "ماكينة قهوة إسبريسو أوتوماتيك",
    category: "home", price: 4200, oldPrice: 5200, rating: 4.9, reviews: 89,
    stock: 8, tag: "new", desc: "ماكينة إسبريسو أوتوماتيك بضغط 20 بار، مع رغوة حليب مدمجة وبرامج تحضير متعددة.",
    options: { "اللون": ["أسود", "ستانلس"] },
    images: ["https://picsum.photos/seed/coffee1/800/800", "https://picsum.photos/seed/coffee2/800/800"],
    flash: false,
  },
  {
    id: 6, name: "طقم حافظات طعام زجاجية مقاومة للحرارة",
    category: "home", price: 380, oldPrice: 0, rating: 4.4, reviews: 132,
    stock: 40, tag: "", desc: "طقم 5 حافظات زجاجية بأغطية محكمة الغلق، مناسبة للفرن والميكروويف وغسالة الأطباق.",
    options: { "المقاس": ["طقم 5 قطع", "طقم 9 قطع"] },
    images: ["https://picsum.photos/seed/container1/800/800"],
    flash: false,
  },
  {
    id: 7, name: "كريم مرطب للبشرة بفيتامين سي",
    category: "beauty", price: 240, oldPrice: 320, rating: 4.3, reviews: 96,
    stock: 60, tag: "sale", desc: "كريم مرطب يومي بفيتامين سي يعزز نضارة البشرة ويوحّد لونها ويحميها من الجفاف.",
    options: { "الحجم": ["50ml", "100ml"] },
    images: ["https://picsum.photos/seed/cream1/800/800"],
    flash: true,
  },
  {
    id: 8, name: "مكمل بروتين مصل الحليب - شوكولاتة 2كجم",
    category: "sports", price: 1650, oldPrice: 1900, rating: 4.7, reviews: 254,
    stock: 15, tag: "", desc: "مكمل بروتين واي عالي الجودة بنكهة الشوكولاتة، 24 جرام بروتين لكل سكوب لبناء العضلات.",
    options: { "النكهة": ["شوكولاتة", "فانيليا", "فراولة"] },
    images: ["https://picsum.photos/seed/protein1/800/800"],
    flash: false,
  },
  {
    id: 9, name: "قاعدة شحن لاسلكي 15W",
    category: "electronics", price: 349, oldPrice: 450, rating: 4.2, reviews: 154,
    stock: 33, tag: "sale", desc: "قاعدة شحن لاسلكي سريع بقوة 15 واط متوافقة مع جميع الهواتف الداعمة لشحن Qi.",
    options: { "اللون": ["أسود", "أبيض"] },
    images: ["https://picsum.photos/seed/charger1/800/800"],
    flash: true,
  },
  {
    id: 10, name: "بلوزة قطنية مريحة",
    category: "fashion", price: 250, oldPrice: 0, rating: 4.1, reviews: 67,
    stock: 50, tag: "new", desc: "بلوزة قطنية ناعمة بخامة مريحة، متوفرة بألوان متعددة، مثالية للاستخدام اليومي.",
    options: { "المقاس": ["S", "M", "L", "XL"], "اللون": ["بيج", "أسود", "كحلي"] },
    images: ["https://picsum.photos/seed/shirt1/800/800", "https://picsum.photos/seed/shirt2/800/800"],
    flash: false,
  },
  {
    id: 11, name: "لعبة بناء مكعبات تعليمية للأطفال",
    category: "toys", price: 450, oldPrice: 600, rating: 4.8, reviews: 189,
    stock: 22, tag: "sale", desc: "مكعبات بناء تعليمية ملونة تنمي مهارات الطفل الإبداعية والحركية، مصنوعة من مواد آمنة.",
    options: { "عدد القطع": ["100", "300", "600"] },
    images: ["https://picsum.photos/seed/lego1/800/800"],
    flash: false,
  },
  {
    id: 12, name: "أرز بسمتي هندي فاخر 5 كجم",
    category: "groceries", price: 420, oldPrice: 500, rating: 4.6, reviews: 310,
    stock: 120, tag: "", desc: "أرز بسمتي هندي فاخر حبة طويلة، رائحة عطرية وطعم مميز للحساء والمضغوط.",
    options: { "الوزن": ["1 كجم", "5 كجم", "10 كجم"] },
    images: ["https://picsum.photos/seed/rice1/800/800"],
    flash: true,
  },
  {
    id: 13, name: "شاحن سيارة سريع USB-C 45W",
    category: "electronics", price: 320, oldPrice: 0, rating: 4.5, reviews: 78,
    stock: 4, tag: "new", desc: "شاحن سيارة بقوة 45 واط ومنفذين USB-C و USB-A للشحن السريع أثناء القيادة.",
    options: { "اللون": ["أسود"] },
    images: ["https://picsum.photos/seed/carcharger1/800/800"],
    flash: false,
  },
  {
    id: 14, name: "وسادة رقبة سفر قابلة للنفخ",
    category: "fashion", price: 180, oldPrice: 260, rating: 4.0, reviews: 45,
    stock: 80, tag: "sale", desc: "وسادة رقبة قابلة للنفخ مريحة للسفر، خفيفة وصغيرة الحجم عند الطي.",
    options: { "اللون": ["رمادي", "أزرق"] },
    images: ["https://picsum.photos/seed/pillow1/800/800"],
    flash: false,
  },
  {
    id: 15, name: "مجموعة أقلام ماركر فنية 60 لون",
    category: "books", price: 550, oldPrice: 700, rating: 4.7, reviews: 143,
    stock: 35, tag: "", desc: "مجموعة أقلام ماركر فنية 60 لون متنوعة لتلوين الرسومات والكُتب المخصصة.",
    options: { "عدد الألوان": ["24", "36", "60"] },
    images: ["https://picsum.photos/seed/markers1/800/800"],
    flash: false,
  },
  {
    id: 16, name: "زيت زيتون بكر ممتاز 3 لتر",
    category: "groceries", price: 520, oldPrice: 0, rating: 4.9, reviews: 412,
    stock: 90, tag: "", desc: "زيت زيتون بكر ممتاز عصرة أولى، مثالي للسلطات والطبخ اليومي.",
    options: { "الحجم": ["1 لتر", "3 لتر"] },
    images: ["https://picsum.photos/seed/olive1/800/800"],
    flash: false,
  },
];

const COUPONS = {
  "WELCOME10": { type: "percent", value: 10, min: 500 },
  "SAVE50": { type: "fixed", value: 50, min: 300 },
  "FLASH25": { type: "percent", value: 25, min: 0 },
};

const SITE_NAME = "دارك ستور";
const SITE_TAGLINE = "كل اللي محتاجه في مكان واحد — توصيل سريع وأسعار لا تقبل المنافسة";

function formatPrice(n) {
  return n.toLocaleString("ar-EG") + " ج.م";
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function productCard(p) {
  const off = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const badge =
    p.tag === "sale" && off
      ? `<span class="product-badge badge-off">-${off}%</span>`
      : p.tag === "new"
      ? `<span class="product-badge badge-new">جديد</span>`
      : "";
  return `
  <div class="product-card">
    <a href="product.html?id=${p.id}" class="product-media">
      ${badge}
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
    </a>
    <button class="product-wish" data-id="${p.id}" aria-label="أضف للمفضلة">♡</button>
    <div class="product-body">
      <span class="product-cat">${getCategory(p.category)?.name || ""}</span>
      <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
      <div class="product-rating">★ <span>${p.rating} (${p.reviews})</span></div>
      <div class="product-price">
        <span class="price-now">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
      </div>
      <div class="product-foot">
        <button class="btn btn-primary add-to-cart" data-id="${p.id}">أضف للسلة</button>
      </div>
    </div>
  </div>`;
}
