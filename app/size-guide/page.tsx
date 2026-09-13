import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { BRAND_NAME } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: `Size Guide | ${BRAND_NAME}`,
    description:
      "Bint-e-Shauq size guide for S, M, and L — bust, waist, and hip measurements in inches and centimetres.",
    path: "/size-guide",
  })
}

const ROWS: { size: string; bustIn: string; waistIn: string; hipIn: string; bustCm: string; waistCm: string; hipCm: string }[] = [
  {
    size: "S",
    bustIn: "34–35",
    waistIn: "26–27",
    hipIn: "36–37",
    bustCm: "86–89",
    waistCm: "66–69",
    hipCm: "91–94",
  },
  {
    size: "M",
    bustIn: "36–37",
    waistIn: "28–29",
    hipIn: "38–39",
    bustCm: "91–94",
    waistCm: "71–74",
    hipCm: "97–99",
  },
  {
    size: "L",
    bustIn: "38–40",
    waistIn: "30–32",
    hipIn: "40–42",
    bustCm: "97–102",
    waistCm: "76–81",
    hipCm: "102–107",
  },
]

export default function SizeGuidePage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <p className="text-sm text-muted-foreground mb-4 tracking-wide uppercase">Fit</p>
        <h1 className="text-3xl md:text-5xl font-light mb-4 tracking-tight">Size Guide</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Use these body measurements as a guide for stitched pieces. If you are between sizes,
          we recommend sizing up for comfort.
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <caption className="sr-only">
            Size chart for S, M, and L in inches and centimetres
          </caption>
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Size
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Bust (in)
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Waist (in)
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Hip (in)
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Bust (cm)
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Waist (cm)
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Hip (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.size} className="border-t">
                <th scope="row" className="px-4 py-3 font-semibold">
                  {row.size}
                </th>
                <td className="px-4 py-3">{row.bustIn}</td>
                <td className="px-4 py-3">{row.waistIn}</td>
                <td className="px-4 py-3">{row.hipIn}</td>
                <td className="px-4 py-3">{row.bustCm}</td>
                <td className="px-4 py-3">{row.waistCm}</td>
                <td className="px-4 py-3">{row.hipCm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Need help choosing a size?{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:text-foreground">
          Contact us
        </Link>
        .
      </p>
    </div>
  )
}
