const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Generates a GST invoice PDF for an order and saves it to /uploads/invoices
const generateInvoice = (order, customer) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, "..", "uploads", "invoices");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${order.orderNumber}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc
      .fontSize(20)
      .fillColor("#ff6b00")
      .text("MenStyle Pro", { align: "left" })
      .fontSize(10)
      .fillColor("#333")
      .text("GST Invoice", { align: "left" })
      .moveDown();

    doc
      .fontSize(10)
      .text(`Invoice No: ${order.orderNumber}`)
      .text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`)
      .text(`Customer: ${customer.name}`)
      .text(`Email: ${customer.email}`)
      .moveDown();

    doc.fontSize(11).text("Items:", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc
        .fontSize(10)
        .text(
          `${item.name}  |  Size: ${item.size}  Color: ${item.color}  x${item.quantity}  @ ₹${item.price} = ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
        );
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`);
    if (order.discount) doc.text(`Discount: -₹${order.discount.toFixed(2)}`);
    doc.text(`GST (${order.gstRate}%): ₹${order.gstAmount.toFixed(2)}`);
    doc.fontSize(13).fillColor("#ff6b00").text(`Total: ₹${order.total.toFixed(2)}`, { underline: true });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#777").text("Thank you for shopping with MenStyle Pro!", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(`/uploads/invoices/${order.orderNumber}.pdf`));
    stream.on("error", reject);
  });
};

module.exports = generateInvoice;
