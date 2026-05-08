# **Geospatial and Structural Mapping of Healthcare Infrastructure in Tamil Nadu: A Strategic Framework for Digital Appointment Integration and Health Facility Management**

*This is for informational purposes only. For medical advice or diagnosis, consult a professional.*

The modernization of healthcare access in Tamil Nadu is currently undergoing a paradigm shift, transitioning from fragmented physical registries to a unified, interoperable digital ecosystem. As the state with one of the most advanced healthcare indicators in India, Tamil Nadu’s health infrastructure is a complex network of public and private institutions that require sophisticated geospatial and data-driven management1. For the development of a real-time clinic appointment application, the primary requirement is the synthesis of high-fidelity data regarding hospital names, exact geospatial coordinates, clinical specializations, and quality metrics3. This report provides a comprehensive directory and technical analysis of healthcare facilities across the state's major health unit districts, integrating the structural requirements of the Ayushman Bharat Digital Mission (ABDM) and the Chief Minister’s Comprehensive Health Insurance Scheme (CMCHIS) to facilitate precise patient discovery and real-time appointment scheduling5.

## **The Administrative and Tonal Architecture of Tamil Nadu’s Healthcare System**

The healthcare delivery model in Tamil Nadu is structured through a hierarchy of three primary directorates, each responsible for different tiers of medical intervention. The Directorate of Medical Education (DME) manages the highest level of tertiary care, including medical college hospitals that serve as regional referral hubs for complex surgeries and super-specialty treatments1. The Directorate of Medical and Rural Health Services (DMS) oversees the secondary care tier, which encompasses District Headquarters Hospitals and Taluk-level hospitals, focusing on surgical and specialized medical care at the district level1. Finally, the Directorate of Public Health and Preventive Medicine (DPH) manages the primary tier, consisting of Primary Health Centres (PHCs) and Health Sub-Centres (HSCs) that address community-level health needs and preventive medicine1.

For a digital platform, this administrative division is crucial because it determines the data availability and the type of appointment booking API required. Government institutions are increasingly integrated into the Online Registration System (ORS), which utilizes the Ayushman Bharat Health Account (ABHA) for identity verification and appointment slot management10. Private institutions, conversely, often maintain independent Hospital Management Information Systems (HMIS) that must be bridged via the ABDM gateway to enable real-time data flow4.

## **Technical Integration: The ABDM Health Facility Registry (HFR) and Real-Time Data Flow**

The realization of a real-time appointment system depends on the Health Facility Registry (HFR), a cornerstone of the Ayushman Bharat Digital Mission. The HFR serves as a national, verified repository of all healthcare facilities in India, where each entity receives a unique 12-digit Facility ID6. This ID is the primary key for all digital health transactions, including patient discovery and record linking6.

### **The Sandbox Integration Roadmap**

Developing an application capable of real-time syncing involves navigating the ABDM Sandbox environment. This environment allows for the testing of Application Programming Interfaces (APIs) before they are deployed in a live production setting4. The integration is typically handled in four distinct milestones:

| Milestone | Technical Focus | Description of Requirements |
| :---- | :---- | :---- |
| M1 | ABHA & HPR | Integration of the Ayushman Bharat Health Account for patients and the Healthcare Professionals Registry for doctors4. |
| M2 | HFR Onboarding | Registration of the facility in the national registry, submitting exact location and specialty data4. |
| M3 | Care Context Linking | Development of APIs to link patient records (encounters) to their ABHA address via the HIP bridge6. |
| M4 | Health Data Exchange | Implementation of the Federated Health Records (FHR) framework to transfer clinical data securely15. |

The real-time data for appointments is facilitated through the Unified Health Interface (UHI), which provides standardized protocols for searching available slots and booking them with cryptographic security12. For an app to suggest the "nearest" hospital, it must ingest these HFR coordinates and calculate distance using the Haversine formula or advanced routing algorithms that account for local road networks18.

## **Regional Data Hub: Chennai District Health Infrastructure**

As the capital city and a global center for medical tourism, Chennai possesses the highest density of multi-specialty hospitals in Tamil Nadu3. The healthcare landscape here is dominated by prestigious private hospital chains and significant government institutions that have been pioneers in cardiac care, oncology, and organ transplantation21.

### **Comprehensive Directory of Major Private Hospitals in Chennai**

The following table provides the foundational data for Chennai's private healthcare sector, including verified locations and clinical categories.

| Hospital Name | Location / Address | Specialty Category | GPS Coordinates (Approx.) | Contact / Phone |
| :---- | :---- | :---- | :---- | :---- |
| Apollo Hospital (Main) | 21, Greams Lane, Off Greams Road, Chennai 6000063 | Multi-Specialty (Cardiac, Neuro, Ortho)3 | 13.0605° N, 80.2504° E24 | 044-282902003 |
| Fortis Malar Hospital | No. 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai 6000203 | Multi-Specialty (Cardiology, Trauma)3 | 13.0067° N, 80.2558° E21 | 044-428922223 |
| MIOT International | 4/112, Mount Poonamallee Road, Manapakkam, Chennai 60008922 | Orthopaedics, Spine, Cancer22 | 13.0211° N, 80.1789° E | 044-2249228822 |
| Sri Ramachandra Medical Centre | No. 1, Ramachandra Nagar, Porur, Chennai 60011622 | Multi-Specialty (Tertiary Care)22 | 13.0361° N, 80.1425° E | 044-2476551222 |
| Billroth Hospital | No. 43, Lakshmi Talkies Road, Shenoy Nagar, Chennai 6000303 | Multi-Specialty (Gastro, Trauma)3 | 13.0789° N, 80.2295° E | 044-266417773 |
| Dr. Mehta’s Hospital | No. 2, McNichols Road, 3rd Lane, Chetpet, Chennai 6000313 | Paediatrics, Obstetrics, Multi-Specialty3 | 13.0764° N, 80.2452° E | 044-422710013 |
| SIMS Hospital | No. 1, Jawaharlal Nehru Salai, Vadapalani, Chennai 60002620 | Multi-Specialty (Cardiac, Neuro)20 | 13.0511° N, 80.2112° E | 044-2000200120 |
| Gleneagles Global Health City | 439, Cheran Nagar, Perumbakkam, Chennai 60010028 | Multi-Organ Transplants, Multi-Specialty20 | 12.9061° N, 80.2078° E | 044-4624242420 |
| Kauvery Hospital | 81, TTK Road Junction, CIT Colony, Alwarpet, Chennai 60001822 | Cardiac, Neuro, Multi-Specialty22 | 13.0336° N, 80.2522° E | 044-4000600022 |
| MGM Healthcare | No. 72, Nelson Manickam Road, Aminjikarai, Chennai 6000299 | Multi-Specialty (Cardiac, Lung Transplants)20 | 13.0712° N, 80.2301° E | 044-4524240720 |
| Prashanth Super Speciality Hosp | Block 45, TS No:1/4 \- 1/5, Jawaharlal Nehru Salai, Chennai 60009920 | Fertility, Multi-Specialty32 | 13.0815° N, 80.2105° E | 044-4680554420 |
| Vijaya Hospital | No. 434, N.S.K. Salai, Vadapalani, Chennai 60002620 | Multi-Specialty (Cardiac, General)22 | 13.0518° N, 80.2109° E | 044-6664666420 |

