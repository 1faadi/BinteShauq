import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create products
  const products = [
    {
      id: "p1",
      name: "Bloosom Beige",
      slug: "blossom-beige",
      collection: "blossom",
      price: 7990,
      images: ["/shawl-front.jpg", "/shawl-detail.jpg", "/shawl-back.jpg"],
      description: "A soft beige karandi shawl with understated floral motifs and timeless drape.",
    },
    {
      id: "p2",
      name: "Flora Deep Night",
      slug: "flora-deep-night",
      collection: "flora",
      price: 8290,
      images: ["/midnight-shawl-1.jpg", "/midnight-shawl-2.jpg", "/midnight-shawl-3.jpg"],
      description: "Deep midnight tones with subtle sheen and stitched edge finishing.",
    },
    {
      id: "p3",
      name: "Bloosom Moon-Light",
      slug: "blossom-moon-light",
      collection: "blossom",
      price: 8290,
      images: ["/moonlight-shawl-1.jpg", "/moonlight-shawl-2.jpg", "/moonlight-shawl-3.jpg"],
      description: "Silvery moonlight palette with featherweight warmth for winter evenings.",
    },
    {
      id: "p4",
      name: "Flora Elegant",
      slug: "flora-elegant",
      collection: "flora",
      price: 8500,
      images: ["/flora-shawl-1.jpg", "/flora-shawl-2.jpg"],
      description: "Elegant flora collection with intricate botanical patterns.",
    },
    {
      id: "p5",
      name: "Lineae Classic",
      slug: "lineae-classic",
      collection: "lineae",
      price: 8200,
      images: ["/lineae-shawl-1.jpg", "/lineae-shawl-2.jpg"],
      description: "Classic lineae design with clean geometric patterns.",
    },
    {
      id: "p6",
      name: "Lineae Modern",
      slug: "lineae-modern",
      collection: "lineae",
      price: 8400,
      images: ["/lineae-modern-1.jpg", "/lineae-modern-2.jpg"],
      description: "Modern lineae style with contemporary elegance.",
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
