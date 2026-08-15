Smart Medicine Safety & Drug Interaction Assistant
Theme: Healthcare & HealthTech
Smart Medicine Safety & Drug Interaction Assistant
"Because no patient should get hurt by the medicine that was supposed to help them."
Real-World Context
Every day, millions of people take more than one medicine at the same time — for fever, diabetes,
blood pressure, allergies, or other conditions. Most patients do not know that some medicines,
when taken together, can react badly with each other. This is called a drug interaction, and it
can cause serious side effects, reduce the effect of a medicine, or in extreme cases, even be life￾threatening.
In India and across the world, many people:
Take medicines prescribed by different doctors without telling one doctor about the other
prescription.
Buy over-the-counter medicines without checking if it's safe with what they already take.
Do not read or understand medicine labels properly.
Hospitals and pharmacies often do not have an easy-to-use digital tool to catch these risks in real
time, especially for common people who are not medically trained.
Your job in this hackathon is to build a solution that helps solve this real problem.
The Problem Statement
Build a Smart Medicine Safety & Drug Interaction Assistant — a web/app-based
platform where a user (patient, caregiver, or pharmacist) can enter the medicines they are taking
(or planning to take), and the system tells them:
Whether there is a dangerous or risky interaction between those medicines.
What the risk level is (mild, moderate, severe).
What symptoms or side effects to watch out for.
Simple, easy-to-understand advice on what to do next (for example: "consult your
doctor" or "avoid taking these together").
8/12/26, 11:07 AM Smart Medicine Safety & Drug Interaction Assistant — Problem Statement
about:blank 1/4
The system should feel like a trustworthy digital health companion — not just a search engine that
dumps raw medical text on the user.
Objective
By the end of the hackathon, your team must deliver a working, full-stack application that
can:
1. Let a user create an account and log in securely.
2. Let a user add/search medicines (by name) to a personal "current medications" list.
3. Automatically check for interactions between the medicines in that list using a real drug-data
source.
4. Clearly display the interaction risk, explanation, and recommendation in plain language.
5. Store user history so they can revisit their medicine list and past checks.
Key Requirements (Must-Haves)
Your solution must include all of the following — this is what will make the 4 days genuinely
challenging, so plan your team's time wisely from day one:
1. User Accounts & Authentication
Secure sign-up/login (e.g., email/password or OTP-based).
Each user's medicine list and history must be private to them.
2. Medicine Search & Input
A search feature to find medicines by name (generic or brand name).
Handle common misspellings or partial matches gracefully (e.g., "paracetmol" should still
suggest "Paracetamol").
3. Drug Interaction Detection Engine
This is the technical core of your project. You must connect to a real-world third-party
drug/medical data API to fetch accurate drug interaction information — do not hardcode
a small fixed list of medicines, as real systems must scale to thousands of drugs.
You are expected to research and choose an appropriate third-party API or
open medical database on your own (this is part of the challenge — evaluate what's
freely available, what data it returns, and how reliable it is). Look into public/open health-data
and drug-information APIs available for developers, and pick the one that best fits your
8/12/26, 11:07 AM Smart Medicine Safety & Drug Interaction Assistant — Problem Statement
about:blank 2/4
solution. Document clearly in your README which API you used, why you chose it,
and how you integrated it.
Your backend must call this API (or a combination of APIs), process the response, and
generate a clean risk assessment — not just show raw API output to the user.
4. Risk Classification System
Categorize each detected interaction (e.g., Mild / Moderate / Severe) based on the data
returned by your chosen source.
Design a clear logic/algorithm for how you decide the risk level if the source doesn't directly
give one.
5. User-Friendly Result Explanation
Convert technical/medical language into simple explanations a non-medical person can
understand.
Include a clear disclaimer that this is not a replacement for professional medical
advice.
6. Medicine History & Dashboard
Users should be able to view their past searches/checks.
A simple dashboard showing their current medicine list and any active warnings.
7. Database Integration
Store user data, medicine lists, and interaction check history persistently (not just in memory).
8. Responsive, Clean UI
Should work well on both desktop and mobile screens.
Prioritize clarity and trust — this is a health tool, so the design should feel calm, safe, and
professional (not cluttered).
9. Error Handling
Handle cases like: API downtime, medicine not found, invalid input, network failure — the app
should never just crash or show a blank screen.
Challenges
Prescription Upload & OCR: Let users upload a photo of a prescription or medicine
strip, and auto-extract the medicine name using OCR/image recognition.
Reminder System: Add medicine reminders/notifications for users.
8/12/26, 11:07 AM Smart Medicine Safety & Drug Interaction Assistant — Problem Statement
about:blank 3/4
Multi-language Support: Show results in regional languages for wider accessibility.
Doctor/Pharmacist Mode: A separate view for healthcare professionals with more
detailed clinical data.
AI-based Symptom Checker: Suggest possible side effects based on a combination of
medicines, using an AI model.
Allergy Cross-Check: Let users mark known allergies and warn if a searched medicine
conflicts with them.
Deliverables
Each team must submit:
1. Fully functional deployed application (deployment strongly recommended) —
frontend + backend + database.
2. GitHub repository following the naming and structure guidelines from the General
Instructions (HackInMotion-TeamCode), including:
architecture-diagram.png
api-documentation.md
presentation.pptx
Complete README.md (as per Section 8 of General Instructions — including which
third-party API/data source was used and how)
3. Live demo with real medicine examples showing at least one detected interaction.
4. Product Pitch (for finalists) covering the problem, solution, tech stack, real-world impact,
and future scope.
Suggested Tech Stack (Flexible — choose what your team is confident with)
Frontend: React.js / Next.js
Backend: Node.js (Express) / Python (Django/Flask/FastAPI) / Java (Spring Boot) / .NET
(ASP.NET Core)
Database: MongoDB / PostgreSQL / MySQL / Firebase
Third-Party Data Source: Research and select a suitable open/public drug
information or medical data API — evaluating multiple options and picking one that
fits your solution is part of the challenge. Look for developer-friendly, well-documented
drug/medicine/health-data APIs.
Authentication: JWT / Firebase Auth / OAuth
Deployment: Vercel / Netlify / Render / Railway / AWS / Azure
8/12/26, 11:07 AM Smart Medicine Safety & Drug Interaction Assistant — Problem Statement
about:blank 4/4
