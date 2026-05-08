import { NextResponse } from "next/server";
import { TN_HOSPITALS, TN_DISTRICTS, sortByDistance } from "@/lib/hospital-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const specialty = searchParams.get("specialty");

  let hospitals = [...TN_HOSPITALS];

  // Filter by district
  if (district) {
    hospitals = hospitals.filter(h => h.district === district);
  }

  // Filter by specialty
  if (specialty) {
    hospitals = hospitals.filter(h =>
      h.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }

  // Sort by distance if user coordinates provided
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    if (!isNaN(userLat) && !isNaN(userLng)) {
      const sorted = sortByDistance(hospitals, userLat, userLng);
      return NextResponse.json(sorted);
    }
  }

  // Default: sort by rating descending
  hospitals.sort((a, b) => b.rating - a.rating);
  return NextResponse.json(hospitals);
}

// Also expose district list
export async function POST() {
  return NextResponse.json({ districts: TN_DISTRICTS });
}
