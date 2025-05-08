
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqItems = [
    {
      question: "How secure is SecureVault?",
      answer: "SecureVault uses AES-256 bit encryption, which is the industry standard for top-level security. All your data is encrypted on your device before being stored, ensuring that only you can access your information with your PIN."
    },
    {
      question: "Can I access my data on multiple devices?",
      answer: "Yes, SecureVault synchronizes your encrypted data securely across all your devices. You can access your passwords, notes, and other information from your computer, tablet, or phone."
    },
    {
      question: "What happens if I forget my PIN?",
      answer: "Due to our zero-knowledge security model, we cannot recover your PIN if you forget it. However, you can set up recovery options when creating your account to help you regain access if needed."
    },
    {
      question: "Is there a free version of SecureVault?",
      answer: "Yes, SecureVault offers a free tier with essential features for individual users. Premium plans are available for additional features and team collaboration options."
    },
    {
      question: "How is SecureVault different from other password managers?",
      answer: "SecureVault goes beyond password management to provide a comprehensive productivity suite specifically designed for developers and students, with specialized tools for code snippets, learning tracking, and project management."
    },
    {
      question: "Can I import data from other tools?",
      answer: "Yes, SecureVault supports importing data from major password managers, note-taking apps, and project management tools to make your transition seamless."
    }
  ];

  return (
    <section id="faq" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about SecureVault
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
