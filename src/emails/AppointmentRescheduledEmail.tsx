import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface RescheduledEmailProps {
  patientName: string;
  doctorName: string;
  hospitalName: string;
  specialty: string;
  oldDate: string;
  oldTimeSlot: string;
  newDate: string;
  newTimeSlot: string;
  reason: string;
}

export const AppointmentRescheduledEmail = ({
  patientName = "Patient",
  doctorName = "Dr. Unknown",
  hospitalName = "Clinic",
  specialty = "General",
  oldDate = "2024-01-01",
  oldTimeSlot = "10:00 AM",
  newDate = "2024-01-02",
  newTimeSlot = "11:00 AM",
  reason = "Doctor unavailable",
}: RescheduledEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Appointment Has Been Rescheduled - MedQueue</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[30px] max-w-[500px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[10px] mx-0">
              <strong>MedQueue</strong> Appointment Rescheduled
            </Heading>
            <Text className="text-black text-[15px] leading-[24px] text-center mb-[30px]">
              Hello {patientName}, your appointment has been rescheduled by the clinic.
            </Text>

            <Section className="bg-amber-50 border border-amber-200 p-[20px] rounded-lg mb-[24px] text-center">
              <Text className="text-amber-800 text-[12px] uppercase font-bold tracking-wider m-0">
                Reason for Reschedule
              </Text>
              <Text className="text-amber-900 text-[15px] font-medium my-[10px] mx-0">
                {reason}
              </Text>
            </Section>

            <Section className="mb-[24px]">
              <Text className="text-gray-500 text-[11px] uppercase font-bold tracking-wider mb-[12px]">
                Schedule Change
              </Text>

              <div className="bg-red-50 border border-red-100 p-[16px] rounded-lg mb-[10px]">
                <Text className="text-red-400 text-[10px] uppercase font-bold m-0">
                  Previous Appointment
                </Text>
                <Text className="text-red-600 text-[16px] font-medium m-0 line-through">
                  {oldDate} at {oldTimeSlot}
                </Text>
              </div>

              <div className="bg-teal-50 border border-teal-100 p-[16px] rounded-lg">
                <Text className="text-teal-700 text-[10px] uppercase font-bold m-0">
                  New Appointment
                </Text>
                <Text className="text-teal-900 text-[16px] font-bold m-0">
                  {newDate} at {newTimeSlot}
                </Text>
              </div>
            </Section>

            <Section className="mb-[24px]">
              <div className="mb-[12px]">
                <Text className="text-gray-500 text-[12px] uppercase font-bold m-0">Doctor</Text>
                <Text className="text-gray-900 text-[16px] font-medium m-0">{doctorName} ({specialty})</Text>
              </div>
              <div className="mb-[12px]">
                <Text className="text-gray-500 text-[12px] uppercase font-bold m-0">Location</Text>
                <Text className="text-gray-900 text-[16px] font-medium m-0">{hospitalName}</Text>
              </div>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              If this new time does not work for you, please contact the clinic or reply to this email.
              <br />
              Thank you for using MedQueue.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentRescheduledEmail;