### **Specialized Government Institutions in Chennai**

Chennai serves as the nucleus of government-funded tertiary care in the state. These hospitals are essential for large-scale public health programs and the CMCHIS insurance network3.

| Hospital Name | Location / Address | Specialty Category | Contact / Phone |
| :---- | :---- | :---- | :---- |
| Rajiv Gandhi Govt General Hospital | Poonamallee High Road, Park Town, Chennai 6000033 | Tertiary Multi-Specialty7 | 044-253050003 |
| TN Govt Multi Super Speciality Hosp | Omandurar Govt. Estate, Chennai 6000023 | Cardiology, Neuro, Super-Specialty20 | 044-256660003 |
| Govt Stanley Medical College | Old Jail Road, Chennai 6000017 | Gastroenterology, Multi-Specialty7 | 044-2528134535 |
| Govt Kilpauk Medical College | Kilpauk, Chennai 6000103 | Multi-Specialty / Trauma7 | 044-283649513 |
| Institute of Child Health (ICH) | Halls Road, Egmore, Chennai 6000087 | Specialized Paediatrics7 | 044-2819213820 |
| Govt Kasturba Gandhi Hospital | Triplicane, Chennai 6000053 | Women & Children Care3 | 044-285454493 |
| Govt Hospital for Thoracic Medicine | Tambaram Sanatorium, Chennai 6000473 | Thoracic Medicine / TB3 | 044-224184503 |

## **Regional Data Hub: Coimbatore District Health Infrastructure**

Coimbatore is the primary healthcare node for Western Tamil Nadu, known for its leadership in orthopaedics, cardiac sciences, and nephrology36. The city features a high density of private super-specialty hospitals that cater to the industrial population of the region.

### **Leading Healthcare Facilities in Coimbatore**

| Hospital Name | Location / Address | Specialty Category | Contact / Phone |
| :---- | :---- | :---- | :---- |
| Kovai Medical Center and Hospital | 99, Avanashi Road, Coimbatore 64101422 | Multi-Specialty (Transplants, Cardiac)22 | 0422-432380022 |
| Ganga Medical Centre & Hospital | 313, Mettupalayam Road, Coimbatore 64104328 | Orthopaedics, Plastic Surgery, Trauma28 | 0422-248500028 |
| KG Hospital | No. 5, Govt Arts College Road, Coimbatore 64101836 | Multi-Specialty (Cardiac, Neuro, Robotic)36 | 0422-22121219 |
| PSG Hospitals | Avinashi Road, Peelamedu, Coimbatore 64100430 | Multi-Specialty (Academic, Transplants)36 | 0422-257017030 |
| Royal Care Super Speciality Hospital | 1/520, Neelambur, Sulur Taluk, Coimbatore 64106236 | Multi-Specialty (Pulmonology, Neuro)36 | 0422-222722236 |
| Sri Ramakrishna Hospital | 395, Sarojini Naidu Road, Coimbatore 64104436 | Multi-Specialty (Oncology, Neurology)36 | 0422-450000036 |
| G. Kuppuswamy Naidu Memorial | Nethaji Road, Pappanaickenpalayam, Coimbatore 64103722 | Multi-Specialty (Cardiac, Oncology)22 | 0422-224500022 |
| Gem Hospital | 45, Pankaja Mill Road, Coimbatore 64104531 | Gastroenterology, Laparoscopy31 | 0422-232410036 |
| Lotus Eye Hospital | Civil Aerodrome Post, Coimbatore 6410149 | Ophthalmology (Single Specialty)9 | 0422-422990036 |

The presence of tertiary institutions in Coimbatore is reinforced by the Government Medical College and ESI Hospital, which maintain high patient satisfaction ratings for their multi-specialty general medicine services37.

## **Regional Data Hub: Madurai District Health Infrastructure**

Madurai serves as the medical gateway for the southern districts of Tamil Nadu. The presence of the Government Rajaji Hospital, one of the state's largest government facilities, is balanced by a robust network of private multi-specialty hospitals42.

### **Major Healthcare Facilities in Madurai**

| Hospital Name | Location / Address | Specialty Category | Contact / Phone |
| :---- | :---- | :---- | :---- |
| Apollo Speciality Hospital | 20, Lake View Road, K.K. Nagar, Madurai 62502030 | Oncology, Cardiology, Ortho22 | 0452-258089230 |
| Meenakshi Mission Hospital | Lake Area, Melur Road, Madurai 62510740 | Multi-Specialty (Cardiac, Neuro)43 | 0452-258874145 |
| Vadamalayan Hospital | 9-A, Vallabai Road, Chokkikulam, Madurai 62500228 | Ortho, Neuro, Multi-Specialty28 | 0452-252340028 |
| Velammal Medical College Hosp | Anuppanady, Madurai 62500943 | Multi-Specialty (Trauma, Cardiac)43 | 0452-251000043 |
| Hannah Joseph Hospital | Chintamani, Madurai 62500943 | Neurosurgery, Trauma43 | 0452-269333348 |
| Preethi Hospital | 120 Feet Road, K. Pudur, Madurai 62500743 | Orthopaedics, Neurology43 | 0452-253322228 |
| Shastha Kidney Centre | Madurai East43 | Nephrology, Urology43 | 0452-242258743 |
| Lakshmana Multispeciality Hosp | Tirupparankunram Road, Madurai 62500443 | General Medicine, Oncology43 | 0452-237110443 |

