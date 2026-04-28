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

interface AppointmentEmailProps {
  patientName: string;
  doctorName: string;
  hospitalName: string;
  specialty: string;
  date: string;
  timeSlot: string;
  confirmationCode: string;
}

export const AppointmentConfirmationEmail = ({
  patientName = "Patient",
  doctorName = "Dr. Unknown",
  hospitalName = "Clinic",
  specialty = "General",
  date = "2024-01-01",
  timeSlot = "10:00 AM",
  confirmationCode = "123456",
}: AppointmentEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Appointment Confirmation - MedQueue</Preview>
      <Tailwind>
        <Body className="bg-gray-100 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[30px] max-w-[500px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[10px] mx-0">
              <strong>MedQueue</strong> Appointment Confirmed
            </Heading>
            <Text className="text-black text-[15px] leading-[24px] text-center mb-[30px]">
              Hello {patientName}, your appointment has been successfully scheduled.
            </Text>

            <Section className="bg-teal-50 border border-teal-200 p-[20px] rounded-lg mb-[24px] text-center">
              <Text className="text-teal-800 text-[12px] uppercase font-bold tracking-wider m-0">
                Confirmation Code
              </Text>
              <Text className="text-teal-900 text-[32px] font-black tracking-widest my-[10px] mx-0">
                {confirmationCode}
              </Text>
              <Text className="text-teal-700 text-[13px] m-0">
                Please present this code at the reception.
              </Text>
            </Section>
            
            <Section className="mb-[24px]">
              <div className="mb-[12px]">
                <Text className="text-gray-500 text-[12px] uppercase font-bold m-0">Doctor</Text>
                <Text className="text-gray-900 text-[16px] font-medium m-0">{doctorName} ({specialty})</Text>
              </div>
              <div className="mb-[12px]">
                <Text className="text-gray-500 text-[12px] uppercase font-bold m-0">Date & Time</Text>
                <Text className="text-gray-900 text-[16px] font-medium m-0">{date} at {timeSlot}</Text>
              </div>
              <div className="mb-[12px]">
                <Text className="text-gray-500 text-[12px] uppercase font-bold m-0">Location</Text>
                <Text className="text-gray-900 text-[16px] font-medium m-0">{hospitalName}</Text>
              </div>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              If you need to cancel or reschedule, please contact the clinic or reply to this email.
              <br />
              Thank you for using MedQueue.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentConfirmationEmail;
