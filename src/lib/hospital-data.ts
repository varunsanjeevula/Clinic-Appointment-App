// Real Tamil Nadu Hospital Data extracted from research document
// GPS coordinates sourced from the document + verified OpenStreetMap data

export interface HospitalData {
  id: string;
  name: string;
  address: string;
  district: string;
  type: "hospital" | "clinic";
  specialties: string[];
  rating: number;
  has_emergency: boolean;
  phone: string;
  lat: number;
  lng: number;
  accreditation?: string;
}

export const TN_HOSPITALS: HospitalData[] = [
  // ── Chennai District ──────────────────────────────────
  { id: "ch-01", name: "Apollo Hospital (Main)", address: "21, Greams Lane, Off Greams Road, Chennai 600006", district: "Chennai", type: "hospital", specialties: ["Cardiology","Neurology","Orthopedics","Oncology","General Surgery"], rating: 4.5, has_emergency: true, phone: "044-28290200", lat: 13.0605, lng: 80.2504, accreditation: "NABH & JCI" },
  { id: "ch-02", name: "Fortis Malar Hospital", address: "No. 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai 600020", district: "Chennai", type: "hospital", specialties: ["Cardiology","Trauma","General Surgery","Neurology"], rating: 4.3, has_emergency: true, phone: "044-42892222", lat: 13.0067, lng: 80.2558 },
  { id: "ch-03", name: "MIOT International", address: "4/112, Mount Poonamallee Road, Manapakkam, Chennai 600089", district: "Chennai", type: "hospital", specialties: ["Orthopedics","Spine Surgery","Oncology","Trauma"], rating: 4.6, has_emergency: true, phone: "044-22492288", lat: 13.0211, lng: 80.1789, accreditation: "NABH & JCI" },
  { id: "ch-04", name: "Sri Ramachandra Medical Centre", address: "No. 1, Ramachandra Nagar, Porur, Chennai 600116", district: "Chennai", type: "hospital", specialties: ["General Medicine","Cardiology","Neurology","Pediatrics"], rating: 4.4, has_emergency: true, phone: "044-24765512", lat: 13.0361, lng: 80.1425 },
  { id: "ch-05", name: "Billroth Hospital", address: "No. 43, Lakshmi Talkies Road, Shenoy Nagar, Chennai 600030", district: "Chennai", type: "hospital", specialties: ["Gastroenterology","Trauma","General Surgery"], rating: 4.2, has_emergency: true, phone: "044-26641777", lat: 13.0789, lng: 80.2295 },
  { id: "ch-06", name: "Dr. Mehta's Hospital", address: "No. 2, McNichols Road, 3rd Lane, Chetpet, Chennai 600031", district: "Chennai", type: "hospital", specialties: ["Pediatrics","Obstetrics","General Medicine"], rating: 4.3, has_emergency: false, phone: "044-42271001", lat: 13.0764, lng: 80.2452 },
  { id: "ch-07", name: "SIMS Hospital", address: "No. 1, Jawaharlal Nehru Salai, Vadapalani, Chennai 600026", district: "Chennai", type: "hospital", specialties: ["Cardiology","Neurology","Neurosurgery","General Surgery"], rating: 4.5, has_emergency: true, phone: "044-20002001", lat: 13.0511, lng: 80.2112 },
  { id: "ch-08", name: "Gleneagles Global Health City", address: "439, Cheran Nagar, Perumbakkam, Chennai 600100", district: "Chennai", type: "hospital", specialties: ["Transplants","Oncology","Cardiology","Neurology"], rating: 4.7, has_emergency: true, phone: "044-46242424", lat: 12.9061, lng: 80.2078 },
  { id: "ch-09", name: "Kauvery Hospital", address: "81, TTK Road Junction, CIT Colony, Alwarpet, Chennai 600018", district: "Chennai", type: "hospital", specialties: ["Cardiology","Neurology","General Medicine"], rating: 4.4, has_emergency: true, phone: "044-40006000", lat: 13.0336, lng: 80.2522 },
  { id: "ch-10", name: "MGM Healthcare", address: "No. 72, Nelson Manickam Road, Aminjikarai, Chennai 600029", district: "Chennai", type: "hospital", specialties: ["Cardiology","Pulmonology","Transplants","General Medicine"], rating: 4.5, has_emergency: true, phone: "044-45242407", lat: 13.0712, lng: 80.2301 },
  { id: "ch-11", name: "Vijaya Hospital", address: "No. 434, N.S.K. Salai, Vadapalani, Chennai 600026", district: "Chennai", type: "hospital", specialties: ["Cardiology","General Medicine","General Surgery"], rating: 4.2, has_emergency: true, phone: "044-66646664", lat: 13.0518, lng: 80.2109 },
  // Chennai Government Hospitals
  { id: "ch-12", name: "Rajiv Gandhi Govt General Hospital", address: "Poonamallee High Road, Park Town, Chennai 600003", district: "Chennai", type: "hospital", specialties: ["Emergency Medicine","General Surgery","Orthopedics","General Medicine"], rating: 4.0, has_emergency: true, phone: "044-25305000", lat: 13.0827, lng: 80.2756 },
  { id: "ch-13", name: "TN Govt Multi Super Speciality Hospital", address: "Omandurar Govt. Estate, Chennai 600002", district: "Chennai", type: "hospital", specialties: ["Cardiology","Neurology","Nephrology"], rating: 4.1, has_emergency: true, phone: "044-25666000", lat: 13.0710, lng: 80.2740 },
  { id: "ch-14", name: "Govt Stanley Medical College Hospital", address: "Old Jail Road, Chennai 600001", district: "Chennai", type: "hospital", specialties: ["Gastroenterology","General Surgery","General Medicine"], rating: 3.9, has_emergency: true, phone: "044-25281345", lat: 13.1128, lng: 80.2858 },
  { id: "ch-15", name: "Institute of Child Health (ICH)", address: "Halls Road, Egmore, Chennai 600008", district: "Chennai", type: "hospital", specialties: ["Pediatrics"], rating: 4.2, has_emergency: true, phone: "044-28192138", lat: 13.0740, lng: 80.2615 },

  // ── Coimbatore District ──────────────────────────────
  { id: "cb-01", name: "Kovai Medical Center and Hospital", address: "99, Avanashi Road, Coimbatore 641014", district: "Coimbatore", type: "hospital", specialties: ["Transplants","Cardiology","Neurology","Oncology"], rating: 4.7, has_emergency: true, phone: "0422-4323800", lat: 11.0168, lng: 77.0284 },
  { id: "cb-02", name: "Ganga Medical Centre & Hospital", address: "313, Mettupalayam Road, Coimbatore 641043", district: "Coimbatore", type: "hospital", specialties: ["Orthopedics","Plastic Surgery","Trauma","Spine Surgery"], rating: 4.8, has_emergency: true, phone: "0422-2485000", lat: 11.0285, lng: 76.9650, accreditation: "NABH" },
  { id: "cb-03", name: "KG Hospital", address: "No. 5, Govt Arts College Road, Coimbatore 641018", district: "Coimbatore", type: "hospital", specialties: ["Cardiology","Neurology","Robotic Surgery","General Medicine"], rating: 4.3, has_emergency: true, phone: "0422-2212121", lat: 11.0060, lng: 76.9660, accreditation: "NABH & NABL" },
  { id: "cb-04", name: "PSG Hospitals", address: "Avinashi Road, Peelamedu, Coimbatore 641004", district: "Coimbatore", type: "hospital", specialties: ["General Medicine","Transplants","Oncology","Pediatrics"], rating: 4.5, has_emergency: true, phone: "0422-2570170", lat: 11.0234, lng: 77.0218 },
  { id: "cb-05", name: "Royal Care Super Speciality Hospital", address: "1/520, Neelambur, Sulur Taluk, Coimbatore 641062", district: "Coimbatore", type: "hospital", specialties: ["Pulmonology","Neurology","Transplants","General Medicine"], rating: 4.4, has_emergency: true, phone: "0422-2227222", lat: 11.0480, lng: 77.0730, accreditation: "NABH & JCI" },
  { id: "cb-06", name: "Sri Ramakrishna Hospital", address: "395, Sarojini Naidu Road, Coimbatore 641044", district: "Coimbatore", type: "hospital", specialties: ["Oncology","Neurology","Cardiology","General Medicine"], rating: 4.4, has_emergency: true, phone: "0422-4500000", lat: 11.0100, lng: 76.9580, accreditation: "NABH" },
  { id: "cb-07", name: "Gem Hospital", address: "45, Pankaja Mill Road, Coimbatore 641045", district: "Coimbatore", type: "hospital", specialties: ["Gastroenterology","Laparoscopy"], rating: 4.6, has_emergency: false, phone: "0422-2324100", lat: 11.0040, lng: 76.9690 },

  // ── Madurai District ──────────────────────────────────
  { id: "md-01", name: "Apollo Speciality Hospital", address: "20, Lake View Road, K.K. Nagar, Madurai 625020", district: "Madurai", type: "hospital", specialties: ["Oncology","Cardiology","Orthopedics","General Surgery"], rating: 4.0, has_emergency: true, phone: "0452-2580892", lat: 9.9252, lng: 78.1198 },
  { id: "md-02", name: "Meenakshi Mission Hospital", address: "Lake Area, Melur Road, Madurai 625107", district: "Madurai", type: "hospital", specialties: ["Cardiology","Neurology","General Medicine","Transplants"], rating: 4.5, has_emergency: true, phone: "0452-2588741", lat: 9.9350, lng: 78.1550 },
  { id: "md-03", name: "Vadamalayan Hospital", address: "9-A, Vallabai Road, Chokkikulam, Madurai 625002", district: "Madurai", type: "hospital", specialties: ["Orthopedics","Neurology","General Medicine"], rating: 4.3, has_emergency: true, phone: "0452-2523400", lat: 9.9230, lng: 78.1250 },
  { id: "md-04", name: "Velammal Medical College Hospital", address: "Anuppanady, Madurai 625009", district: "Madurai", type: "hospital", specialties: ["Trauma","Cardiology","General Medicine","General Surgery"], rating: 4.1, has_emergency: true, phone: "0452-2510000", lat: 9.9100, lng: 78.0950 },
  { id: "md-05", name: "Preethi Hospital", address: "120 Feet Road, K. Pudur, Madurai 625007", district: "Madurai", type: "hospital", specialties: ["Orthopedics","Neurology","General Medicine"], rating: 4.8, has_emergency: true, phone: "0452-2533222", lat: 9.9350, lng: 78.1100 },
  { id: "md-06", name: "Government Rajaji Hospital", address: "Panagal Road, Madurai 625020", district: "Madurai", type: "hospital", specialties: ["Emergency Medicine","General Surgery","Oncology","Trauma"], rating: 3.8, has_emergency: true, phone: "0452-2532535", lat: 9.9200, lng: 78.1210 },

  // ── Vellore District ──────────────────────────────────
  { id: "vl-01", name: "Christian Medical College (CMC)", address: "Ida Scudder Road, Vellore 632004", district: "Vellore", type: "hospital", specialties: ["Transplants","Cardiology","Neurology","Oncology","Orthopedics","Pediatrics"], rating: 4.9, has_emergency: true, phone: "0416-2281000", lat: 12.9249, lng: 79.1353, accreditation: "NABH & JCI" },
  { id: "vl-02", name: "Sri Narayani Hospital", address: "Ariyur, Vellore", district: "Vellore", type: "hospital", specialties: ["General Medicine","Cardiology","Orthopedics"], rating: 4.2, has_emergency: true, phone: "0416-2267801", lat: 12.8980, lng: 79.1480 },

  // ── Trichy District ───────────────────────────────────
  { id: "tr-01", name: "Kavery Medical Center", address: "Trichy 620001", district: "Trichy", type: "hospital", specialties: ["Cardiology","General Medicine","Neurology"], rating: 4.4, has_emergency: true, phone: "0431-4077777", lat: 10.8050, lng: 78.6856 },
  { id: "tr-02", name: "Mahatma Gandhi Memorial Govt Hospital", address: "Trichy 620017", district: "Trichy", type: "hospital", specialties: ["General Medicine","General Surgery","Emergency Medicine","Orthopedics"], rating: 3.9, has_emergency: true, phone: "0431-2415565", lat: 10.8155, lng: 78.6920 },

  // ── Salem District ────────────────────────────────────
  { id: "sl-01", name: "Manipal Hospital Salem", address: "Salem 636004", district: "Salem", type: "hospital", specialties: ["General Medicine","Cardiology","Orthopedics"], rating: 4.3, has_emergency: true, phone: "0427-2441234", lat: 11.6643, lng: 78.1460 },
  { id: "sl-02", name: "Govt Mohan Kumaramangalam Medical College", address: "Salem 636030", district: "Salem", type: "hospital", specialties: ["General Medicine","General Surgery","Emergency Medicine"], rating: 3.8, has_emergency: true, phone: "0427-2314000", lat: 11.6550, lng: 78.1580 },
  { id: "sl-03", name: "Vinayaka Mission Hospital", address: "Salem 636308", district: "Salem", type: "hospital", specialties: ["Oncology","General Medicine","Orthopedics"], rating: 4.1, has_emergency: true, phone: "0427-3987000", lat: 11.6800, lng: 78.1370 },

  // ── Erode District ────────────────────────────────────
  { id: "er-01", name: "KMCH Speciality Hospital Erode", address: "Palaniappa St, Erode 638009", district: "Erode", type: "hospital", specialties: ["General Medicine","Cardiology","Orthopedics"], rating: 4.2, has_emergency: true, phone: "0424-2212121", lat: 11.3410, lng: 77.7172 },

  // ── Ariyalur District ─────────────────────────────────
  { id: "ar-01", name: "Ariyalur Golden Hospital", address: "Ariyalur 621704", district: "Ariyalur", type: "hospital", specialties: ["General Medicine"], rating: 3.5, has_emergency: false, phone: "9842368480", lat: 11.1400, lng: 79.0780 },
  { id: "ar-02", name: "Govt Hospital Ariyalur", address: "Ariyalur 621704", district: "Ariyalur", type: "hospital", specialties: ["General Medicine","Emergency Medicine"], rating: 3.6, has_emergency: true, phone: "04329-222345", lat: 11.1380, lng: 79.0770 },

  // ── Viluppuram District ───────────────────────────────
  { id: "vp-01", name: "Govt Viluppuram Medical College", address: "Mundiyampakkam, Viluppuram", district: "Viluppuram", type: "hospital", specialties: ["General Medicine","General Surgery","Emergency Medicine"], rating: 3.7, has_emergency: true, phone: "04146-232400", lat: 11.9401, lng: 79.4861 },
  { id: "vp-02", name: "Govt Hospital Tindivanam", address: "Tindivanam, Viluppuram", district: "Viluppuram", type: "hospital", specialties: ["General Medicine","Emergency Medicine"], rating: 3.5, has_emergency: true, phone: "04147-222250", lat: 12.2340, lng: 79.6530 },
];

// Get unique districts
export const TN_DISTRICTS = [...new Set(TN_HOSPITALS.map(h => h.district))].sort();

// Haversine formula to calculate distance between two GPS coordinates
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Sort hospitals by distance from user location
export function sortByDistance(
  hospitals: HospitalData[],
  userLat: number,
  userLng: number
): (HospitalData & { distance: number })[] {
  return hospitals
    .map(h => ({
      ...h,
      distance: haversineDistance(userLat, userLng, h.lat, h.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}
