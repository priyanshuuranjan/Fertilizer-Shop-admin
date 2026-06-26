import PDFDocument from "pdfkit";
import orderModel from "../models/orderModel.js";

const DELIVERY_FEE = 45;
const BRAND = "Kumar Fertilizer Shop";

// Streams a printable PDF invoice for a single order straight to the response.
const downloadInvoice = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${order._id}.pdf"`
    );
    doc.pipe(res);

    // ---- Header ----
    doc.fontSize(22).fillColor("#1a7431").text(BRAND, { align: "left" });
    doc.fontSize(10).fillColor("#666").text("Tax Invoice / Receipt");
    doc.moveDown(1);

    // ---- Order meta ----
    const addr = order.address || {};
    const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    doc.fillColor("#000").fontSize(10);
    doc.text(`Invoice No: ${order._id}`);
    doc.text(`Date: ${orderDate}`);
    doc.text(`Payment: ${order.payment ? "Paid" : "Pending"}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown(0.8);

    doc.fontSize(11).fillColor("#1a7431").text("Bill To:");
    doc.fontSize(10).fillColor("#000");
    doc.text(`${addr.firstName || ""} ${addr.lastName || ""}`.trim());
    if (addr.street) doc.text(addr.street);
    doc.text(
      [addr.city, addr.state, addr.zipcode].filter(Boolean).join(", ")
    );
    if (addr.phone) doc.text(`Phone: ${addr.phone}`);
    if (addr.email) doc.text(`Email: ${addr.email}`);
    doc.moveDown(1);

    // ---- Items table ----
    const tableTop = doc.y;
    const colX = { item: 50, qty: 320, price: 390, total: 470 };

    doc.fontSize(10).fillColor("#fff");
    doc.rect(50, tableTop - 4, 500, 20).fill("#1a7431");
    doc.fillColor("#fff");
    doc.text("Item", colX.item + 4, tableTop);
    doc.text("Qty", colX.qty, tableTop);
    doc.text("Price", colX.price, tableTop);
    doc.text("Amount", colX.total, tableTop);

    let y = tableTop + 24;
    let subtotal = 0;
    doc.fillColor("#000");
    (order.items || []).forEach((item) => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      doc.text(item.name, colX.item + 4, y, { width: 260 });
      doc.text(String(item.quantity), colX.qty, y);
      doc.text(`Rs.${item.price}`, colX.price, y);
      doc.text(`Rs.${lineTotal}`, colX.total, y);
      y += 22;
    });

    // ---- Totals ----
    y += 6;
    doc.moveTo(50, y).lineTo(550, y).strokeColor("#ddd").stroke();
    y += 10;

    const rightLabel = (label, value, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(10);
      doc.text(label, 360, y);
      doc.text(value, colX.total, y);
      y += 18;
    };

    rightLabel("Subtotal", `Rs.${subtotal}`);
    rightLabel("Delivery Fee", `Rs.${DELIVERY_FEE}`);
    if (order.discount > 0) {
      rightLabel(`Discount (${order.promoCode || "promo"})`, `- Rs.${order.discount}`);
    }
    rightLabel("Grand Total", `Rs.${order.amount}`, true);

    // ---- Footer ----
    doc.font("Helvetica").fontSize(9).fillColor("#999");
    doc.text(
      "Thank you for shopping with us! This is a computer-generated invoice.",
      50,
      760,
      { align: "center", width: 500 }
    );

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export { downloadInvoice };
