const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const email = "Admin@gmail.com";
  const password = "Admin@123";

  const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();

  if (existingUser) {
    console.log("Admin user already exists. Updating password...");
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    await supabase.from("users").update({ password: password_hash }).eq("id", existingUser.id);
    console.log("Password updated to Admin@123");
  } else {
    console.log("Creating Admin user...");
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const { error } = await supabase.from("users").insert([
      { name: "Administrator", email, password: password_hash }
    ]);
    if (error) console.error("Error creating user:", error);
    else console.log("Admin user created successfully!");
  }
}
run();
