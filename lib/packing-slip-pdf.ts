import { existsSync } from "fs"
import path from "path"
import PDFDocument from "pdfkit"

export interface PackingSlipProductLine {
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface PackingSlipOrderPayload {
  orderId: string
  orderCreatedAt: Date
  currencyLabel: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  notes: string | null
  lines: PackingSlipProductLine[]
  orderTotal: number
}

export interface PackingSlipBrandPayload {
  storeName: string
  storePhone: string | null
  storeEmail: string | null
  storeAddress: string | null
}

const LOGO_FILENAME = "PHOTO-2025-10-02-00-42-10.jpg"
const BRAND_LINE = "Bint-e-Shauq"

function resolveLogoPath(): string | null {
  const logoPath = path.join(process.cwd(), "public", LOGO_FILENAME)
  if (!existsSync(logoPath)) return null
  return logoPath
}

function formatMoney(amount: number, currencyLabel: string): string {
  return `${currencyLabel} ${amount.toLocaleString("en-PK")}`
}

export function buildPackingSlipDisclaimer(brand: PackingSlipBrandPayload): string {
  const contactHint =
    brand.storeEmail !== null && brand.storeEmail !== ""
      ? brand.storeEmail
      : brand.storePhone !== null && brand.storePhone !== ""
        ? brand.storePhone
        : "the contact details on your order confirmation"
  return (
    `Delivery packing slip — Please verify all items before accepting the parcel. ` +
    `For exchanges, defects, or questions, reach out via ${contactHint}. ` +
    `Thank you for shopping with ${brand.storeName} (${BRAND_LINE}).`
  )
}

function drawHeader(
  doc: InstanceType<typeof PDFDocument>,
  brand: PackingSlipBrandPayload,
  order: PackingSlipOrderPayload,
  logoPath: string | null,
  contentLeft: number,
  contentWidth: number,
): number {
  const top = doc.page.margins.top
  let cursorY = top

  if (logoPath !== null) {
    doc.image(logoPath, contentLeft, cursorY, { width: 46, height: 46 })
  }

  const textX = logoPath !== null ? contentLeft + 54 : contentLeft
  doc.fillColor("#111").font("Helvetica-Bold").fontSize(15).text(brand.storeName, textX, cursorY, {
    continued: false,
  })
  doc.font("Helvetica").fontSize(9).fillColor("#444444").text(BRAND_LINE, textX, cursorY + 17)
  doc.font("Helvetica").fontSize(8).fillColor("#666666").text("Packing slip / delivery receipt", textX, cursorY + 30)

  const orderLabel = `Order #${order.orderId.slice(-8).toUpperCase()}`
  const dateLabel = new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(order.orderCreatedAt)

  doc.font("Helvetica-Bold").fontSize(11).fillColor("#111111").text(orderLabel, contentLeft, cursorY, {
    align: "right",
    width: contentWidth,
  })
  doc.font("Helvetica").fontSize(9).fillColor("#444444").text(dateLabel, contentLeft, cursorY + 14, {
    align: "right",
    width: contentWidth,
  })

  return cursorY + 58
}

function drawShipBlock(
  doc: InstanceType<typeof PDFDocument>,
  order: PackingSlipOrderPayload,
  contentLeft: number,
  contentWidth: number,
  startY: number,
): number {
  let y = startY
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#111111").text("Deliver to", contentLeft, y)
  y += 14
  doc.font("Helvetica-Bold").fontSize(10).text(order.customerName || "Customer", contentLeft, y, {
    width: contentWidth * 0.55,
  })
  y += 13
  doc.font("Helvetica").fontSize(9).fillColor("#333333").text(order.customerEmail, contentLeft, y, {
    width: contentWidth * 0.55,
  })
  y += 12
  doc.text(`Phone: ${order.customerPhone !== "" ? order.customerPhone : "—"}`, contentLeft, y, {
    width: contentWidth * 0.55,
  })
  y += 14
  doc.font("Helvetica-Bold").fontSize(9).text("Shipping address", contentLeft, y)
  y += 11
  doc.font("Helvetica").fontSize(9).text(order.shippingAddress, contentLeft, y, {
    width: contentWidth * 0.52,
    align: "left",
  })
  const addrHeight = doc.heightOfString(order.shippingAddress, {
    width: contentWidth * 0.52,
  })
  y += addrHeight + 8

  if (order.notes !== null && order.notes.trim() !== "") {
    doc.font("Helvetica-Bold").fontSize(9).text("Order notes", contentLeft, y)
    y += 11
    doc.font("Helvetica").fontSize(8).fillColor("#444444").text(order.notes.trim(), contentLeft, y, {
      width: contentWidth * 0.52,
    })
    y += doc.heightOfString(order.notes.trim(), { width: contentWidth * 0.52 }) + 10
  }

  return y
}

function drawItemsTable(
  doc: InstanceType<typeof PDFDocument>,
  order: PackingSlipOrderPayload,
  contentLeft: number,
  contentWidth: number,
  startY: number,
): number {
  const xItem = contentLeft
  const xQty = contentLeft + contentWidth * 0.58
  const xUnit = contentLeft + contentWidth * 0.68
  const xLine = contentLeft + contentWidth * 0.82
  const itemTextWidth = contentWidth * 0.54
  let y = startY

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#111111")
  doc.text("Item", xItem, y)
  doc.text("Qty", xQty, y)
  doc.text("Unit", xUnit, y)
  doc.text("Line", xLine, y)
  y += 14
  doc.moveTo(xItem, y).lineTo(contentLeft + contentWidth, y).strokeColor("#cccccc").stroke()
  y += 8

  doc.font("Helvetica").fontSize(9).fillColor("#222222")
  for (const line of order.lines) {
    doc.text(line.name, xItem, y, { width: itemTextWidth })
    const nameH = Math.max(
      14,
      doc.heightOfString(line.name, { width: itemTextWidth }),
    )
    doc.text(String(line.quantity), xQty, y)
    doc.text(formatMoney(line.unitPrice, order.currencyLabel), xUnit, y)
    doc.text(formatMoney(line.lineTotal, order.currencyLabel), xLine, y)
    y += nameH + 4
  }

  y += 6
  doc.moveTo(xItem, y).lineTo(contentLeft + contentWidth, y).strokeColor("#999999").stroke()
  y += 10
  doc.font("Helvetica-Bold").fontSize(11).text("Order total", xUnit - 20, y)
  doc.text(formatMoney(order.orderTotal, order.currencyLabel), xLine, y)

  return y + 22
}

function drawBrandFooter(
  doc: InstanceType<typeof PDFDocument>,
  brand: PackingSlipBrandPayload,
  disclaimer: string,
  contentLeft: number,
  contentWidth: number,
  pageBottom: number,
): void {
  let block = ""
  if (brand.storeAddress !== null && brand.storeAddress.trim() !== "") {
    block += `Location: ${brand.storeAddress.trim()}\n`
  }
  if (brand.storePhone !== null && brand.storePhone.trim() !== "") {
    block += `Tel: ${brand.storePhone.trim()}`
    if (brand.storeEmail !== null && brand.storeEmail.trim() !== "") {
      block += `  ·  ${brand.storeEmail.trim()}`
    }
  } else if (brand.storeEmail !== null && brand.storeEmail.trim() !== "") {
    block += brand.storeEmail.trim()
  }

  const footerTop = pageBottom - 68
  doc.font("Helvetica").fontSize(8).fillColor("#555555").text(block.trim(), contentLeft, footerTop, {
    width: contentWidth,
  })

  doc.font("Helvetica").fontSize(7).fillColor("#666666").text(disclaimer, contentLeft, footerTop + 22, {
    width: contentWidth,
    align: "left",
  })
}

function renderSlip(
  doc: InstanceType<typeof PDFDocument>,
  order: PackingSlipOrderPayload,
  brand: PackingSlipBrandPayload,
): void {
  const contentLeft = doc.page.margins.left
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const pageBottom = doc.page.height - doc.page.margins.bottom
  const logoPath = resolveLogoPath()

  let y = drawHeader(doc, brand, order, logoPath, contentLeft, contentWidth)
  y = drawShipBlock(doc, order, contentLeft, contentWidth, y)
  y = drawItemsTable(doc, order, contentLeft, contentWidth, y + 6)

  const disclaimer = buildPackingSlipDisclaimer(brand)
  drawBrandFooter(doc, brand, disclaimer, contentLeft, contentWidth, pageBottom)
}

export async function generatePackingSlipPdfBuffer(
  order: PackingSlipOrderPayload,
  brand: PackingSlipBrandPayload,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 44,
      info: {
        Title: `Packing slip ${order.orderId.slice(-8)}`,
        Author: brand.storeName,
      },
    })

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk)
    })
    doc.on("error", reject)
    doc.on("end", () => {
      resolve(Buffer.concat(chunks))
    })

    try {
      renderSlip(doc, order, brand)
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)))
      return
    }
    doc.end()
  })
}
