import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  patientName: string;
  severity: "critical" | "normal";
  recommendation: string;
  suggestedSpecialties: string[];
}

export const TriageConfirmationEmail = ({
  patientName = "Patient",
  severity = "normal",
  recommendation = "Please wait for your queue.",
  suggestedSpecialties = [],
}: EmailProps) => {
  const isCritical = severity === "critical";

  return (
    <Html>
      <Head />
      <Preview>Your Clinic Appointment Triage Summary</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>MedQueue</strong> Triage Summary
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {patientName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We have successfully received your registration and our smart triage system has analyzed your symptoms.
            </Text>
            
            <Section className={`mt-[24px] mb-[24px] p-4 rounded-lg ${isCritical ? "bg-red-50 border border-red-200" : "bg-teal-50 border border-teal-200"}`}>
              <Text className={`font-bold m-0 text-lg ${isCritical ? "text-red-600" : "text-teal-700"}`}>
                Status: {isCritical ? "CRITICAL - URGENT CARE NEEDED" : "NORMAL - Non-Urgent"}
              </Text>
              <Text className="text-gray-700 mt-2 mb-0">
                {recommendation}
              </Text>
            </Section>

            {suggestedSpecialties.length > 0 && (
              <Section className="mb-[24px]">
                <Text className="text-black text-[14px] leading-[24px] font-semibold mb-2">
                  Suggested Specialties:
                </Text>
                <div className="flex gap-2 flex-wrap">
                  {suggestedSpecialties.map((s) => (
                    <span key={s} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md mr-2 mb-2 inline-block">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={"http://localhost:3000"}
                className="bg-[#0f766e] rounded-md text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
              >
                Go To Dashboard
              </Link>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This is an automated message from MedQueue. If you are experiencing a medical emergency, please call your local emergency services immediately.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TriageConfirmationEmail;
