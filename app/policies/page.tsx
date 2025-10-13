import { Card } from "@/components/ui/card"

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <p className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide uppercase">
          Customer Information
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
          Policies & Guidelines
        </h1>
        <div className="h-px bg-border max-w-xs mx-auto" />
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Shipping & Handling */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">Shipping & Handling</h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="font-medium text-foreground">Nationwide Delivery</p>
            <p>
              All orders across Pakistan are delivered through trusted courier partners such as TCS, Leopards, Call Courier, and others. Once your order has been shipped, a tracking ID will be provided so you can easily track your parcel.
            </p>
            <p>
              At Bint-e-Shauq we prioritize the prompt delivery of your orders while ensuring the highest product quality. To maintain our commitment to delivering exceptional products, all items undergo rigorous quality inspections before dispatch. This enables us to offer our valued customers premium-quality merchandise.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <p className="font-medium text-foreground">Processing Timeline:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Order verification within 3 days (COD orders)</li>
                <li>Processing: 1–2 working days after verification</li>
                <li>Delivery: 4–5 working days</li>
                <li>Shipping: Monday to Friday (business days only)</li>
              </ul>
            </div>
            <p className="text-sm italic">
              After placing an order, our Customer Care team will reach out via call or SMS for verification. If we're unable to verify your order within 3 days, it will be automatically cancelled (for Cash on Delivery orders only).
            </p>
          </div>
        </Card>

        {/* Exchange Policy */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Items purchased from our online store are eligible for exchange. If you wish to return an item via courier, please contact our customer service team for guidance.
            </p>
            <p className="font-medium text-foreground">Bint-e-Shauq offers exchanges under the following terms and conditions:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The customer must submit an exchange request (through email, phone call, SMS, or WhatsApp) within <strong>7 working days</strong> of receiving the item.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The exchange request must clearly state the reason(s) for exchange.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The item must be returned in its original packaging.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The original invoice must be included with the returned item.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>The item must be unused and unwashed, free from any odors, stains, perfume, or other signs of use.</span>
              </li>
            </ul>
            <p className="text-sm italic pt-2">
              Bint-e-Shauq reserves the right, at its sole discretion, to approve or decline any exchange request. Once the exchange request is accepted, our customer service team will notify the customer with further instructions.
            </p>
          </div>
        </Card>

        {/* Refund Policy */}
        <Card className="p-6 md:p-8 border-amber-200 bg-amber-50/50">
          <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="font-medium text-foreground">
              Bint-e-Shauq upholds a strict "No Refund" policy. Cashback options are not available.
            </p>
            <p>
              The Exchange Policy applies only after the customer has received the parcel or once the payment has been processed.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">Important Notes:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>To ensure timely delivery, please provide your complete address and accurate contact details.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Our courier partner will attempt to contact you using the provided phone number before delivering your order.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>If they are unable to reach you, the parcel will be returned to Bint-e-Shauq. In such cases, we will make additional efforts to contact you and arrange a new delivery, which will incur an additional shipping charge payable by the customer.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Payment Options */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="font-medium mb-2">Credit/Debit Card</div>
              <p className="text-sm text-muted-foreground">Secure online payment</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="font-medium mb-2">Cash on Delivery</div>
              <p className="text-sm text-muted-foreground">Rs. 1,000 advance required</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="font-medium mb-2">Bank Transfer</div>
              <p className="text-sm text-muted-foreground">Direct bank transfer</p>
            </div>
          </div>
        </Card>

        {/* Cash on Delivery Policy */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">Cash on Delivery (COD) Policy</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At Bint-e-Shauq, we aim to offer our customers a smooth and convenient shopping experience. To ensure the efficient processing of Cash on Delivery (COD) orders, the following policy applies:
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Eligibility for Cash on Delivery (COD):</h3>
                <p>All orders require an advance payment of <strong className="text-foreground">Rs. 1,000</strong>, with the remaining balance payable upon delivery.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Order Value Limit:</h3>
                <p>Orders exceeding <strong className="text-foreground">Rs. 30,000</strong> (PKR) are not eligible for full Cash on Delivery. In such cases, customers must pay at least 50% of the order amount in advance using an alternative payment method such as credit card, debit card, or online bank transfer.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Failed Cash on Delivery Attempts:</h3>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>If a customer fails to receive their COD parcel, our courier partner will make reasonable efforts to contact the customer and complete the delivery.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>If, despite multiple attempts, the customer remains unavailable or declines to accept the parcel, the order will be returned to Bint-e-Shauq.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>In the case of re-dispatch, the customer will be responsible for the shipping charges.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>If an advance payment has been made and the order is processed, but the customer refuses to accept or cancels the order for any reason, Bint-e-Shauq reserves the right to deduct all applicable shipping expenses from the customer's advance payment.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Consequences of Failed COD Attempts:</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>a. If a customer repeatedly fails to receive their COD parcels, and our courier partner reports unsuccessful delivery attempts, Bint-e-Shauq reserves the right to suspend the Cash on Delivery option for that customer's future orders.</li>
                  <li>b. The decision to discontinue the Cash on Delivery service will be formally communicated to the customer via email or another suitable method of contact.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Limitations */}
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4">Service Limitations in Remote Areas</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Bint-e-Shauq provides Cash on Delivery (COD) service throughout Pakistan; however, there may be certain remote or non-serviceable areas where our courier partners are unable to deliver.
            </p>
            <p>
              Customers residing in such areas will not be eligible for Cash on Delivery and will be required to make payment through alternative methods, such as credit card, debit card, or online bank transfer.
            </p>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="p-6 md:p-8 bg-primary/5 border-primary/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our policies, please contact our customer service team.
            </p>
            <p className="font-medium">
              Phone: <span className="text-primary">+923711538953</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