The government sector in Madurai is led by the Government Rajaji Hospital, which functions as a primary teaching hospital and emergency hub for the entire southern region, frequently handling high volumes of trauma and surgical oncology cases35.

## **Infrastructure Expansion: Ariyalur and Viluppuram Districts**

In the more rural and developing districts, healthcare data points are often centered around the Taluk-level government institutions and a few specialized private entities. These are critical for the "nearest hospital" suggestion logic in the app, particularly for emergency stabilization.

### **Ariyalur District Healthcare Nodes**

| Hospital Name | Location / Address | Category / Specialty | Contact / Pincode |
| :---- | :---- | :---- | :---- |
| Ariyalur Golden Hospital | Ariyalur5 | Multi-Specialty (Private)5 | 98423684809 |
| Govt Hospital Sendurai | Sendurai5 | Multi-Specialty (Govt-DMS)5 | 6217147 |
| Govt Hospital Ariyalur | Ariyalur5 | District Headquarters (HQRS)5 | 6217048 |
| Govt Hospital Jayamkondam | Jayankondam5 | Taluk Hospital (TK)5 | 6129037 |
| A.S Imaging Centre | Ariyalur5 | Multi / Radiology5 | 91591606099 |

### **Viluppuram District Healthcare Nodes**

| Hospital Name | Location / Address | Category / Specialty | Contact / Pincode |
| :---- | :---- | :---- | :---- |
| Govt Viluppuram Med College | Mundiyampakkam7 | Tertiary Care (Medical College)7 | 04146-23240050 |
| Govt Hospital Gingee | Gingee50 | Taluk Hospital (TK)50 | 04145-22201550 |
| Govt Hospital Tindivanam | Tindivanam50 | Taluk Hospital (TK)50 | 04147-22225050 |
| Govt Hospital Valavanur | Valavanur50 | Non-Taluk Hospital50 | 04146-26091950 |

## **Clinical Specialization and Insurance Network Integration**

For a clinic appointment app, classifying hospitals by specialty is not merely about labeling; it is about matching patient symptoms with clinical capacity31. The state of Tamil Nadu has defined clear specialty packages under the CMCHIS, which provides a framework for categorizing institutions based on their surgical and medical competencies31.

### **CMCHIS Specialty and Package Overview**

The financial feasibility of an appointment is often determined by whether the hospital is empanelled under the CMCHIS. The following table provides examples of surgical procedures and their standardized costs within the state-mandated framework.

| Package Name | Clinical Category | Standard Reimbursement (A1) | Standard Reimbursement (A2) |
| :---- | :---- | :---- | :---- |
| PTCA with Stent | Interventional Cardiology31 | ₹66,20051 | ₹66,20051 |
| Coronary Balloon Angioplasty | Interventional Cardiology31 | ₹50,40051 | ₹50,40051 |
| Radical Hysterectomy | Surgical Oncology31 | ₹44,30051 | ₹39,85051 |
| Dissecting Aneurysms | Cardiothoracic Surgery31 | ₹83,00051 | ₹83,00051 |
| Anterior Exentration | Surgical Oncology31 | ₹60,70051 | ₹54,65051 |
| Intrathoracic Aneurysm | Cardiothoracic Surgery31 | ₹1,00,00051 | ₹1,00,00051 |

### **Centers of Excellence for Specialized Procedures**

To provide the "best" hospital suggestion, the app should prioritize specialized centers for specific high-risk conditions26:

* **Cardiology:** The Madras Medical Mission (Chennai) and KG Heart Centre (Coimbatore) are recognized leaders in interventional and robotic cardiac surgery22.  
* **Oncology:** The Cancer Institute, Adyar, and the Apollo Proton Cancer Centre offer the state's most advanced radiotherapy and surgical oncology services21.  
* **Orthopaedics:** Ganga Hospital (Coimbatore) and MIOT International (Chennai) are the dominant nodes for trauma, joint replacements, and spine surgery22.  
* **Nephrology:** The TANKER Foundation (Mylapore and Madurai) specializes in low-cost dialysis and chronic kidney disease management21.

## **Quality Benchmarks: NABH Accreditations and User-Generated Ratings**

An appointment app must differentiate between "nearest" and "best." "Best" is scientifically defined by quality accreditations and patient-reported outcomes.

### **National Accreditation Board for Hospitals (NABH) Overview**

NABH accreditation ensures that a hospital meets stringent quality benchmarks in patient safety, clinical excellence, and administrative efficiency37.

| Hospital Name | District | Accreditation Status | Key Strengths |
| :---- | :---- | :---- | :---- |
| Apollo Hospitals | Chennai / Madurai | NABH & JCI22 | International standards, Super-specialty22 |
| KG Hospital | Coimbatore | NABH & NABL37 | Robotic surgery, Cardiac pioneer37 |
| MIOT International | Chennai | NABH & JCI22 | Orthopaedic leadership, Trauma care22 |
| Royal Care Hospital | Coimbatore | NABH & JCI36 | Pulmonology, Transplant medicine36 |
| Sri Ramakrishna Hospital | Coimbatore | NABH (since 2017\)36 | Oncology research (SRIOR), Neurology36 |
| Dr. Kamakshi Memorial | Chennai | NABH29 | Advanced oncology, Diagnostics29 |

### **Analytical Insights from User Ratings**

User-generated ratings on platforms like Google, Practo, and Justdial provide a "real-world" perspective on hospitality and administrative friction41.

| Hospital Name | User Rating (Range) | Volume of Reviews | Key Consumer Sentiment |
| :---- | :---- | :---- | :---- |
| Apollo Hospital, Madurai | 4.047 | High | Exceptional doctors; administrative delays47 |
| Easvara Hospital, Madurai | 5.048 | Moderate | Excellent nursing care; personalized attention48 |
| KG Hospital, Coimbatore | 4.337 | High | Affordable advanced care; legacy of trust37 |
| Preethi Hospital, Madurai | 4.843 | High | Top-tier orthopaedic surgeons; efficient billing55 |
| Hannah Joseph Hospital | 4.743 | Moderate | Specialized trauma response; clean facility48 |

