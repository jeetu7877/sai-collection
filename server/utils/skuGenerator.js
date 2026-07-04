// Generates a readable SKU e.g. SHRT-BLU-M-4821
const generateSKU = (type, color, size) => {
  const typeCode = type.substring(0, 4).toUpperCase();
  const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${typeCode}-${colorCode}-${sizeCode}-${random}`;
};

const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MSP${y}${m}${d}${random}`;
};

module.exports = { generateSKU, generateOrderNumber };
