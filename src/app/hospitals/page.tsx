"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHospitals, useDistricts } from "@/lib/queries";
import { HospitalMap } from "@/components/hospital-map";
import type { Hospital } from "@/lib/types";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Star, Phone, Shield,
  Filter, X, Locate, Building2, Ambulance
} from "lucide-react";
import Link from "next/link";

export default function HospitalsPage() {
  const [district, setDistrict] = useState("");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const { data: districtData } = useDistricts();
  const { data: hospitals, isLoading } = useHospitals({
    district: district || undefined,
    lat: userLoc?.lat,
    lng: userLoc?.lng,
  });

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocError(err.message === "User denied Geolocation"
          ? "Location access denied. Please enable location in browser settings."
          : "Unable to get your location. Please try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setUserLoc(null);
  }, []);

  const handleHospitalClick = useCallback((h: Hospital) => {
    setSelectedId(h.id);
  }, []);

  const selectedHospital = hospitals?.find(h => h.id === selectedId);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Tamil Nadu Hospitals
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {hospitals?.length ?? 0} verified healthcare facilities across Tamil Nadu
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userLoc && (
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <Navigation className="w-3 h-3 text-blue-500" />
                <span className="text-xs">
                  {userLoc.lat.toFixed(4)}°, {userLoc.lng.toFixed(4)}°
                </span>
                <button onClick={clearLocation} className="ml-1 hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant={userLoc ? "outline" : "default"}
              size="sm"
              onClick={handleLocate}
              disabled={locating}
              className="gap-1.5"
            >
              {locating ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Locate className="w-3.5 h-3.5" />
              )}
              {userLoc ? "Update Location" : "Find Nearest"}
            </Button>
          </div>
        </div>

        {locError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="py-3 px-4 flex items-center gap-2 text-sm text-destructive">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {locError}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Districts</option>
            {districtData?.districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {district && (
            <Button variant="ghost" size="sm" onClick={() => setDistrict("")} className="h-8 px-2 text-xs gap-1">
              <X className="w-3 h-3" /> Clear
            </Button>
          )}
          {userLoc && (
            <Badge variant="outline" className="text-xs gap-1">
              <Navigation className="w-3 h-3" /> Sorted by distance
            </Badge>
          )}
        </div>

        {/* Map + List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <HospitalMap
              hospitals={hospitals ?? []}
              userLocation={userLoc}
              selectedHospitalId={selectedId}
              onHospitalClick={handleHospitalClick}
              className="h-[280px] sm:h-[400px] lg:h-[500px] shadow-sm"
            />
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block border-2 border-white shadow" /> You
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block border-2 border-white shadow ml-2" /> Emergency
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block border-2 border-white shadow ml-2" /> Hospital
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block border-2 border-white shadow ml-2" /> Selected
            </p>
          </div>

          {/* Hospital List */}
          <div className="lg:col-span-2 space-y-3 max-h-[400px] lg:max-h-[540px] overflow-y-auto pr-1 mobile-no-scrollbar">
            <h3 className="text-sm font-semibold sticky top-0 bg-background py-1 z-10">
              {userLoc ? "Nearest Hospitals" : "All Hospitals"}
              <span className="text-muted-foreground font-normal ml-1">({hospitals?.length ?? 0})</span>
            </h3>

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
            ) : (
              <AnimatePresence>
                {hospitals?.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <HospitalListCard
                      hospital={h}
                      isSelected={h.id === selectedId}
                      onClick={() => setSelectedId(h.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Selected Hospital Detail */}
        <AnimatePresence>
          {selectedHospital && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <Card className="border-primary/20 bg-primary/[0.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        <div>
                          <h2 className="text-lg font-bold">{selectedHospital.name}</h2>
                          <p className="text-xs text-muted-foreground">{selectedHospital.address}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedHospital.specialties.map(s => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" /> {selectedHospital.rating}
                        </span>
                        {selectedHospital.has_emergency && (
                          <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                            <Ambulance className="w-3.5 h-3.5" /> Emergency
                          </span>
                        )}
                        {selectedHospital.accreditation && (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs">
                            <Shield className="w-3.5 h-3.5" /> {selectedHospital.accreditation}
                          </span>
                        )}
                        {selectedHospital.distance != null && (
                          <span className="flex items-center gap-1 text-blue-500 text-xs">
                            <Navigation className="w-3.5 h-3.5" /> {selectedHospital.distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      {selectedHospital.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {selectedHospital.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" asChild>
                        <Link href={`/book?hospital=${selectedHospital.id}`}>Book Appointment →</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.open(
                            `https://www.openstreetmap.org/?mlat=${selectedHospital.lat}&mlon=${selectedHospital.lng}#map=17/${selectedHospital.lat}/${selectedHospital.lng}`,
                            "_blank"
                          );
                        }}
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1" /> Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function HospitalListCard({
  hospital: h,
  isSelected,
  onClick,
}: {
  hospital: Hospital;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "hover:border-muted-foreground/20 hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <h4 className="text-sm font-semibold truncate">{h.name}</h4>
              {h.has_emergency && (
                <Badge variant="destructive" className="text-[8px] h-4 px-1.5 flex-shrink-0">ER</Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate mb-1.5">
              📍 {h.district} · {h.address.split(",").slice(-1)[0]?.trim()}
            </p>
            <div className="flex flex-wrap gap-1">
              {h.specialties.slice(0, 3).map(s => (
                <Badge key={s} variant="secondary" className="text-[8px] h-4 px-1.5">{s}</Badge>
              ))}
              {h.specialties.length > 3 && (
                <Badge variant="secondary" className="text-[8px] h-4 px-1.5">+{h.specialties.length - 3}</Badge>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 space-y-1">
            <div className="flex items-center gap-0.5 text-amber-500 text-xs justify-end">
              <Star className="w-3 h-3 fill-current" /> {h.rating}
            </div>
            {h.distance != null && (
              <div className="text-[10px] text-blue-500 font-medium">
                {h.distance.toFixed(1)} km
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
