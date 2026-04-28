const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const email = "varunsanjeevula91@gmail.com";
  
  const { data: patients } = await supabase.from("patients").select("id").eq("email", email);
  if (patients && patients.length > 0) {
    const patientIds = patients.map(p => p.id);
    
    console.log(`Deleting ${patientIds.length} mock patients with email ${email}...`);
    
    // Delete appointments for these patients
    const { error: apptError } = await supabase.from("appointments").delete().in("patient_id", patientIds);
    if (apptError) console.error("Error deleting appointments:", apptError);
    
    // Delete the patients
    const { error: patError } = await supabase.from("patients").delete().in("id", patientIds);
    if (patError) console.error("Error deleting patients:", patError);
    
    console.log("Mock data cleared successfully!");
  } else {
    console.log("No mock data found for this email.");
  }
}
run();
