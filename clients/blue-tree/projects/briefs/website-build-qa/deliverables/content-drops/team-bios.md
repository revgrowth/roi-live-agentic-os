---
content_drop: team-bios
for_page: /about/team/ (deployed at /about/meet-the-team/)
for_clickup_task: 86afk9khm (Meet the Team Page Template Design)
sourced_from: https://bluetreelandscaping.com/about/meet-the-team/ (live site)
captured: 2026-05-13
captured_by: Claude (under Jason direction)
status: raw — voice-profile cleanup not yet applied
notes: |
  This file gives Raja the team roster + bios needed to fix P8 (BLOCK #1 — Chad's bio shown for all 20+ team cards).
  Bios are verbatim from the current live site (bluetreelandscaping.com). They are the source-of-truth for names, titles, tenure, education, and hobbies — but they have NOT been through the v1.2 voice profile pass yet.
  Raja: wire the data binding first using these as the source, then copy-production team will deliver final brand-voice-cleaned text by 2026-05-21. The structural fix (one bio per person, not Chad-everywhere) unblocks Phase 0; the voice pass is a follow-up swap.
  Known voice issues in the raw bios that copy-production will fix:
    - "Blue Tree Landscaping" appears in body copy on Jeff's, Mark's, and John Mattiola's bios (should be "Blue Tree" or "Blue Tree Outdoor Living" except in legal entity contexts)
    - At least one em-dash will likely surface on a visual sweep
    - Tenure stats: Chad joined 1994 (canonical — voice profile v1.1 §1.6 confirms live-site date; Our Story brief 1.6's "1995" is wrong and is being corrected sitewide)
---

# Team Bios — Phase 0 Content Drop

## Roster summary (21 members)

| # | Name | Title | Department | Headshot needed? |
|---|---|---|---|---|
| 1 | Jeff Mattiola | Owner, President | Leadership | Pending (Maureen confirmed exists) |
| 2 | Chad Ochnich | Owner, Vice President | Leadership | On live site |
| 3 | Nancy Pumilia | Controller | Leadership | On live site |
| 4 | Mike Wadsworth | Pool Construction Manager | Pool | On live site |
| 5 | Jérôme Besnard | Sales Manager | Leadership | On live site |
| 6 | Maureen Mattiola | Marketing Manager | Marketing | On live site |
| 7 | Justin Acal | Pool and Landscape Designer / Sales | Design | On live site |
| 8 | Mark Peasley | Turfcare Manager | Turf | On live site |
| 9 | Robin Grayson | Accountant / HR Assistant | Support | On live site |
| 10 | John Labb | Production Manager | Project Managers | On live site |
| 11 | John Kostesich | Pool Construction Manager | Pool | On live site |
| 12 | James Gonczkowski | Production Manager | Project Managers | On live site |
| 13 | Aggie Kriebel | Administrative Assistant / Accounts Payable Specialist | Support | On live site |
| 14 | Mike Tuhacek | Production Manager | Project Managers | On live site |
| 15 | Andrew Mattiola | Landscape Designer / Sales | Design | On live site |
| 16 | Jose Zavala | Production Manager | Project Managers | On live site |
| 17 | Stephen Roehm | Landscape Designer / Sales | Design | On live site |
| 18 | Andrew Phelan | Pool Service Technician | Pool | On live site |
| 19 | Christopher DiVito | Pool and Landscape Designer / Sales | Design | On live site |
| 20 | Justin Ryen | Production Manager | Project Managers | On live site |
| 21 | John Mattiola | Landscape Design / Sales | Design | On live site |

**Headshot extraction:** All current headshots are visible on `https://bluetreelandscaping.com/about/meet-the-team/`. Raja can pull the existing image URLs from that page or request hi-res versions from Maureen (Drive folder `15ZDZmD2HW64Cuh2hozv1Kc-xmqv9_dCK` is the working media library).

## Department tag mapping (for filter UI)

Per the Meet the Team creative brief, the team page should support filtering by department:

- **Leadership** (4): Jeff, Chad, Nancy, Jérôme
- **Design** (5): Justin Acal, Andrew Mattiola, Stephen Roehm, Christopher DiVito, John Mattiola
- **Pool** (3): Mike Wadsworth, John Kostesich, Andrew Phelan
- **Project Managers** (5): John Labb, James Gonczkowski, Mike Tuhacek, Jose Zavala, Justin Ryen
- **Turf** (1): Mark Peasley
- **Marketing** (1): Maureen
- **Support** (2): Robin, Aggie

**Cross-tag notes (optional, per brief):**
- Jeff: Leadership + Design (he does sales/design too)
- Chad: Leadership + Turf (turf care management background)

## Individual bios (verbatim from live site)

---

### 1. Jeff Mattiola | Owner, President

Jeff has been a key figure in the landscaping industry since 1983 and serves as the President of Blue Tree Landscaping. In this role, he oversees all aspects of the business, including daily operations and strategic direction. Jeff specializes in landscape, hardscape, and pool installations, as well as sales for the company. A graduate of the University of Pittsburgh, he brings a wealth of experience and leadership to the team. Jeff resides in Upper Providence with his wife, Maureen, and their four children. Outside of work, he enjoys reading on the beach, fishing, biking on local trails, vacationing with his family, and relaxing by the pool with his favorite beverage.

**Credentials for Person schema (`hasCredential`):** University of Pittsburgh (bachelor's).
**Knows about (`knowsAbout`):** Landscape, hardscape, pool installations, sales, business operations.
**Tenure:** Since 1983 (founding-era).
**Residence:** Upper Providence, PA.

---

### 2. Chad Ochnich | Owner, Vice President

Chad joined Blue Tree in 1994 and shortly after became part owner. Chad manages the daily operations and productivity of the maintenance crews. He studied at Delaware Valley College and is an expert in turf care management. He also holds a ICPI certification for hardscape installation. Chad lives in Upper Providence with his wife, Anique and they have two children. In his spare time, Chad enjoys watching his daughter's archery tournaments as well as hunting, fishing and vacationing with his family.

**Credentials:** Delaware Valley College, ICPI Certified (hardscape installation).
**Knows about:** Turf care management, maintenance operations, hardscape installation.
**Tenure:** Since 1994 (canonical per voice profile v1.1 §1.6 + live site; Our Story brief 1.6's "1995" is wrong and being corrected sitewide).
**Residence:** Upper Providence, PA.

---

### 3. Nancy Pumilia | Controller

Nancy joined Blue Tree in 2014, bringing her extensive expertise in financial management to support the company's growth. She holds an accounting degree from Penn State University and has over 30 years of experience in accounting, with leadership roles across a variety of service and hospitality organizations. Her background includes overseeing financial operations, payroll, and cash management, as well as experience in business management functions such as HR, benefits administration, and IT accounting systems, including POS system implementation. Nancy enjoys spending quality time with her husband and three children and cherishes outdoor activities, including time at the beach.

**Credentials:** Penn State University (accounting).
**Knows about:** Financial management, payroll, cash management, HR, benefits administration, POS systems.
**Tenure:** Since 2014.

---

### 4. Mike Wadsworth | Pool Construction Manager

Mike is a highly skilled pool construction manager who joined the pool construction team in 2019, bringing with him over 20 years of experience in the landscaping industry. He is a certified builder professional with a concentration in concrete pools. Additionally, Mike possesses a strong knowledge of the hardscape industry. He holds a degree in History and Criminal Justice, with additional studies in Psychology from Shippensburg University. Outside of his professional responsibilities, Mike enjoys spectating his sons' activities. His oldest a collegiate swimmer, while his youngest is active in lacrosse and basketball.

**Credentials:** Shippensburg University (History, Criminal Justice, Psychology), Certified Builder Professional (concrete pools).
**Knows about:** Concrete pool construction, hardscape, pool installations.
**Tenure:** Since 2019.

---

### 5. Jérôme Besnard | Sales Manager

Jérôme joined our team in 2025 bringing over 25 years of leadership experience with him. His diverse background includes a decade in sales/ marketing management, five years in IT management, and ten years in production management. Jérôme developed a passion for homes and outdoor spaces, inspired by his father, a home builder and developer in France. This early influence led him to the US with a firm intention to pursue a career in this industry. Jérôme and his wife are actively involved in their teenage children's school and sports activities. He cherishes family vacations and looks forward to summer trips to France to visit extended family. Jérôme also enjoys tending to his yard.

**Credentials:** 25+ years leadership experience (sales/marketing, IT, production management).
**Knows about:** Sales management, sales process, designer-led discovery, buyer-decision content.
**Tenure:** Since 2025 (newest leadership hire).

---

### 6. Maureen Mattiola | Marketing Manager

Maureen joined the Blue Tree team in 2016. Eager to embrace the evolving landscape of digital marketing, she has quickly adapted to the dynamic world of online marketing, including content creation, social media strategy, and digital campaign management. A graduate of Bloomsburg University, Maureen is focused on driving brand awareness and engagement through strategic promotional materials and targeted social media outreach. Outside of her professional responsibilities, she enjoys listening to country music, cycling, and spending quality time on family vacations.

**Credentials:** Bloomsburg University.
**Knows about:** Digital marketing, content creation, social media strategy, digital campaign management.
**Tenure:** Since 2016.

---

### 7. Justin Acal | Pool and Landscape Designer / Sales

Justin has been a valued member of our team since 2019. With over ten years of extensive experience in the pool industry, he is a true subject matter expert in designing exceptional outdoor spaces, specializing in inground concrete pools. Justin takes great pride in guiding clients through every step of the process, from initial design to the final walk-through, ensuring each project exceeds customer expectations. Known for his keen eye for design and meticulous attention to detail, Justin consistently delivers outstanding results. He holds a degree in Landscape Architecture from Rutgers University. Outside of work, Justin enjoys spending quality time with his wife, two children, and their dog, Toby.

**Credentials:** Rutgers University (Landscape Architecture).
**Knows about:** Inground concrete pool design, landscape architecture, client process.
**Tenure:** Since 2019.

---

### 8. Mark Peasley | Turfcare Manager

Mark Peasley is a seasoned Turfcare Manager at Blue Tree Landscaping, bringing nearly two decades of experience in lawn care, mosquito control, and athletic field services. A graduate of Penn State University, Mark is well-equipped to manage and maintain high-quality outdoor spaces. Mark resides in Royersford with his wife and family. He is committed to delivering exceptional service and maintaining the highest standards for your home.

**Credentials:** Penn State University.
**Knows about:** Lawn care, turf care, mosquito control, athletic field services, Healthy Yards programs.
**Tenure:** Nearly 20 years.
**Residence:** Royersford, PA.

---

### 9. Robin Grayson | Accountant / Human Resources Assistant

Robin started at Blue Tree in 2019 and has really caught on to the fast-past working environment here at Blue Tree. She brings with her twenty plus years experience as a support person in HR, training and accounting as well as a degree in business management. When not crunching financial numbers, Robin enjoys spending time with her family, cooking, and being outdoors. She also earned her 1st degree Black Belt in American Kenpo.

**Credentials:** Business management degree, 1st degree Black Belt American Kenpo.
**Knows about:** HR, training, accounting.
**Tenure:** Since 2019.

---

### 10. John Labb | Production Manager

John is an experienced landscape management professional. He studied at Penn State and Rutgers Professional Golf Turf Management School. He is a member of the Golf Course Superintendent's Association of America. As Production Manager here, John oversees landscape crews, creates schedules, and manages daily operations. He works on commercial contracts and customer service, ensuring client satisfaction and addressing concerns. John also creates proposals for spring cleanups and landscape enhancements. Previously, John worked as Commercial Site Manager as well as a Golf Course Superintendent. He managed large budgets, led teams, and improved course infrastructure. John values faith, family, and work, demonstrating dedication and strong leadership in every aspect of his career.

**Credentials:** Penn State + Rutgers Professional Golf Turf Management School, Golf Course Superintendent's Association of America (member).
**Knows about:** Landscape management, commercial contracts, customer service, crew scheduling, golf course turf.

---

### 11. John Kostesich | Pool Construction Manager

John is an experienced Pool Construction Manager with over 24 years of expertise in the pool building industry. He joined Blue Tree in 2018 and has since been responsible for overseeing numerous successful pool projects. John holds a degree in Business Management and is a certified professional with the Association of Pool and Spa Professionals (APSP). Additionally, he has earned the prestigious Certified Building Professional (CBP) certification. Outside of his professional responsibilities, John values spending quality time with his six grandchildren.

**Credentials:** Business Management degree, APSP certified, Certified Building Professional (CBP).
**Knows about:** Pool construction, pool building industry, custom pool projects.
**Tenure:** Since 2018 (24+ years industry experience).

---

### 12. James Gonczkowski | Production Manager

Jim has been a valuable member of the Blue Tree team since 2017, though his passion for landscaping began at the age of fifteen. He is ICPI Certified and possesses specialized expertise in plant and tree identification. Throughout his career, James has gained extensive experience in pond construction, natural stonework, and masonry. A former member of the United States Marine Corps, he brings strong discipline and leadership to every project. Outside of work, James enjoys camping, playing pool, and spending quality time with his family.

**Credentials:** ICPI Certified, US Marine Corps (former).
**Knows about:** Plant and tree identification, pond construction, natural stonework, masonry.
**Tenure:** Since 2017.

---

### 13. Aggie Kriebel | Administrative Assistant / Accounts Payable Specialist

Aggie has been an integral part of the Blue Tree team since 2008, contributing significantly to the company's growth and success. In her role, she manages all accounts payable processes, handles incoming calls, and provides essential administrative support to the organization. Outside of work, Aggie enjoys cooking, gardening, and watching movies, with her favorite moments spent cherishing time with her grandson.

**Knows about:** Accounts payable, administrative support, customer service.
**Tenure:** Since 2008 (longest-tenured named staff).

---

### 14. Mike Tuhacek | Production Manager

Mike joined our team in March 2021 and now has twenty four years' experience in the industry with a background in carpentry and general contracting. He is also an expert machine operator. Mike enjoys the outdoors camping, hiking, fishing, archery, vegetable gardens, and spending time with his wife.

**Credentials:** 24 years industry experience, carpentry and general contracting background, expert machine operator.
**Knows about:** Production management, carpentry, general contracting, machine operation.
**Tenure:** Since March 2021.

---

### 15. Andrew Mattiola | Landscape Designer / Sales

Andrew has been an integral part of the BTL family from a young age, gaining valuable experience in the industry throughout his childhood. He worked summers during college, eventually serving as a Hardscaping Foreman for three years. Andrew graduated from Penn College of Technology in 2021 with a degree in Landscape Design/Construction. In 2022, he was promoted to Landscape Designer/Sales, where he now excels in meeting clients, developing custom designs, and ensuring projects meet their vision. Outside of his professional work, Andrew enjoys golfing, watching sports, and traveling to tropical destinations to unwind and recharge.

**Credentials:** Penn College of Technology (Landscape Design/Construction, 2021).
**Knows about:** Landscape design, custom design, client process, hardscaping.
**Tenure:** Promoted 2022 (lifetime BTL exposure).
**Family:** Jeff Mattiola's son.

---

### 16. Jose Zavala | Production Manager

Jose began his career with us in 2011, initially managing a commercial mowing crew. With over 22 years of experience in the landscaping industry, he was promoted to Production Manager in 2022. Throughout his career, Jose has demonstrated a strong commitment to leadership and operational efficiency, ensuring the successful management of his teams and projects. In his personal time, Jose enjoys playing soccer and listening to music, activities that allow him to unwind and stay active outside of work.

**Credentials:** 22+ years industry experience.
**Knows about:** Production management, commercial mowing, team operations.
**Tenure:** Since 2011 (promoted PM 2022).

---

### 17. Stephen Roehm | Landscape Designer / Sales

Stephen began his career with Blue Tree in 2020, working during summers and college breaks, gaining hands-on experience in both softscape and hardscape installations. After earning a Bachelor of Science in Landscape Contracting from Penn State University in 2022, Stephen joined our Landscape Design/Sales team. In his current role, he meets with clients daily, develops custom designs, and prepares detailed estimates, ensuring that each project aligns with the client's vision and requirements. Outside of work, Stephen enjoys golfing, staying active through workouts, and spending quality time with friends.

**Credentials:** Penn State University, Bachelor of Science Landscape Contracting (2022).
**Knows about:** Softscape, hardscape installations, custom design, estimating.
**Tenure:** Since 2020.

---

### 18. Andrew Phelan | Pool Service Technician

Andrew brings with him six years of experience in the landscaping field and joined Blue Tree in 2020. In 2023, he was promoted to Pool Service Technician, where he is responsible for educating clients on proper pool care while delivering expert pool maintenance services. Andrew is known for his strong work ethic, consistently demonstrating dedication, reliability, and a commitment to excellence in all aspects of his role. He holds a Bachelor's degree in Business Administration from Temple University and a Pool & Spa Maintenance Certificate from the Pool & Hot Tub Professionals Association. Outside of work, Andrew is passionate about fitness, cooking, and spending quality time with his family.

**Credentials:** Temple University (Business Administration), Pool & Spa Maintenance Certificate (Pool & Hot Tub Professionals Association).
**Knows about:** Pool service, pool maintenance, client education on pool care.
**Tenure:** Since 2020 (promoted Pool Service Tech 2023).

---

### 19. Christopher DiVito | Pool and Landscape Designer / Sales

Christopher DiVito is a Pool/Landscape/Hardscape Sales and Design Specialist with a passion for creating exceptional outdoor spaces. A graduate of Temple University with a BSLA in Landscape Architecture and Horticulture, Christopher's love for design began in his family's garden and exploring the Wissahickon in Philadelphia. With years of experience leading top landscape design and construction firms along the East Coast, he has worked on properties of all sizes. Outside of work, Christopher enjoys golf, fishing, hiking, and supporting his sons' sports.

**Credentials:** Temple University (BSLA — Landscape Architecture and Horticulture).
**Knows about:** Pool/landscape/hardscape sales and design, custom outdoor spaces.

---

### 20. Justin Ryen | Production Manager

Justin joined the company in March 2025 and brings over 20 years of comprehensive experience in the landscaping industry. With expertise across all aspects of landscaping, Justin has a deep understanding of plant health and care, landscape design, installation, maintenance, hardscaping, and lighting. He holds certifications in pesticide and herbicide application as well as ICPI certification for paver installation. Justin also has extensive training in team member health and safety, alongside several management courses. In his personal time, Justin enjoys outdoor activities such as fishing, hiking, and kayaking, and values spending quality time with his fiancée and their dogs.

**Credentials:** Pesticide and herbicide application certified, ICPI certified (paver installation), health and safety training.
**Knows about:** Plant health, landscape design/installation/maintenance, hardscaping, lighting, paver installation.
**Tenure:** Since March 2025.

---

### 21. John Mattiola | Landscape Design / Sales

John has been part of the Blue Tree Landscaping team since 2016, and the landscaping industry has been part of his life from an early age. With hands-on experience in landscaping, hardscaping, masonry, and heavy machinery, he knows how to turn great ideas into functional, beautiful outdoor spaces. A Penn State graduate with a Bachelor of Science in Landscape Contracting, John combines formal education with real-world experience to guide homeowners through every step of their projects. He enjoys collaborating with clients, listening to their ideas, and bringing their outdoor visions to life. Outside of work, John enjoys golfing, cooking, hiking, camping, and catching live music whenever he can.

**Credentials:** Penn State University, Bachelor of Science Landscape Contracting.
**Knows about:** Landscape design, hardscaping, masonry, heavy machinery, client collaboration.
**Tenure:** Since 2016.
**Family:** Jeff Mattiola's son (per Our Story brief 1.6).

---

## Reconciliation notes (for Maureen + Jason)

1. **Chad joined 1994 — RESOLVED 2026-05-13** Voice profile v1.1 §1.6 confirms 1994 (live-site confirmed; old reference documents that say 1995 are explicitly flagged as incorrect). Our Story brief 1.6's "1995" needs to be corrected. Downstream cascade now flagged in fix-list P6 #8 (deployed About bio "partners since 1995"), figma-audit.md A12 + S8, and logo-strip recommendations Co-Owned seal (now "Since 1994").
2. **Jeff Mattiola headshot** — Our Story brief and engagement-status both flag headshot as "pending; Maureen believes it exists." Live site DOES have a headshot. Confirm whether to pull from live site or use a fresh shot.
3. **Cliff bio** — referenced in Our Story brief 1.6 as a pool construction manager ("Add Cliff"). NOT present on the current live site. Confirm with Maureen whether to include.
4. **Fred Barberra full team-page bio verification** — referenced in engagement-status as pending. NOT present on the live site Meet the Team page either. Confirm scope.
5. **Andrew Mattiola family relationship** — live bio says "integral part of the BTL family from a young age" but does not name Jeff as father. Our Story brief 1.6 confirms. Consider adding the family connection explicitly per E-E-A-T transparency.
6. **John Mattiola family relationship** — same as #5. Per Our Story brief, John is also Jeff's son. Bio mentions "Blue Tree Landscaping team since 2016" but no family relationship.
7. **John Kostesich joined 2018 (live) vs Our Story brief 1.6 also confirms 2018** — consistent.
8. **No bios for: Cliff, Fred Barberra, Justin Ryen has March 2025 join date which is recent** — Justin Ryen's bio is on live site (added). Confirm with Maureen if anyone else recently joined or departed.
9. **Jérôme joined 2025** — that's THIS calendar year. Bio is correct, just newest leadership hire. Brief 1.6 listed Jérôme but didn't pin his start date.

## Voice profile cleanup checklist (copy-production team — separate from build fix)

Before final launch (2026-05-22 internal QA), copy-production should sweep the bios for:
- [ ] "Blue Tree Landscaping" body usage on Jeff's (2x), Mark's (1x), and John Mattiola's (1x) bios → replace with "Blue Tree" or "Blue Tree Outdoor Living" except where legal entity is contextually required
- [ ] Em-dash sweep (none obvious in this raw data but visual review on rendered page recommended)
- [ ] "Family-owned" check — Our Story brief 1.6 #7 explicitly removed this; live bios appear clean
- [ ] Standardize tenure phrasing (live site mixes "since 2019", "Joined Blue Tree in 2019", "Started at Blue Tree in 2019", etc.) — copy team to choose one form
- [ ] Standardize school references (live site mixes "Penn State", "Penn State University", "Penn State and Rutgers Professional Golf Turf Management School")