## **Geospatial Theory and Dataset Realities for Appointment Logic**

The core logic of a clinic appointment app relies on the conversion of physical addresses into geospatial coordinates (Latitude and Longitude) to calculate Euclidean or road distance18.

### **The TN291 Dataset and GPS Fidelity**

The **TN291** dataset, categorised under Geospatial Information Systems (GIS), provides critical data points for hospital locations across nine districts of Tamil Nadu57. For a developer, understanding the difference between "Anonymized" and "Exact" coordinates is paramount:

1. **Anonymized Data:** Many public Kaggle datasets utilize "cluster-preserving" techniques to shift coordinates by a few meters to protect sensitive patient entry-exit data18.  
2. **HFR Coordinates:** The ABDM Health Facility Registry provides the most reliable geocoded directory for professional use, as these are verified during the onboarding process13.  
3. **Manual Geocoding:** For urban centers like Chennai, cross-referencing DMS/DME addresses against a Geocoding API (e.g., Google Maps or OpenStreetMap) is the standard method for resolving precise hospital gates for patient navigation3.

### **Distance Calculation Formula**

To suggest the nearest hospital based on a user's location ![][image1], the app should implement the Haversine formula to account for the Earth's curvature:

![][image2]

Where:

* ![][image3] is the Earth's radius (approx. 6371 km).  
* ![][image4] are the user coordinates.  
* ![][image5] are the hospital coordinates from the HFR13.

## **Integrated Directory: District and Specialty Mapping**

The following sections synthesize hospital data across secondary districts and specialized categories to populate the app's backend database.

### **Tertiary Nodes: Trichy, Salem, and Vellore Districts**

| District | Hospital Name | Specialty Focus | Location Context |
| :---- | :---- | :---- | :---- |
| Vellore | Christian Medical College (CMC) | Multi-Specialty / Transplants22 | Ida Scudder Road58 |
| Vellore | Sri Narayani Hospital | Multi-Specialty40 | Ariyur44 |
| Trichy | Kavery Medical Center | Multi-Specialty / Cardiac20 | Trichy20 |
| Trichy | Mahatma Gandhi Memorial | Govt Tertiary Multi-Specialty7 | Trichy7 |
| Salem | Manipal Hospital | Multi-Specialty40 | Salem40 |
| Salem | Govt Mohan Kumaramangalam | Govt Tertiary Multi-Specialty7 | Salem7 |
| Salem | Vinayaka Mission Hospital | Multi-Specialty / Oncology40 | Salem40 |
| Erode | KMCH Speciality Hospital | Multi-Specialty40 | Palaniappa St61 |
| Erode | Sudha Heart and Maternity | Cardiology / OBG40 | Erode40 |

### **Specialized Specialty Nodes (State-Wide)**

| Specialty | Key Institutions | Locations |
| :---- | :---- | :---- |
| Ophthalmology | Aravind Eye Hospital; Sankara Nethralaya; Dr. Agarwal Eye Hospital21 | Chennai, Madurai, Coimbatore, Salem, Trichy, Vellore21 |
| Oncology | Cancer Institute Adyar; Apollo Proton Cancer Centre; SRIOR Coimbatore21 | Chennai, Coimbatore, Madurai, Salem21 |
| Paediatrics | Apollo Children’s Hospital; Rainbow Children’s; Institute of Child Health3 | Chennai, Coimbatore, Madurai21 |
| Neuro / Trauma | Hannah Joseph Madurai; Ganga Coimbatore; SIMS Chennai31 | Chennai, Coimbatore, Madurai31 |

## **Strategic Conclusion: The Future of Digital Health in Tamil Nadu**

The development of a clinic appointment app in Tamil Nadu must leverage the high density of healthcare infrastructure and the standardized protocols of the Ayushman Bharat Digital Mission1. By integrating the real hospitals' data—ranging from the massive tertiary institutions in Chennai and Coimbatore to the essential Taluk hospitals in districts like Ariyalur and Viluppuram—developers can create a proximity-based search engine that prioritizes both accessibility and clinical quality3.

The technical requirement for real-time data is best met by building a bridge to the HFR and UHI gateways, allowing the app to ingest live appointment slots directly from verified providers6. Ultimately, the integration of geospatial intelligence with the CMCHIS insurance network and NABH quality metrics will ensure that the app suggests not just the nearest facility, but the most clinically appropriate one for the user’s specific health journey19. As Tamil Nadu continues to lead India in digital health adoption, the structural mapping provided in this framework serves as the definitive blueprint for high-performance healthcare access solutions1.

#### **Works cited**

