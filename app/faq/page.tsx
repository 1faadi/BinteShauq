import { Card } from "@/components/ui/card"

export default function FAQPage() {
  const faqs = [
    {
      question: "How to Place an Order?",
      answer: (
        <div className="space-y-3">
          <p>Placing an order is simple! You can shop with us through any of the following platforms:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-primary font-semibold">•</span>
              <span><strong>Website:</strong> www.binteshauq.store</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-semibold">•</span>
              <span><strong>WhatsApp Store:</strong> +92 371 1538953</span>
            </li>
          </ul>
          <p>Just browse your favorite items from our collection, add them to your cart, proceed to checkout, and your order will be delivered right to your doorstep.</p>
          <p className="italic text-sm bg-muted/30 p-3 rounded-lg">
            Once your order is successfully placed, you will receive a confirmation email and SMS with your order details.
          </p>
        </div>
      )
    },
    {
      question: "How to Confirm My Order?",
      answer: (
        <div className="space-y-3">
          <p>After placing your order, you will receive a confirmation email and SMS within a few minutes.</p>
          <p>If you don't receive either confirmation, please get in touch with us at <a href="tel:+923711538953" className="text-primary hover:underline font-medium">+92 371 1538953</a> or email <a href="mailto:binteshauq@gmail.com" className="text-primary hover:underline font-medium">binteshauq@gmail.com</a> for prompt assistance.</p>
        </div>
      )
    },
    {
      question: "I Have an Order ID and Tracking ID, What Do I Do With Them?",
      answer: (
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-foreground mb-2">Order ID:</p>
            <p>Your Order ID is a unique number used to process and identify your purchase. It also serves as your primary reference when communicating with our customer service team.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-2">Tracking ID:</p>
            <p>Once your order has been dispatched, you will receive a Tracking ID, which allows you to track your order's delivery status in real time.</p>
          </div>
        </div>
      )
    },
    {
      question: "Payment Modes",
      answer: (
        <div className="space-y-4">
          <p className="font-medium text-foreground">To ensure maximum convenience for our customers, Bint-e-Shauq offers multiple secure payment options:</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">1. Credit/Debit Card:</h4>
              <p>After clicking "Complete Order," you will be redirected to a secure payment page where you can complete your purchase using your credit or debit card.</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">2. Online Bank Transfer / IBFT:</h4>
              <p className="mb-3">You may also make payments through online bank transfer. Once the payment is made, please share the transaction receipt along with your Order ID at <a href="mailto:binteshauq@gmail.com" className="text-primary hover:underline font-medium">binteshauq@gmail.com</a>.</p>
              <p className="text-sm italic mb-3">We recommend sending the payment proof immediately after the transfer to prevent any delay in processing your order.</p>
              
              <div className="mt-4 p-4 bg-background border-2 border-primary/20 rounded-lg">
                <p className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Bank Details for Online Payments:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Bank:</span> HBL Bank</p>
                  <p><span className="font-medium">Account Title:</span> SADIA ISMAIL</p>
                  <p><span className="font-medium">Account Number:</span> 50367106426261</p>
                  <p><span className="font-medium">IBAN:</span> PK48HABB0050367106426261</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      question: "I Added an Item to My Cart, but Will Check Out Later?",
      answer: (
        <div className="space-y-3">
          <p className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-900">
            <strong>Please note:</strong> Adding an item to your cart does not reserve it. To make sure your desired product doesn't go out of stock, we recommend checking out as soon as possible to secure your purchase.
          </p>
        </div>
      )
    }
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <p className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide uppercase">
          Help Center
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
          Frequently Asked Questions
        </h1>
        <div className="h-px bg-border max-w-xs mx-auto" />
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about ordering, payments, and more.
        </p>
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="p-6 md:p-8 hover:shadow-md transition-shadow">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
              {faq.question}
            </h2>
            <div className="text-muted-foreground">
              {faq.answer}
            </div>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card className="p-6 md:p-8 bg-primary/5 border-primary/20 mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our customer service team is here to help you with any inquiries.
          </p>
          <div className="space-y-2">
            <p className="font-medium">
              <span className="text-muted-foreground">Phone:</span>{" "}
              <a href="tel:+923711538953" className="text-primary hover:underline">
                +92 371 1538953
              </a>
            </p>
            <p className="font-medium">
              <span className="text-muted-foreground">Email:</span>{" "}
              <a href="mailto:binteshauq@gmail.com" className="text-primary hover:underline">
                binteshauq@gmail.com
              </a>
            </p>
            <p className="font-medium">
              <span className="text-muted-foreground">WhatsApp:</span>{" "}
              <a href="https://wa.me/923711538953" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                +92 371 1538953
              </a>
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Links */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Looking for more information? Check out our{" "}
          <a href="/policies" className="text-primary hover:underline font-medium">
            Policies & Guidelines
          </a>
        </p>
      </div>
    </div>
  )
}

