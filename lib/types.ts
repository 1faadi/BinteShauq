export type Product = {
  slug: string
  title: string
  price: number // in smallest currency unit PKR (we'll show formatted)
  collection: "blossom" | "linear" | "flora"
  description: string
  images: string[]
  newArrival?: boolean
}
