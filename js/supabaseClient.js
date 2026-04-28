// Supabase Client Initialization
const SUPABASE_URL = 'https://dmycecenrwuoogjusfgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteWNlY2Vucnd1b29nanVzZmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDQ5NTgsImV4cCI6MjA5Mjg4MDk1OH0.4kjml5rWa-l0_45ReeODPLgl6BzLNKs9pl79D3dtz5w';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions for Supabase operations
const DB = {
  async getAll(table, orderBy = 'created_at', ascending = false) {
    const { data, error } = await db.from(table).select('*').order(orderBy, { ascending });
    if (error) { console.error(`Error fetching ${table}:`, error); return []; }
    return data || [];
  },

  async getById(table, id) {
    const { data, error } = await db.from(table).select('*').eq('id', id).single();
    if (error) { console.error(`Error fetching ${table} by id:`, error); return null; }
    return data;
  },

  async getWhere(table, column, value, orderBy = 'created_at') {
    const { data, error } = await db.from(table).select('*').eq(column, value).order(orderBy);
    if (error) { console.error(`Error querying ${table}:`, error); return []; }
    return data || [];
  },

  async insert(table, record) {
    const { data, error } = await db.from(table).insert(record).select().single();
    if (error) { console.error(`Error inserting into ${table}:`, error); throw error; }
    return data;
  },

  async update(table, id, updates) {
    const { data, error } = await db.from(table).update(updates).eq('id', id).select().single();
    if (error) { console.error(`Error updating ${table}:`, error); throw error; }
    return data;
  },

  async delete(table, id) {
    const { error } = await db.from(table).delete().eq('id', id);
    if (error) { console.error(`Error deleting from ${table}:`, error); throw error; }
  },

  // Get doctors with hospital info joined
  async getDoctorsWithHospital() {
    const { data, error } = await db.from('doctors').select('*, hospitals(name, address)').order('name');
    if (error) { console.error('Error fetching doctors:', error); return []; }
    return data || [];
  },

  // Get appointments with priority ordering
  async getAppointmentsPriority(date = null) {
    let query = db.from('appointments').select('*').eq('status', 'confirmed');
    if (date) query = query.eq('appointment_date', date);
    // Critical first, then by created_at
    const { data, error } = await query.order('severity', { ascending: true }).order('created_at', { ascending: true });
    if (error) { console.error('Error fetching appointments:', error); return []; }
    return data || [];
  },

  // Check if a time slot is booked
  async isSlotBooked(doctorId, date, timeSlot) {
    const { data, error } = await db.from('appointments')
      .select('id').eq('doctor_id', doctorId).eq('appointment_date', date)
      .eq('time_slot', timeSlot).eq('status', 'confirmed');
    if (error) return false;
    return data && data.length > 0;
  },

  // Get doctor leaves
  async getDoctorLeaves(doctorId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await db.from('doctor_leaves').select('*')
      .eq('doctor_id', doctorId).gte('leave_end', today).order('leave_start');
    if (error) return [];
    return data || [];
  },

  // Check if doctor is on leave for a specific date
  async isDoctorOnLeave(doctorId, date) {
    const { data, error } = await db.from('doctor_leaves').select('*')
      .eq('doctor_id', doctorId).lte('leave_start', date).gte('leave_end', date);
    if (error) return false;
    return data && data.length > 0;
  },

  // Subscribe to real-time changes
  subscribeToTable(table, callback) {
    return db.channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  }
};