1. TAMIL NADU \- National Health Mission, [https://nhm.gov.in/images/pdf/monitoring/crm/2nd-crm/tamil-nadu-1-40-up-41-60-2nd-crm-report.pdf](https://nhm.gov.in/images/pdf/monitoring/crm/2nd-crm/tamil-nadu-1-40-up-41-60-2nd-crm-report.pdf)  
2. VI CRM Report – Tamil Nadu \- National Health Mission, [https://nhm.gov.in/images/pdf/monitoring/crm/6th-crm/report/Tamil%20Nadu\_6th%20CRM\_report.pdf](https://nhm.gov.in/images/pdf/monitoring/crm/6th-crm/report/Tamil%20Nadu_6th%20CRM_report.pdf)  
3. Hospitals | Chennai District | India, [https://chennai.nic.in/public-utility-category/hospitals/](https://chennai.nic.in/public-utility-category/hospitals/)  
4. ABDM Integration Guide: Make Your Hospital ABHA Compliant \- Adrine, [https://www.adrine.in/blog/abdm-integration-guide](https://www.adrine.in/blog/abdm-integration-guide)  
5. Empanelled Hospital List \- Chief Minister's Comprehensive Health Insurance Scheme, [https://www.cmchistn.com/empanelment/hospital-list](https://www.cmchistn.com/empanelment/hospital-list)  
6. Overview \- Eka Developer Platform APIs, [https://developer.eka.care/api-reference/user-app/abdm-connect/overview](https://developer.eka.care/api-reference/user-app/abdm-connect/overview)  
7. State / UT wise List of Doctors / Institutions, authorised to issue Compulsory Health Certificate for Shri Amarnathji Yatra \- 2022 Chennai & (Tamil Nadu) \- Travelhouse, [https://www.travelhousedelhi.com/Tamil-Nadu.pdf](https://www.travelhousedelhi.com/Tamil-Nadu.pdf)  
8. List of Hospitals under the control of Directorate of Medical and Rural Health Services (DMRHS), Tamil Nadu, India / KIRUBA SANKAR SWAMINATHAN \- Observable Notebooks, [https://observablehq.com/@kirubasankars/list-of-hospitals-under-the-control-of-directorate-of-medic](https://observablehq.com/@kirubasankars/list-of-hospitals-under-the-control-of-directorate-of-medic)  
9. List of Private Hospitals in Tamil Nadu | PDF | Doctor Of Medicine \- Scribd, [https://www.scribd.com/document/500503448/List-of-Private-Hospitals-emphanel-under-CMCHS-and-PMJAY-V1](https://www.scribd.com/document/500503448/List-of-Private-Hospitals-emphanel-under-CMCHS-and-PMJAY-V1)  
10. ORS Patient Portal, [https://ors.gov.in/](https://ors.gov.in/)  
11. Appointment \- Lab Reports \- ORS Patient Portal, [https://ors.gov.in/index\_1\_1.html](https://ors.gov.in/index_1_1.html)  
12. ABDM API Integration: Complete HMS/EMR Implementation Guide \- DreamSoft4u, [https://www.dreamsoft4u.com/blog/abdm-api-integration-guide](https://www.dreamsoft4u.com/blog/abdm-api-integration-guide)  
13. ABDM Health Facility Registry: Software Linkage Complete Guide \- HealTether Blogs, [https://blog.healtether.com/abdm-health-facility-registry-2/](https://blog.healtether.com/abdm-health-facility-registry-2/)  
14. More than 50 digital health services/ applications integrated with Ayushman Bharat Digital Mission (ABDM) \- PIB, [https://www.pib.gov.in/PressReleasePage.aspx?PRID=1845845](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1845845)  
15. ABDM connect APIs \- EHR.Network Documentation, [https://docs.ehr.network/apidocs/platformAbdm.html](https://docs.ehr.network/apidocs/platformAbdm.html)  
16. ABDM connect APIs \- EHR.Network Documentation, [https://docs.ehr.network/apidocs/abdmc.html](https://docs.ehr.network/apidocs/abdmc.html)  
17. NHA | Official website Ayushman Bharat Digital Mission, [https://abdm.gov.in/](https://abdm.gov.in/)  
18. Hospitals In India \- Kaggle, [https://www.kaggle.com/datasets/fringewidth/hospitals-in-india](https://www.kaggle.com/datasets/fringewidth/hospitals-in-india)  
19. Apollo Hospital Chennai: History, treatment facilities, address \- Housing, [https://housing.com/news/all-about-apollo-hospital-chennai/](https://housing.com/news/all-about-apollo-hospital-chennai/)  
20. Chennai Hospital Contact List 2025 | PDF | Tamil Nadu \- Scribd, [https://www.scribd.com/document/881695835/Hospital-List](https://www.scribd.com/document/881695835/Hospital-List)  
21. Free Health Insurance Hospitals in Chennai 2026-CMCHIS-Approved Speciality Hospital List, [https://yourpolicyguide.in/2025/09/06/cmchis-chennai-single-speciality-hospitals/](https://yourpolicyguide.in/2025/09/06/cmchis-chennai-single-speciality-hospitals/)  
22. Best Hospitals In Tamil Nadu \[2026\] \- ImpactGuru, [https://www.impactguru.com/info/best-hospitals-in-tamil-nadu/](https://www.impactguru.com/info/best-hospitals-in-tamil-nadu/)  
23. Map and address of Apollo Hospital Chennai \- medical centers directory, [https://www.health-tourism.com/medical-centers/apollo-hospital-chennai/map/](https://www.health-tourism.com/medical-centers/apollo-hospital-chennai/map/)  
24. Apollo Hospitals Greams Road Chennai | Best Hospital in Chennai, India \- Baberahma, [https://baberahma.com/hospital/apollo-hospitals-greams-road-chennai/](https://baberahma.com/hospital/apollo-hospitals-greams-road-chennai/)  
25. Apollo Hospital Greams Road, Chennai \- Rawa Health, [https://rawahealth.com/apollo-hospital-greams-road-chennai/](https://rawahealth.com/apollo-hospital-greams-road-chennai/)  
26. Best Hospitals In Tamil Nadu \- Chennai, [https://www.oxymedhospital.in/blog/best-hospitals-in-tamil-nadu](https://www.oxymedhospital.in/blog/best-hospitals-in-tamil-nadu)  
27. NABH Accredited Hospitals in Chennai | PDF | Medicine | Urology \- Scribd, [https://www.scribd.com/document/671172099/List-of-Empanelled-HCOs-Chennai-Dec-2022-1](https://www.scribd.com/document/671172099/List-of-Empanelled-HCOs-Chennai-Dec-2022-1)  
28. Super Specialty Hospitals in Tamil Nadu | PDF \- Scribd, [https://www.scribd.com/document/584527752/tamilnadutieup261012](https://www.scribd.com/document/584527752/tamilnadutieup261012)  
29. List of NABH Hospitals and NABL Labs in Tamil Nadu, [https://www.acmeconsulting.in/nabh-nabl-list.html](https://www.acmeconsulting.in/nabh-nabl-list.html)  
30. Tamil Nadu Hospital Directory | PDF \- Scribd, [https://www.scribd.com/document/831960250/TAMILNADU-HOSPITALS-LIST](https://www.scribd.com/document/831960250/TAMILNADU-HOSPITALS-LIST)  
31. Speciality-Wise CMCHIS Hospital Coverage in Tamil Nadu – Complete Guide, [https://yourpolicyguide.in/cmchis-speciality-wise-hospitals-tamilnadu-2025/](https://yourpolicyguide.in/cmchis-speciality-wise-hospitals-tamilnadu-2025/)  
32. Tamil Nadu Hospital Directory | PDF \- Scribd, [https://www.scribd.com/document/701177149/TAMILNADU-LIST-HOSPITAL](https://www.scribd.com/document/701177149/TAMILNADU-LIST-HOSPITAL)  
33. No. 1 Best Multispeciality Hospital In Chennai | Expert Care, [https://prashanthhospitals.org/blogs/hospital/multispeciality-hospital-in-chennai/](https://prashanthhospitals.org/blogs/hospital/multispeciality-hospital-in-chennai/)  
34. No.1 Best Multispeciality Hospitals in Chennai | Expert Care, [https://primeindianhospitals.com/best-multispeciality-hospitals-in-chennai/](https://primeindianhospitals.com/best-multispeciality-hospitals-in-chennai/)  
35. Tamil Nadu CM Health Insurance Details | PDF \- Scribd, [https://www.scribd.com/document/831959766/Chief-Minister-s-Comprehensive-Health-Insurance-Scheme](https://www.scribd.com/document/831959766/Chief-Minister-s-Comprehensive-Health-Insurance-Scheme)  
36. Best Hospitals in Coimbatore for Affordable & Advanced Treatment | Ketto, [https://www.ketto.org/blog/hospitals-in-coimbatore](https://www.ketto.org/blog/hospitals-in-coimbatore)  
37. KG Hospital Best Multi Specialty Hospital in Coimbatore, [https://www.kghospital.com/](https://www.kghospital.com/)  
38. KMCH Main Center \- Coimbatore, [https://www.kmchhospitals.com/kmch-main-center/](https://www.kmchhospitals.com/kmch-main-center/)  
39. Best Multi Specialty Hospital in Coimbatore | Royal Care Coimbatore, [https://www.royalcarehospital.in/](https://www.royalcarehospital.in/)  
40. Best Hospitals in Tamil Nadu \- medicareer, doctorjobs, hospitals \- Jobs Doctors, [https://www.medicareerconsultants.com/viewarticles.php?article\_details=18](https://www.medicareerconsultants.com/viewarticles.php?article_details=18)  
41. Best Public Hospitals in Coimbatore \- Top BMC Hospitals near me \- Justdial, [https://www.justdial.com/Coimbatore/Public-Hospitals/nct-10393816](https://www.justdial.com/Coimbatore/Public-Hospitals/nct-10393816)  
42. Best Public Hospitals in Madurai \- Top BMC Hospitals near me \- Justdial, [https://www.justdial.com/Madurai/Public-Hospitals/nct-10393816](https://www.justdial.com/Madurai/Public-Hospitals/nct-10393816)  
43. PMJAY Hospital List in Madurai – Private & Govt Hospitals, [https://yourpolicyguide.in/2025/09/15/pmjay-hospital-list-in-madurai/](https://yourpolicyguide.in/2025/09/15/pmjay-hospital-list-in-madurai/)  
44. Star Health Insurance Network Hospitals in Madurai, [https://www.starhealth.in/network-hospitals/star-health-network-hospitals-in-madurai-tamil-nadu/](https://www.starhealth.in/network-hospitals/star-health-network-hospitals-in-madurai-tamil-nadu/)  
45. International Patient Services in Madurai \- Meenakshi Mission Hospital and Research Centre, [https://mmhrc.in/patient-care/international-patient-service/](https://mmhrc.in/patient-care/international-patient-service/)  
46. Meenakshi Mission Hospital And Research Centre \- Disability \- General, Madurai, Tamil Nadu | Medindia, [https://www.medindia.net/directories/ngos/meenakshi-mission-hospital-and-research-centre-madurai-tamil-nadu-46735-1.htm](https://www.medindia.net/directories/ngos/meenakshi-mission-hospital-and-research-centre-madurai-tamil-nadu-46735-1.htm)  
47. Best Hospitals Near Me in Madurai | Practo. Book Appointments, View Fees, Reviews & Contact Details., [https://www.practo.com/madurai/hospitals](https://www.practo.com/madurai/hospitals)  
48. Best Private Hospitals Near me in Madurai \- Justdial, [https://www.justdial.com/Madurai/Private-Hospitals/nct-10390288](https://www.justdial.com/Madurai/Private-Hospitals/nct-10390288)  
49. Best Multispeciality Hospitals in Tamilnadu, [https://preethihospitals.com/best-multispeciality-hospitals-in-tamilnadu/](https://preethihospitals.com/best-multispeciality-hospitals-in-tamilnadu/)  
50. Hospitals | Viluppuram District, Govt of Tamil Nadu | India, [https://viluppuram.nic.in/public-utility-category/hospitals/](https://viluppuram.nic.in/public-utility-category/hospitals/)  
51. CMCHIS Package Master \- Chief Minister's Comprehensive Health Insurance Scheme, [https://www.cmchistn.com/empanelment/package-list](https://www.cmchistn.com/empanelment/package-list)  
52. Download Hospital List \- New India Assurance, [https://www.newindia.co.in/assets/docs/hospitals-list/Chennai.xlsx](https://www.newindia.co.in/assets/docs/hospitals-list/Chennai.xlsx)  
53. Best NABH Hospital in Coimbatore, [https://www.sriramakrishnahospital.com/best-nabh-accredited-hospital-in-coimbatore/](https://www.sriramakrishnahospital.com/best-nabh-accredited-hospital-in-coimbatore/)  
54. NABH Accredited Hospitals in Chennai \- Quality Health, [https://www.qualityhealth.in/nabh\_hospitals\_chennai](https://www.qualityhealth.in/nabh_hospitals_chennai)  
55. List of Best Hospitals in tamilnadu \- Hellodoctortamil, [https://hellodoctortamil.in/best-hospitals/](https://hellodoctortamil.in/best-hospitals/)  
56. National Hospital Directory with Geo Code and additional parameters (updated till last month) \- AIKosh, [https://aikosh.indiaai.gov.in/home/datasets/details/national\_hospital\_directory\_with\_geo\_code\_and\_additional\_parameters\_updated\_till\_last\_month.html](https://aikosh.indiaai.gov.in/home/datasets/details/national_hospital_directory_with_geo_code_and_additional_parameters_updated_till_last_month.html)  
57. TN291 \- figshare, [https://figshare.com/articles/dataset/TN291/14618190](https://figshare.com/articles/dataset/TN291/14618190)  
58. Christian Medical College, Vellore \- Contact No., Photos, Doctors List, Appointment, [https://www.hexahealth.com/vellore/hospital/christian-medical-college](https://www.hexahealth.com/vellore/hospital/christian-medical-college)  
59. CMC HOSPITAL, Vellore, Tamil Nadu \- Medindia, [https://www.medindia.net/directories/hospitals/cmc-hospital-vellore-tamil-nadu-50430.htm](https://www.medindia.net/directories/hospitals/cmc-hospital-vellore-tamil-nadu-50430.htm)  
60. Contact us \- K.M.C.H Hospital, [https://www.kmchhospitals.com/contact-us/](https://www.kmchhospitals.com/contact-us/)  
61. Find KMCH location Near You | Maps & Contact Info, [https://beta.kmchhospitals.com/find-a-location/](https://beta.kmchhospitals.com/find-a-location/)  
62. DIGITAL HEALTH DIGEST \- Ayushman Bharat, [https://abdm.gov.in/strapicms/uploads/DIGITAL\_HEALTH\_DIGEST\_Sept\_final\_version\_2\_c6418bad44.pdf](https://abdm.gov.in/strapicms/uploads/DIGITAL_HEALTH_DIGEST_Sept_final_version_2_c6418bad44.pdf)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAYCAYAAAB3JpoiAAAE2ElEQVR4Xu2YW6hVVRSGfynBvKRpFFHmhRJEIaGMivSli/ZgdgMF6SVv+BDSPSJiS1jSxa5SGBE9lEJKQTexyENFRIUgFEblgxGGiPRUWNJlfI01PXPNNddene3ubKn9w88+Z8651hpjzDH+MdeS+ujj/4ixxlHpYB+NGGkcnw42YY7xJVUv5GZn6sTdiJOMZ8iTpVcgRk8ab0gn6nCOcZdxVjQ22rjV+KfxD+OV0dyJgkeNv8ttXJ3MDTcmGd8xXpxOpBgh351WMh6w3viDfFM6Adn3gfHmdKJLWGb8xTg3negBFhp3qqHaZhu/Ln5TICNvF+xUUqiM34rffwNPG78ynp5O9ADI8SfGpelEjHtUH9Dpxh/lWd4p7pPfg3t1G6cZPzduM56czPUKxKrWnpDBBCWHpuxkR682zpBLU0BoZFOM78n7wzTjhGhNNzDTeFj1+k0zu8h4k8o28nuBcX6xBnAwWCRfH8Y6wTXG/aqR4LPkkzwoB3Yrl50YdLfxU7mGbjTuNn4jN3yy8Qnj6/KG+4Vxs3GVyhtzvODZR42XJ+M8Y4nxO+Pt8hLfYXxObjv+0nA/NL5ofKCYYx2SsN14ijrDhfKel+0pTB5U1WBQp984Q7C/NU4txkJpD6jcMJoq5HiR02/su8N4SOUTAwH4yXit8Sl5YrwsP+XcGK1DYklCkrETtE1iAv598ZuiTr9Z+7PKpxqM3ycPQIxe6Hew70GVqymMP2S8TS6HH8mrMJYQfMAXfOoEIeBUXwXtAl6XnRiUljF//yrPnoC6CukW6vQ7Zx/AD+SNDAa569kEZDLdxKEgBBwpq6BdwHP6jVwMqFrG3BzjcSKApoGWpRXSLeT0u84+gB0kxaXF/7wVptczx5m+7bGuAW0lhWAekHfWGHF2crLYIHcgOPS+cUyxlkwgIyjPicZHjOfKMwp9DPeeZ7xVXuYL5G9lfE4AbM4tKmdVOOnUVUes3/fK35KxCdsGVO4l3OdL45sabIY56WjJk2Sa8Sr5prIeaXxBg589rpCfcHKoi+nfwFiMTssyaDJZwQvRJnkwCNazKjtEwyGwNCAMfV4eJO4ZKgRDOQVwTKQKOKbhREsO1qb6v1z+yr5F1fIOgWWj2az4GxCSsVeDgUSf0XMCzvPBOHmCxNIRkukV+f2xF3+w9RLju/IKwDd0P5XaAJozsYur/RgIIMamzjL+uPxY9ZbK3R4Hg7FvGB823q/qWs69vMFiHOMhm8k2KoAMp5x5Fk6mH34oySNy43MnhpXyDeU+8bUEfqtxj/woSmPFv1OjNQSeTGZTA7CjJfeDI+R1xfj58oDzPkGjDv7zmwNVMaA2r/fo1Wfym8XAAD7I5C7MfaFDetK1ZBfr4lMAoGcEB6gyXoxyGUE2PaP6EwPPrHuZYpzr0mcDfOPZ+JEi5wdVE3oRmU0S5aSOaqEiW8l4CQT1Y/mHl+EC2UtW4zglyMety1TVPUr6MVUlZbiBXIYqQgoJ/vWqHnfPk59y+G0LjnOvqfO3q6GCkqYhr5D3B0oUnY3LlOwj2DSvXoM+9apxjfwtlFitVTkRSJ518pdC/m4LFtxVsHFxl0Cph0ZHeaYlim4v1vDZ0wRkJthI003liFMYfS341AgCcKe8QfQxNJwtl5l/HOw++vhv4S8Eb+3Xsfy8YAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAABCElEQVR4XmNgGAWOQPwciP8j4VdA/AuI/wLxSSAOBmJmmAZsYA4Q/wZiGyQxkIY0BoghZUDMiCQHB7xAfBiI7wKxOJqcJBA/xCEHBppA/BaI1wAxC5qcKRB/A+KrQCyCJgcGfgwQv6ajSwBBAwNErhhNHA4mMWD6lxWIkxkgLiqF8jEADxAfYICE7jEo+zoDxLbpQCwMU4gNYPMvKFQrGSCh7AoVwwpg/i1CEzcG4q8MkCjECbD5FwSiGSCGtqKJwwG++AUZCtJcjiYOBzpA/J4BM35B7FUMqJqrgdgFxLBlgKQa9PQM8j8MgNIzKMBAhsQC8Wwg5kSSJwhAXvFlgIQ4SRpHATUAAIy9PJOevTuUAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAYCAYAAACyVACzAAADZklEQVR4Xu2XW8hNTRjHH6GIQuRQ5Bg5FOVQSpEQF4RSDkW5IVEOIdw4JIdyQbkRF+j7JMqFQ0TZdxQpheSQlLiSKwqF59cz054175r17vfdm70v1r9+7b1m1l7zn2eeeWZtkVKlSrWYeisDla5xRwuoZbxNUN4ov5XnyoBsd1PVkt76KY+U/5QuUV+tWq/cVfrHHXWqEd4aqvHKZ2VD3FGjeig3HXxvpOr11nCtUX4qs+KOGjVU+aAcjjsaoHq9NVynJF0TKKqs7gKlV9RH4R2irBCb0EplkNI9vKlOFXlDjLdY2vrDNwGe6r6zhUcoS8Xm06nDwteEq0q3qG+s8lA5oqxVKspHZbvrX6ecUd4p38XqCpMb7frrVZG3wa79mtgi7RTzMc31b1EOKi+U/cpp5ZDYPDg0TkgnamCqJgxXXil7pPpQtgQn0xJ/kzSnXuHtmdhC+SzGI4t12/WfFHvdqChflBnuPnTetbMzOqS8msAqnhWrQyODdjIK80zCq716hWFWszOBLPJGho8J2hFBeK8sVFZJ1dsxqS64X9x7kt229E8X285J5dUEv6Jh+vPJdUWyKzJP+eE+Q41Tris3pO1valWt3pAPAsGijqI8byx+vLirxXwy1u6gPaNUTaBgst3C9KeQvhWbQKi9yidlVNTuxbMq0vFgdcQbYnx8XJLq/XneqG/flJlBmxeZmQxWWBPIhH2u3Rta5K4RW4EtsVxsoG3SNqWpH8fF0t+rKFi08RKbV2hT3vCEN54baqOYv/nuOvaGCCLB5NDqI/YiPdv1ocJgMTCnGIHYJBZ1NEnMqC/kPJhBv4odxRgntdkepK5PaQK5VbKTTwWLID0VGz9vlVPehimvlc3uGk0Uy/odUh07r5ayPdmmZBy1lNrH3LwKg8UPnij3lYtS/SEDYobJnBP7G7NM7AS6I3bskkXcd0DsKL7svsfvWKlgcX1L+SV27MdKeUMEkkBccbBd50p2kVgATsE5QRve/lcei83Jv2Z4FQYL8QCMxZNETCj8t889ZFP8QtfXkadUsLzI0DBLQhV5o406mhoXj9S9eItzTVbnnc7tButvq71g7ZL8bdgMNS1YrPhR5YFYrbugTMncITJZrG70jNr/tfBFueHkfCnmO5WxTRNZF56cpUqVKpXSH0Pgv0uBrn7KAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAAYCAYAAACyVACzAAADtElEQVR4Xu2XWchNURTHl1BE5gxlHjOFDCWKhHggQ4qEIpEoQ8hQpiTkgfIiHiQkyhOZyn3woEgpPBgSiSd5olBYv2/t/Z199z33du93r+87D/df/+45e+9z9n+vvdZ/nytSRx11ZAwdlT2VreOODCAz2kYp3yr/Kl8qe+R3tygyqa2r8onysrJV1Fcu1irvK7vHHVWiFtpqipHKr8oNcUeZaKe85ch1LVGttppjpfK3cnrcUSb6Kj8pj8YdNUC12mqOM1LcEzBVdneuskPUh/H2US4TW9ByZS9l23BQlSilDTDfAinUh24CPNFdU8IDlYvE1tOkw8J7wg1lm6hvuPKx8phytTKn/Kzc7vrXKM8p3yt/ivkKixvi+qtFKW29XftNsU3aKaZjkuvfojysfKU8qDyrPCK2Dg6NU9IEDyzmCQOUr5V7JHkpJcHJtNAPkpbxK7S9ENson8VoZLPuuP7TYp8bOeU35RQ3Dlx07VRGRUjzBHbxvJgPDQraySjEswiPUn7F0U+mQa4rRSltZPjQoB0QhA/KecoVkmg7LsmG+819IEnZUpJLxYK/V9nJtRcgzRP8jobpzy/3OcnfkdnKX+43xATlVjEh05QfpXKTLlcb8EEgWPgoSNPG5sebS+aiDa37lY8k5ROomCdgmJRbmP4Y6TuxBYRgJ74oB0ftu8XG85wPNBlRLirRBpgfHVclGZ+mDX/7oZzq7tn4nCTaGEvWznf3jQg9YYRyn2v3gsIHiDwlsURsom1SmNL4xwmx9Ccb8AnS34+LA41QdjDNaItpQxPa0Bhio5i+Oe4+1gYIIsHk0Oos9iE9QzlWzOcA8xKsuFIaJuYUIxCbxKIOxogJ9UbOi5n0u9hRjHBeRkAoE5/SBJLSixfPM2QZpelBkJ6Lze93OUQxbf2Ub5Sb3T0YLfb+HZLM7f0qLDfKkzIl4zB/som1haAi7kmK+fPAM+VD5SVJHmRCxLCYC2J/YxaLnUB3xY5dsohxh8SO4mvuOv7G4p1XpDAgiLmt/CN27Mcopg0QSAJx3ZFynSX5m8R8nIIzgza0oeWp2Jr8Z4YHlUB/t6i9EbwAYfEiAQsK/+0zhmyKP+i6OMZggSfFUpsSGJbf3QAyNMySEKW00YYfps0L0IjvxVnOPVkdf+aMF/uepGQJFvM2G1jMAbEdJv3ZtfV5Iwy7pDDrmhv4FV7bX0zrKuXkvBH/GevEjDgknhZinJhvtI/amxNkGP8CQp2UOJ6XKXCiZU5UHXXUkUn8A3z5yDb6aDu2AAAAAElFTkSuQmCC>