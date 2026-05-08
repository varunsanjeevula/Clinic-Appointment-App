// Doctors mapped to real Tamil Nadu hospitals
// These doctors serve as seed data for the TN hospital integration

export interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  hospital_id: string;
  experience_years: number;
  rating: number;
  is_available: boolean;
}

export const TN_DOCTORS: DoctorData[] = [
  // ── Chennai: Apollo Hospital ──
  { id: "doc-ch01-1", name: "Dr. Rajesh Kumar", specialty: "Cardiology", hospital_id: "ch-01", experience_years: 15, rating: 4.7, is_available: true },
  { id: "doc-ch01-2", name: "Dr. Priya Sharma", specialty: "Neurology", hospital_id: "ch-01", experience_years: 12, rating: 4.5, is_available: true },
  { id: "doc-ch01-3", name: "Dr. Vikram Srinivasan", specialty: "Orthopedics", hospital_id: "ch-01", experience_years: 18, rating: 4.8, is_available: true },
  { id: "doc-ch01-4", name: "Dr. Lakshmi Narayanan", specialty: "Oncology", hospital_id: "ch-01", experience_years: 14, rating: 4.6, is_available: true },

  // ── Chennai: Fortis Malar ──
  { id: "doc-ch02-1", name: "Dr. Arun Balakrishnan", specialty: "Cardiology", hospital_id: "ch-02", experience_years: 10, rating: 4.4, is_available: true },
  { id: "doc-ch02-2", name: "Dr. Deepa Mohan", specialty: "Trauma", hospital_id: "ch-02", experience_years: 8, rating: 4.3, is_available: true },

  // ── Chennai: MIOT International ──
  { id: "doc-ch03-1", name: "Dr. Karthik Nair", specialty: "Orthopedics", hospital_id: "ch-03", experience_years: 20, rating: 4.9, is_available: true },
  { id: "doc-ch03-2", name: "Dr. Anitha Rajan", specialty: "Spine Surgery", hospital_id: "ch-03", experience_years: 16, rating: 4.7, is_available: true },
  { id: "doc-ch03-3", name: "Dr. Suresh Babu", specialty: "Oncology", hospital_id: "ch-03", experience_years: 12, rating: 4.5, is_available: true },

  // ── Chennai: Sri Ramachandra ──
  { id: "doc-ch04-1", name: "Dr. Meera Iyer", specialty: "Cardiology", hospital_id: "ch-04", experience_years: 11, rating: 4.5, is_available: true },
  { id: "doc-ch04-2", name: "Dr. Ramesh Venkatesh", specialty: "Pediatrics", hospital_id: "ch-04", experience_years: 14, rating: 4.4, is_available: true },

  // ── Chennai: Billroth ──
  { id: "doc-ch05-1", name: "Dr. Arjun Rao", specialty: "Gastroenterology", hospital_id: "ch-05", experience_years: 13, rating: 4.5, is_available: true },
  { id: "doc-ch05-2", name: "Dr. Kavitha Sundaram", specialty: "General Surgery", hospital_id: "ch-05", experience_years: 9, rating: 4.2, is_available: true },

  // ── Chennai: Dr. Mehta's ──
  { id: "doc-ch06-1", name: "Dr. Pooja Malhotra", specialty: "Pediatrics", hospital_id: "ch-06", experience_years: 10, rating: 4.6, is_available: true },
  { id: "doc-ch06-2", name: "Dr. Sneha Reddy", specialty: "Obstetrics", hospital_id: "ch-06", experience_years: 8, rating: 4.3, is_available: true },

  // ── Chennai: SIMS ──
  { id: "doc-ch07-1", name: "Dr. Suresh Reddy", specialty: "Neurology", hospital_id: "ch-07", experience_years: 16, rating: 4.8, is_available: true },
  { id: "doc-ch07-2", name: "Dr. Amit Verma", specialty: "Cardiology", hospital_id: "ch-07", experience_years: 13, rating: 4.5, is_available: true },

  // ── Chennai: Gleneagles Global Health City ──
  { id: "doc-ch08-1", name: "Dr. Mohamed Rela", specialty: "Transplants", hospital_id: "ch-08", experience_years: 25, rating: 4.9, is_available: true },
  { id: "doc-ch08-2", name: "Dr. Ilankumaran Kaliamoorthy", specialty: "Oncology", hospital_id: "ch-08", experience_years: 18, rating: 4.7, is_available: true },

  // ── Chennai: Kauvery ──
  { id: "doc-ch09-1", name: "Dr. Aravindan Selvaraj", specialty: "Cardiology", hospital_id: "ch-09", experience_years: 20, rating: 4.7, is_available: true },
  { id: "doc-ch09-2", name: "Dr. Nandini Mohan", specialty: "Neurology", hospital_id: "ch-09", experience_years: 12, rating: 4.4, is_available: true },

  // ── Chennai: MGM Healthcare ──
  { id: "doc-ch10-1", name: "Dr. Prashanth Rajagopalan", specialty: "Pulmonology", hospital_id: "ch-10", experience_years: 14, rating: 4.5, is_available: true },
  { id: "doc-ch10-2", name: "Dr. Kumaran Devaraj", specialty: "Cardiology", hospital_id: "ch-10", experience_years: 16, rating: 4.6, is_available: true },

  // ── Chennai: Vijaya Hospital ──
  { id: "doc-ch11-1", name: "Dr. Ganesh Shanmugam", specialty: "Cardiology", hospital_id: "ch-11", experience_years: 11, rating: 4.3, is_available: true },

  // ── Chennai: Rajiv Gandhi GH ──
  { id: "doc-ch12-1", name: "Dr. Selvakumar M", specialty: "Emergency Medicine", hospital_id: "ch-12", experience_years: 15, rating: 4.2, is_available: true },
  { id: "doc-ch12-2", name: "Dr. Anand Babu", specialty: "General Surgery", hospital_id: "ch-12", experience_years: 12, rating: 4.0, is_available: true },

  // ── Chennai: TN Govt Multi Super Speciality ──
  { id: "doc-ch13-1", name: "Dr. Kannan Periasamy", specialty: "Cardiology", hospital_id: "ch-13", experience_years: 18, rating: 4.3, is_available: true },

  // ── Chennai: Stanley Medical College ──
  { id: "doc-ch14-1", name: "Dr. Sathish Devadoss", specialty: "Gastroenterology", hospital_id: "ch-14", experience_years: 14, rating: 4.1, is_available: true },

  // ── Chennai: ICH ──
  { id: "doc-ch15-1", name: "Dr. Rema Chandramohan", specialty: "Pediatrics", hospital_id: "ch-15", experience_years: 20, rating: 4.5, is_available: true },

  // ── Coimbatore: KMCH ──
  { id: "doc-cb01-1", name: "Dr. Nalla G Palaniswami", specialty: "Cardiology", hospital_id: "cb-01", experience_years: 22, rating: 4.8, is_available: true },
  { id: "doc-cb01-2", name: "Dr. Thiagarajan Srinivasan", specialty: "Neurology", hospital_id: "cb-01", experience_years: 15, rating: 4.6, is_available: true },
  { id: "doc-cb01-3", name: "Dr. Mohan Keshavamurthy", specialty: "Transplants", hospital_id: "cb-01", experience_years: 18, rating: 4.7, is_available: true },

  // ── Coimbatore: Ganga Hospital ──
  { id: "doc-cb02-1", name: "Dr. S. Rajasekaran", specialty: "Orthopedics", hospital_id: "cb-02", experience_years: 25, rating: 4.9, is_available: true },
  { id: "doc-cb02-2", name: "Dr. Shanmuganathan R", specialty: "Plastic Surgery", hospital_id: "cb-02", experience_years: 16, rating: 4.7, is_available: true },

  // ── Coimbatore: KG Hospital ──
  { id: "doc-cb03-1", name: "Dr. G. Bakthavathsalam", specialty: "Cardiology", hospital_id: "cb-03", experience_years: 20, rating: 4.6, is_available: true },
  { id: "doc-cb03-2", name: "Dr. Senthil Nathan", specialty: "Neurology", hospital_id: "cb-03", experience_years: 14, rating: 4.4, is_available: true },

  // ── Coimbatore: PSG ──
  { id: "doc-cb04-1", name: "Dr. Ramalingam Kalirajan", specialty: "General Medicine", hospital_id: "cb-04", experience_years: 16, rating: 4.5, is_available: true },
  { id: "doc-cb04-2", name: "Dr. Vijayalakshmi P", specialty: "Oncology", hospital_id: "cb-04", experience_years: 12, rating: 4.3, is_available: true },

  // ── Coimbatore: Royal Care ──
  { id: "doc-cb05-1", name: "Dr. Surendra Babu", specialty: "Pulmonology", hospital_id: "cb-05", experience_years: 13, rating: 4.4, is_available: true },

  // ── Coimbatore: Sri Ramakrishna ──
  { id: "doc-cb06-1", name: "Dr. P. V. Krishnamoorthy", specialty: "Oncology", hospital_id: "cb-06", experience_years: 17, rating: 4.5, is_available: true },
  { id: "doc-cb06-2", name: "Dr. Mahesh Kumar", specialty: "Neurology", hospital_id: "cb-06", experience_years: 11, rating: 4.3, is_available: true },

  // ── Coimbatore: Gem Hospital ──
  { id: "doc-cb07-1", name: "Dr. C. Palanivelu", specialty: "Gastroenterology", hospital_id: "cb-07", experience_years: 28, rating: 4.9, is_available: true },

  // ── Madurai: Apollo Speciality ──
  { id: "doc-md01-1", name: "Dr. Senthilkumar R", specialty: "Oncology", hospital_id: "md-01", experience_years: 14, rating: 4.3, is_available: true },
  { id: "doc-md01-2", name: "Dr. Ramachandran K", specialty: "Cardiology", hospital_id: "md-01", experience_years: 12, rating: 4.2, is_available: true },

  // ── Madurai: Meenakshi Mission ──
  { id: "doc-md02-1", name: "Dr. Julian A. Jayalal", specialty: "Cardiology", hospital_id: "md-02", experience_years: 20, rating: 4.7, is_available: true },
  { id: "doc-md02-2", name: "Dr. Geetha Rani", specialty: "Neurology", hospital_id: "md-02", experience_years: 15, rating: 4.5, is_available: true },

  // ── Madurai: Vadamalayan ──
  { id: "doc-md03-1", name: "Dr. Vadamalayan S", specialty: "Orthopedics", hospital_id: "md-03", experience_years: 22, rating: 4.6, is_available: true },

  // ── Madurai: Velammal Medical College ──
  { id: "doc-md04-1", name: "Dr. Karthikeyan T", specialty: "Trauma", hospital_id: "md-04", experience_years: 10, rating: 4.2, is_available: true },

  // ── Madurai: Preethi Hospital ──
  { id: "doc-md05-1", name: "Dr. Karthik Anand", specialty: "Orthopedics", hospital_id: "md-05", experience_years: 16, rating: 4.8, is_available: true },
  { id: "doc-md05-2", name: "Dr. Mahalakshmi V", specialty: "Neurology", hospital_id: "md-05", experience_years: 11, rating: 4.5, is_available: true },

  // ── Madurai: Govt Rajaji ──
  { id: "doc-md06-1", name: "Dr. Palanisamy K", specialty: "Emergency Medicine", hospital_id: "md-06", experience_years: 18, rating: 4.0, is_available: true },
  { id: "doc-md06-2", name: "Dr. Murugan S", specialty: "General Surgery", hospital_id: "md-06", experience_years: 14, rating: 3.9, is_available: true },

  // ── Vellore: CMC ──
  { id: "doc-vl01-1", name: "Dr. Sunil Chandy", specialty: "Cardiology", hospital_id: "vl-01", experience_years: 25, rating: 4.9, is_available: true },
  { id: "doc-vl01-2", name: "Dr. Mammen Chandy", specialty: "Oncology", hospital_id: "vl-01", experience_years: 30, rating: 4.9, is_available: true },
  { id: "doc-vl01-3", name: "Dr. Vrisha Madhuri", specialty: "Orthopedics", hospital_id: "vl-01", experience_years: 18, rating: 4.7, is_available: true },

  // ── Vellore: Sri Narayani ──
  { id: "doc-vl02-1", name: "Dr. Ravi Kumar N", specialty: "General Medicine", hospital_id: "vl-02", experience_years: 12, rating: 4.3, is_available: true },

  // ── Trichy: Kavery Medical Center ──
  { id: "doc-tr01-1", name: "Dr. Arul Mozhi Varman", specialty: "Cardiology", hospital_id: "tr-01", experience_years: 15, rating: 4.5, is_available: true },
  { id: "doc-tr01-2", name: "Dr. Saravanan P", specialty: "Neurology", hospital_id: "tr-01", experience_years: 10, rating: 4.3, is_available: true },

  // ── Trichy: MGM Govt Hospital ──
  { id: "doc-tr02-1", name: "Dr. Jayaraman B", specialty: "General Surgery", hospital_id: "tr-02", experience_years: 16, rating: 4.0, is_available: true },

  // ── Salem: Manipal ──
  { id: "doc-sl01-1", name: "Dr. Manickam S", specialty: "Cardiology", hospital_id: "sl-01", experience_years: 14, rating: 4.4, is_available: true },
  { id: "doc-sl01-2", name: "Dr. Thirunavukkarasu R", specialty: "Orthopedics", hospital_id: "sl-01", experience_years: 12, rating: 4.3, is_available: true },

  // ── Salem: Govt Medical College ──
  { id: "doc-sl02-1", name: "Dr. Prabakaran V", specialty: "General Medicine", hospital_id: "sl-02", experience_years: 15, rating: 3.9, is_available: true },

  // ── Salem: Vinayaka Mission ──
  { id: "doc-sl03-1", name: "Dr. Chandrasekhar M", specialty: "Oncology", hospital_id: "sl-03", experience_years: 11, rating: 4.2, is_available: true },

  // ── Erode: KMCH Speciality ──
  { id: "doc-er01-1", name: "Dr. Gopalakrishnan K", specialty: "General Medicine", hospital_id: "er-01", experience_years: 13, rating: 4.3, is_available: true },
  { id: "doc-er01-2", name: "Dr. Senthil Murugan", specialty: "Cardiology", hospital_id: "er-01", experience_years: 10, rating: 4.1, is_available: true },

  // ── Ariyalur: Govt Hospital ──
  { id: "doc-ar02-1", name: "Dr. Nagarajan M", specialty: "General Medicine", hospital_id: "ar-02", experience_years: 10, rating: 3.8, is_available: true },

  // ── Viluppuram: Govt Medical College ──
  { id: "doc-vp01-1", name: "Dr. Venkatesan R", specialty: "General Medicine", hospital_id: "vp-01", experience_years: 14, rating: 3.9, is_available: true },
  { id: "doc-vp01-2", name: "Dr. Selvaraj P", specialty: "General Surgery", hospital_id: "vp-01", experience_years: 11, rating: 3.7, is_available: true },
];

// Get doctor with hospital name
export function getDoctorsWithHospital(hospitalId?: string) {
  const { TN_HOSPITALS } = require("./hospital-data");
  let docs = [...TN_DOCTORS];
  if (hospitalId) {
    docs = docs.filter(d => d.hospital_id === hospitalId);
  }
  return docs.map(d => {
    const hospital = TN_HOSPITALS.find((h: { id: string; name: string }) => h.id === d.hospital_id);
    return {
      ...d,
      hospitals: hospital ? { name: hospital.name } : undefined,
    };
  });
}
