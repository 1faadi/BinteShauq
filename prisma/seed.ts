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
      name: "Bloosom Mid-Night",
      slug: "blossom-mid-night",
      collection: "blossom",
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
