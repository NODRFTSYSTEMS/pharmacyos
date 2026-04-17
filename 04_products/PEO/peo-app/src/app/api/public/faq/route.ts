import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    faq: [
      {
        category: "general",
        question: "What is Peak Equity Optimizer?",
        answer:
          "PEO is a trust-based real-estate intelligence platform that helps sellers and investors analyze property deals with transparent methodology and data-backed confidence.",
      },
      {
        category: "data",
        question: "Where does the data come from?",
        answer:
          "Paid tiers combine county assessor records, MLS data, and carefully estimated fields. Free tiers are manual-input only.",
      },
      {
        category: "privacy",
        question: "Is my information safe?",
        answer:
          "We follow strict privacy practices. Full details are available in our Privacy Policy.",
      },
      {
        category: "pricing",
        question: "Can I cancel anytime?",
        answer:
          "Yes. You can cancel your subscription at any time from your account settings.",
      },
    ],
  });
}
