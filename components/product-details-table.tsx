import type { ReactElement } from "react"
import type { Product } from "@/lib/data"
import {
  buildProductDetailRows,
  getDetailsCustomText,
} from "@/lib/product-details"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

export interface ProductDetailsTableProps {
  product: Product
}

export function ProductDetailsTable({
  product,
}: ProductDetailsTableProps): ReactElement | null {
  const customText = getDetailsCustomText(product)
  const rows = buildProductDetailRows(product)

  if (!customText && rows.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableBody>
          {customText ? (
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableCell
                colSpan={2}
                className="whitespace-pre-wrap py-4 text-sm leading-relaxed"
              >
                {customText}
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="w-[38%] border-r bg-muted/20 py-3.5 pl-4 pr-3 font-medium text-foreground">
                {row.label}
              </TableCell>
              <TableCell className="whitespace-pre-wrap py-3.5 pr-4 text-muted-foreground">
                {row.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
