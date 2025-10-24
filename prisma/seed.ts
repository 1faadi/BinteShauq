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
      name: "Flora Deep Tones",
      slug: "flora-deep-tones",
      collection: "flora",
      price: 8290,
      images: ["/flora-shawl-1.jpg", "/flora-shawl-2.jpg", "/flora-shawl-3.jpg"],
      description: "Deep floral tones with subtle sheen and stitched edge finishing.",
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
      name: "Linear Contemporary",
      slug: "linear-contemporary",
      collection: "linear",
      price: 8990,
      images: ["/linear-shawl-1.jpg", "/linear-shawl-2.jpg", "/linear-shawl-3.jpg"],
      description: "Contemporary linear designs with clean geometric patterns and modern elegance.",
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
