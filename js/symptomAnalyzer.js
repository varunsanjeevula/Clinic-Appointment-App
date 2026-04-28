// Symptom Analysis Engine
// Keyword-based triage system for classifying symptoms as critical or normal

const SymptomAnalyzer = {
  // Critical symptom keywords and their associated specialties
  criticalKeywords: {
    'chest pain': ['Cardiology', 'Emergency Medicine'],
    'heart attack': ['Cardiology', 'Emergency Medicine', 'Cardiac Surgery'],
    'difficulty breathing': ['Pulmonology', 'Emergency Medicine'],
    'breathless': ['Pulmonology', 'Emergency Medicine'],
    'shortness of breath': ['Pulmonology', 'Emergency Medicine'],
    'unconscious': ['Emergency Medicine', 'Neurology'],
    'fainted': ['Emergency Medicine', 'Neurology', 'Cardiology'],
    'severe bleeding': ['Emergency Medicine', 'General Surgery'],
    'heavy bleeding': ['Emergency Medicine', 'General Surgery'],
    'seizure': ['Neurology', 'Emergency Medicine'],
    'convulsion': ['Neurology', 'Emergency Medicine'],
    'stroke': ['Neurology', 'Emergency Medicine', 'Neurosurgery'],
    'paralysis': ['Neurology', 'Neurosurgery'],
    'numbness in face': ['Neurology', 'Emergency Medicine'],
    'slurred speech': ['Neurology', 'Emergency Medicine'],
    'severe headache': ['Neurology', 'Emergency Medicine'],
    'high fever': ['General Medicine', 'Emergency Medicine'],
    'fever above 104': ['Emergency Medicine'],
    'anaphylaxis': ['Emergency Medicine'],
    'severe allergic': ['Emergency Medicine'],
    'poisoning': ['Emergency Medicine'],
    'overdose': ['Emergency Medicine', 'Psychiatry'],
    'suicidal': ['Psychiatry', 'Emergency Medicine'],
    'severe abdominal pain': ['Gastroenterology', 'Emergency Medicine', 'General Surgery'],
    'vomiting blood': ['Gastroenterology', 'Emergency Medicine'],
    'coughing blood': ['Pulmonology', 'Emergency Medicine'],
    'fracture': ['Orthopedics', 'Emergency Medicine'],
    'broken bone': ['Orthopedics', 'Emergency Medicine'],
    'head injury': ['Neurosurgery', 'Emergency Medicine'],
    'deep cut': ['Emergency Medicine', 'General Surgery'],
    'burn': ['Emergency Medicine', 'General Surgery'],
    'severe burn': ['Emergency Medicine', 'General Surgery'],
    'sudden vision loss': ['Emergency Medicine', 'Neurology'],
    'blood in urine': ['Emergency Medicine', 'General Medicine'],
    'severe chest tightness': ['Cardiology', 'Emergency Medicine'],
    'palpitations': ['Cardiology'],
    'irregular heartbeat': ['Cardiology', 'Emergency Medicine']
  },

  // Normal symptom keywords and their associated specialties
  normalKeywords: {
    'headache': ['General Medicine', 'Neurology'],
    'cold': ['General Medicine', 'ENT'],
    'common cold': ['General Medicine'],
    'cough': ['General Medicine', 'Pulmonology'],
    'sore throat': ['ENT', 'General Medicine'],
    'fever': ['General Medicine'],
    'mild fever': ['General Medicine'],
    'body ache': ['General Medicine', 'Orthopedics'],
    'back pain': ['Orthopedics', 'Physiotherapy'],
    'joint pain': ['Orthopedics', 'Rheumatology'],
    'knee pain': ['Orthopedics', 'Sports Medicine'],
    'muscle pain': ['Orthopedics', 'Sports Medicine', 'Physiotherapy'],
    'skin rash': ['Dermatology'],
    'acne': ['Dermatology'],
    'itching': ['Dermatology'],
    'eczema': ['Dermatology'],
    'hair loss': ['Dermatology', 'Trichology'],
    'fatigue': ['General Medicine', 'Endocrinology'],
    'tiredness': ['General Medicine'],
    'nausea': ['Gastroenterology', 'General Medicine'],
    'vomiting': ['Gastroenterology', 'General Medicine'],
    'diarrhea': ['Gastroenterology', 'General Medicine'],
    'constipation': ['Gastroenterology'],
    'stomach ache': ['Gastroenterology', 'General Medicine'],
    'indigestion': ['Gastroenterology'],
    'acid reflux': ['Gastroenterology'],
    'bloating': ['Gastroenterology'],
    'runny nose': ['ENT', 'General Medicine'],
    'ear pain': ['ENT'],
    'sinus': ['ENT'],
    'allergy': ['General Medicine', 'Dermatology'],
    'sneezing': ['ENT', 'General Medicine'],
    'eye strain': ['General Medicine'],
    'insomnia': ['Psychiatry', 'General Medicine'],
    'anxiety': ['Psychiatry'],
    'depression': ['Psychiatry'],
    'stress': ['Psychiatry', 'General Medicine'],
    'weight gain': ['Endocrinology', 'General Medicine'],
    'weight loss': ['Endocrinology', 'General Medicine'],
    'diabetes': ['Endocrinology'],
    'thyroid': ['Endocrinology'],
    'vaccination': ['Pediatrics', 'General Medicine'],
    'child fever': ['Pediatrics'],
    'pregnancy': ['Gynecology'],
    'menstrual': ['Gynecology'],
    'period pain': ['Gynecology'],
    'sprain': ['Orthopedics', 'Sports Medicine'],
    'toothache': ['General Medicine'],
    'dizziness': ['General Medicine', 'Neurology', 'ENT'],
    'weakness': ['General Medicine']
  },

  analyze(symptomText) {
    const text = symptomText.toLowerCase().trim();
    const matchedCritical = [];
    const matchedNormal = [];
    const specialties = new Set();
    let score = 0;

    // Check critical keywords
    for (const [keyword, specs] of Object.entries(this.criticalKeywords)) {
      if (text.includes(keyword)) {
        matchedCritical.push(keyword);
        score += 3;
        specs.forEach(s => specialties.add(s));
      }
    }

    // Check normal keywords
    for (const [keyword, specs] of Object.entries(this.normalKeywords)) {
      if (text.includes(keyword)) {
        matchedNormal.push(keyword);
        score += 1;
        specs.forEach(s => specialties.add(s));
      }
    }

    // Determine severity
    const isCritical = matchedCritical.length > 0 || score >= 6;
    const severity = isCritical ? 'critical' : 'normal';

    // If no keywords matched, default to General Medicine
    if (specialties.size === 0) {
      specialties.add('General Medicine');
    }

    // Generate recommendation text
    let recommendation;
    if (isCritical) {
      recommendation = 'Your symptoms indicate a potentially urgent condition. We strongly recommend seeking immediate medical attention at a hospital with emergency services.';
    } else {
      recommendation = 'Your symptoms appear to be non-urgent. We recommend scheduling an appointment with an appropriate specialist at your convenience.';
    }

    return {
      severity,
      score,
      matchedCritical,
      matchedNormal,
      matchedSymptoms: [...matchedCritical, ...matchedNormal],
      suggestedSpecialties: Array.from(specialties),
      recommendation
    };
  }
};
