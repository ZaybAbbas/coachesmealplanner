'use client';

import React, { useState } from 'react';
import { 
  User, Calendar, Target, 
  FileText, Download, ArrowLeft, Loader2, CheckCircle2,
  Utensils, Activity, AlertCircle, Globe, HeartPulse, 
  Clock, Lightbulb, Wand2
} from 'lucide-react';


const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/accountability-566c2.firebasestorage.app/o/088529ce-52f4-4ef7-a65f-0923d5901386.png?alt=media";

export default function App() {
  const [view, setView] = useState('dashboard');
  const [formData, setFormData] = useState({
    clientName: '',
    age: '',
    height: '',
    weight: '',
    goal: 'Fat loss',
    timeframe: 'Lose 5kg over 12 weeks',
    activityLevel: 'Lightly active',
    hormonalStatus: 'Regular cycle',
    medicalFlags: 'None',
    durationWeeks: 1,
    approach: 'Calories & Macros',
    dietaryPreferences: 'Standard',
    regionalCuisine: 'Indian',
    cookingFor: 'Herself only',
    cookingTime: '30 mins',
    batchCooking: 'Yes',
    religiousFasting: 'None',
    availableFoods: ''
  });
  
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [error, setError] = useState('');
  const [showTargets, setShowTargets] = useState(true);
  const [showDailyTotals, setShowDailyTotals] = useState(true);
  const [streamedChars, setStreamedChars] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const populateTestData = () => {
    const names = ["Amina Patel", "Zara Ahmed", "Priya Sharma", "Fatima Khan", "Neha Singh", "Sana Ali", "Kiran Desai"];
    const goals = ["Fat loss", "Sustainable fat loss", "Body recomposition", "Maintenance", "Drop a dress size"];
    const timeframes = ["Lose 5kg in 12 weeks", "Drop a dress size in 8 weeks", "Lose 8kg in 16 weeks", "Build healthy habits over 4 weeks", "Lose 3kg in 6 weeks"];
    const activityLevels = ["Sedentary", "Lightly active", "Moderately active", "Very active"];
    const hormonalStatuses = ["Regular cycle", "PCOS", "Perimenopause", "Menopause", "Post-menopause"];
    const medicalFlagsList = ["None", "None", "None", "Insulin resistance", "Type 2 diabetes risk", "Slightly elevated cholesterol"];
    const durations = ["1", "2", "4", "6", "8", "12"];
    const approaches = ["Calories & Macros", "Hand Portions", "Simple Targets"];
    const diets = ["Standard", "Vegetarian", "No Beef", "Dairy-free", "Standard"];
    const cuisines = ["Pakistani", "Indian", "Bangladeshi", "Sri Lankan", "Mixed South Asian", "Mix of South Asian and Western", "Western/Standard"];
    const cookingForOptions = ["Herself only", "Couple", "Family (with kids)"];
    const cookingTimes = ["15 mins max", "30 mins", "45 mins", "60 mins+"];
    const batchOptions = ["Yes - Prioritise Batch Cooking", "No - Prefers Fresh Daily"];
    const fastingOptions = ["None", "None", "None", "Intermittent Fasting"];

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    setFormData({
      clientName: random(names),
      age: randomInt(25, 55).toString(),
      height: randomInt(150, 172).toString(),
      weight: randomInt(60, 95).toString(),
      goal: random(goals),
      timeframe: random(timeframes),
      activityLevel: random(activityLevels),
      hormonalStatus: random(hormonalStatuses),
      medicalFlags: random(medicalFlagsList),
      durationWeeks: random(durations),
      approach: random(approaches),
      dietaryPreferences: random(diets),
      regionalCuisine: random(cuisines),
      cookingFor: random(cookingForOptions),
      cookingTime: random(cookingTimes),
      batchCooking: random(batchOptions),
      religiousFasting: random(fastingOptions),
      availableFoods: '' 
    });
  };

  const isFormValid = () => {
    if (!formData.clientName?.trim()) return false;
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseFloat(formData.age);
    if (isNaN(w) || w <= 0) return false;
    if (isNaN(h) || h <= 0) return false;
    if (isNaN(a) || a <= 0) return false;
    return true;
  };

  const generateAIPlan = async () => {
    setView('generating');
    setError('');
    
    const aiWeeks = 1; 
    
    const prompt = `
      You are an expert nutrition coach specialising in evidence-based meal planning for busy South Asian women. 
      Your job is to generate a fully personalised nutrition protocol based on the client details provided below.

      CLIENT DETAILS:
      - Name: ${formData.clientName}
      - Age: ${formData.age}
      - Height: ${formData.height} cm
      - Weight: ${formData.weight} kg
      - Primary Goal: ${formData.goal}
      - Goal timeframe: ${formData.timeframe}
      - Activity level: ${formData.activityLevel}
      - Hormonal status: ${formData.hormonalStatus}
      - Medical flags: ${formData.medicalFlags}
      - Full Protocol Duration: ${formData.durationWeeks} weeks
      - Menu Length to Generate: ${aiWeeks} week (Client will repeat this cycle if full duration is longer)
      - Dietary approach: ${formData.approach}
      - Dietary preferences/restrictions: ${formData.dietaryPreferences}
      - Regional cuisine: ${formData.regionalCuisine}
      - Cooking for: ${formData.cookingFor}
      - Available cooking time per day: ${formData.cookingTime}
      - Batch cooking: ${formData.batchCooking}
      - Religious fasting: ${formData.religiousFasting}
      - Available foods: ${formData.availableFoods || 'Standard access'}

      YOUR RULES:
      1. Calculate Estimated TDEE, Daily Calorie Target (300-500 deficit for fat loss, maintenance for muscle), Daily Protein Target (1.8-2.2g/kg), and Fibre (min 25g, aim 30g).
      2. Use South Asian meals as the foundation (Rice, roti, dal, lentils, sabzi, curry, yoghurt, eggs, legumes). No Western defaults unless requested.
      3. Every meal MUST include a clear protein source. Dal/lentils alone do not count as sufficient protein without another source.
      4. Fibre must come from whole foods.
      5. Adapt for family tables if 'Cooking for' is family.
      6. Flag batch cooking opportunities if enabled.
      7. Keep within the cooking time limit.
      8. HORMONES/MEDICAL: If perimenopausal/menopausal, increase calcium and prioritise protein. If PCOS/Insulin Resistance, reduce refined carbs, use low-GI, pair carbs with protein/fat.
      9. Z.A TRAINING TONE: Keep language highly practical, direct, and jargon-free. Written to the client. Incorporate my signature coaching tone (e.g., "Chill on the oil!", "Comfort food, don't overdo it", "Use common sense", "Air-fry to save time", "Always WhatsApp me if you are ever unsure").
      10. Z.A TRAINING MASTER FINGERPRINT: Merge your AI knowledge strictly with my coaching methodology:
          - THE CEREAL HACK: For breakfasts, suggest mixing whey protein, milk, and water in a shaker, then pouring over Bran Flakes or Weetabix.
          - THE EGG VOLUME HACK: Heavily utilize 1 whole egg + 150ml egg whites to bump protein without calories.
          - GO-TO CARBS: Warburtons Protein Bagels/Thins, Jason's Protein Sourdough, Ainsley Harriott couscous (Sundried Tomato & Garlic), microwave rice, baby potatoes (air-fried or baked), 1 medium chapati (max 30-60g).
          - GO-TO PROTEINS: Arla/Brooklea/GetPRO protein yoghurts/pouches, Skyr, fat-free Greek yoghurt, lean chicken keema (mince), chicken thighs/breast, frozen white fish/basa, smoked salmon, John West Infusions Tuna pots.
          - SOUTH ASIAN MEAL RULES: Measure curries and biryani exactly by "1.5 fistfuls". Tell clients to cook by starting with cooking spray/water, then adding a tiny bit of oil later to save calories. No fried onions in biryani. Add a side of Greek Yoghurt to low-protein curries (like Urad Daal, the highest protein daal) to bump up the protein. Use chicken mince over lamb/beef where possible.
          - SIGNATURE MEALS: Protein smoothies (whey, ice, frozen berries, 1 tsp PB, semi-skim milk), cheesecake/overnight oats, eggs & smoked salmon on a protein bagel, tuna baked potato with light mayo & mozzarella, chicken/kebab wraps.
          - SIGNATURE SNACKS: Babybel Light with apples, boiled eggs, Quest/Fulfil bars, rice cakes with PB, edamame, whole almonds.
      11. STRICTLY FORBIDDEN FOODS: NEVER include Pork, Bacon, Alcohol, Turkey, Rotisserie Chicken, Tempeh, Tofu, Medallions (or any fancy/expensive cuts of meat), Prawn Masala, Curd Bengan, Grilled Salmon, or Roasted Gobi under any circumstances.
      12. DIETARY APPROACH DISPLAY RULE: Always calculate macros internally for accuracy. Then display them based on the chosen approach:
          - If approach is "Calories & Macros": show full metrics as "450 kcal | 35g Protein | 45g Carbs | 12g Fat | 8g Fibre"
          - If approach is "Hand Portions": show ONLY "1 palm protein | 1 cupped hand carbs | 1 fist veg | 1 thumb fat" then on a new line "Approx. 35g Protein | 8g Fibre"
          - If approach is "Simple Targets": show in plain English e.g. "Around 450 calories — aim for 35g protein and 8g fibre"
          Always calculate and include protein and fibre regardless of approach.
      13. CRITICAL LENGTH REQUIREMENT: You MUST generate exactly ${aiWeeks} complete week. Do NOT generate more than ${aiWeeks} week.
      14. CRITICAL DAYS REQUIREMENT: Every single week MUST contain exactly 7 complete days (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday). DO NOT stop early. DO NOT provide partial weeks or partial days.
      15. MEAL DESCRIPTIONS: Write 2-3 sentences for each meal description. Explain what the meal is, what's in it, and one practical tip on how to prepare it simply. Written directly to the client in Z.A Training tone.
      15b. PORTION GUIDE RULE: Every meal MUST include a "portionGuide" field. This tells the client exactly how much to eat. Format it based on the dietary approach:
          - "Calories & Macros": Use exact weights e.g. "150g chicken keema | 1 chapati (60g) | 80g baby potatoes"
          - "Hand Portions": Use practical measures e.g. "4 tablespoons keema | 1 chapati | 1 palm-sized piece of basa | 1 small Skyr pot (150g)" — always include the pack/pot size for branded products
          - "Simple Targets": Use plain English e.g. "A good-sized bowl of keema — roughly 4-5 tablespoons | 1 chapati on the side"
          For packaged products always specify the exact size e.g. "1 x 150g Skyr pot", "1 x John West Infusions Tuna pot (110g)", "2 Warburtons Protein Bagel Thins".
      16. STRICT INGREDIENT MATCHING: The client has listed their available foods as: "${formData.availableFoods || 'Standard access'}". If this is NOT "Standard access", you MUST build every single meal STRICTLY using ONLY the ingredients listed. Do not add anything outside that list to the main meal. No exceptions.
      17. CALORIE FLOOR: Never drop below 1200-1300 kcal/day regardless of how aggressive the goal is. Cap deficit at 500 kcal max. Do NOT include any warning or reality check note in the tips — just silently apply the safe deficit.
      18. BOOST TIP RULE: Every meal MUST include a "boostTip" field — a short, practical suggestion for how to easily increase the protein or nutritional value of that meal. Written directly to the client. Keep it to one sentence. Must be realistic and easy. STRICTLY HALAL ONLY — never suggest pork, bacon, alcohol, or anything haram. Examples: "Add a scoop of whey protein to your porridge to push protein past 30g.", "Serve with a fat-free Greek yoghurt on the side for an extra 10g protein.", "Swap regular milk for semi-skimmed to save 20 calories without losing any taste."
      19. QUICK WINS: Generate exactly 3 short, punchy, personalised non-negotiables for this specific client. Written directly to them. Based on their hormonal status, medical flags, goal, and lifestyle. Use the Z.A Training tone — direct, no fluff. Each one should be one sentence max. Examples for PCOS: "Never eat a carb alone — always pair it with protein or fat." For menopausal: "Calcium every single day — no excuses." For family cooking: "Measure your portions separately before serving the family."

      Return ONLY a valid JSON object matching this EXACT schema. Do NOT truncate the days or weeks arrays:
      {
        "title": "Custom Nutrition Protocol",
        "targets": {
          "tdee": "Calculated TDEE kcal",
          "calories": "Target kcal",
          "protein": "Target g",
          "fibre": "Target g"
        },
        "weeks": [
          {
            "weekNumber": 1,
            "days": [
              {
                "day": "Monday",
                "meals": [
                  {
                    "type": "Breakfast",
                    "name": "Meal Name",
                    "description": "Brief description",
                    "portionGuide": "Exact portion sizes based on dietary approach",
                    "metrics": "X kcal | Yg P | Zg C | Wg F",
                    "prepNote": "Required if >15 mins (e.g., 'Prep night before')",
                    "lazySwap": "Required for at least 1 meal/day (same nutrition, less effort)",
                    "boostTip": "One practical tip to easily boost protein or nutrition of this meal"
                  }
                ],
                "dailyTotals": "Calories: X | Protein: Yg | Fibre: Zg"
              }
            ]
          }
        ],
        "shoppingList": {
          "proteins": ["item 1", "item 2"],
          "vegetables": ["item 1"],
          "grainsAndCarbs": ["item 1"],
          "dairyOrAlternatives": ["item 1"],
          "storeCupboardStaples": ["item 1"]
        },
        "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
        "summary": "One-line summary of what to focus on most this week.",
        "quickWins": ["Non-negotiable 1", "Non-negotiable 2", "Non-negotiable 3"]
      }
    `;

   const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 32768
      }
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google API Error (${response.status}): ${errorData}`);
      }

      // Read the stream chunk by chunk
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamedChars(fullText.length);
      }

      // Parse the complete JSON once stream is finished
      let cleanText = fullText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(cleanText);
      setGeneratedPlan(parsedData);
      setStreamedChars(0);
      setView('preview');

    } catch (err: any) {
      console.error("Full Error:", err);
      setError(`🚨 ERROR: ${err.message}`);
      setStreamedChars(0);
      setView('dashboard');
    }
  };

  if (view === 'generating') {
    const progress = Math.min(Math.round((streamedChars / 12000) * 100), 99);
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-red-700 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          {streamedChars === 0 ? 'Analyzing Client Data...' : 'Writing Your Plan...'}
        </h2>
        <p className="text-zinc-600 max-w-md text-center mb-6">
          {streamedChars === 0
            ? `Calculating TDEE, adapting for ${formData.hormonalStatus}, and sourcing ${formData.regionalCuisine} recipes within a ${formData.cookingTime} window...`
            : `Building meals, portion guides and boost tips for ${formData.clientName}...`}
        </p>
        {streamedChars > 0 && (
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2">
              <span>Generating plan</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-2.5">
              <div
                className="bg-red-700 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'preview' && generatedPlan) {
    return (
      <div className="min-h-screen bg-zinc-200 py-8 print:py-0 print:bg-white flex flex-col items-center">
        {/* Controls */}
        <div className="max-w-[210mm] w-full flex justify-between items-center mb-6 print:hidden px-4 md:px-0">
          <button onClick={() => setView('dashboard')} className="flex items-center text-zinc-600 hover:text-black bg-white px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit Details
          </button>
          <button onClick={() => setShowTargets(!showTargets)} className="flex items-center text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            {showTargets ? 'Hide Targets' : 'Show Targets'}
          </button>
          <button onClick={() => setShowDailyTotals(!showDailyTotals)} className="flex items-center text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            {showDailyTotals ? 'Hide Daily Totals' : 'Show Daily Totals'}
          </button>
          <button onClick={() => window.print()} className="flex items-center bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-md font-bold transition-all">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>

        {/* --- START DOCUMENT --- */}
        <div className="document-container w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none text-zinc-900 relative">
          
          {/* Page 1: Clean Dashboard Cover */}
          <div className="page break-after-page min-h-[297mm] flex flex-col relative overflow-hidden bg-black text-white p-16">
            <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-700 via-transparent to-transparent pointer-events-none"></div>
            
            <header className="relative z-10 flex flex-col items-start mt-8">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-red-900/20 mb-10">
                <img src={LOGO_URL} alt="Z.A Training Logo" className="w-24 h-24 object-contain" />
              </div>
              <h3 className="text-red-500 font-bold tracking-[0.2em] uppercase mb-3 text-sm">Z.A Training & Education</h3>
              <h1 className="text-5xl font-extrabold leading-tight mb-4 text-white">{generatedPlan?.title || "Custom Nutrition Protocol"}</h1>
              <p className="text-2xl text-zinc-400 font-light">Prepared for <span className="text-white font-semibold">{formData.clientName}</span></p>
            </header>

            {showTargets && (
            <div className="relative z-10 mt-16 bg-zinc-900/60 p-8 rounded-3xl border border-red-900/50 backdrop-blur-sm shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-red-500" />
                Your Nutritional Targets
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Calories</p>
                  <p className="text-4xl font-black text-white">{generatedPlan?.targets?.calories || "TBC"}</p>
                  <p className="text-red-500 text-xs mt-2 font-medium">Est. TDEE: {generatedPlan?.targets?.tdee || "TBC"}</p>
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Protein</p>
                  <p className="text-4xl font-black text-white">{generatedPlan?.targets?.protein || "TBC"}</p>
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Fibre</p>
                  <p className="text-4xl font-black text-white">{generatedPlan?.targets?.fibre || "TBC"}</p>
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Protocol Length</p>
                  <p className="text-4xl font-black text-white">{formData.durationWeeks} Weeks</p>
                </div>
              </div>
            </div>
            )}
            
            {/* Cycle Banner */}
            {parseInt(formData.durationWeeks, 10) > 1 && (
              <div className="relative z-10 mt-8 bg-red-950/40 p-6 rounded-2xl border border-red-900/60 flex items-center shadow-lg">
                <Calendar className="w-7 h-7 text-red-500 mr-4 shrink-0" />
                <p className="text-red-100 text-sm leading-relaxed">
                  <strong className="text-white">Menu Rotation:</strong> You have been provided a 7-day master menu. Cycle this exact menu weekly to complete your {formData.durationWeeks}-week protocol.
                </p>
              </div>
            )}

            {/* Quick Wins */}
            {Array.isArray(generatedPlan?.quickWins) && generatedPlan.quickWins.length > 0 && (
              <div className="relative z-10 mt-8 bg-red-700 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-white font-black text-lg uppercase tracking-widest mb-5 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                  Your 3 Non-Negotiables This Week
                </h3>
                <ul className="space-y-3">
                  {generatedPlan.quickWins.map((win, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-white font-black text-lg mr-3 shrink-0">{idx + 1}.</span>
                      <p className="text-red-100 font-medium leading-snug">{win}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Week at a Glance Page */}
          {Array.isArray(generatedPlan?.weeks?.[0]?.days) && (
            <div className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-white flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
              </div>
              <header className="relative z-10 mb-10 border-b-2 border-zinc-100 pb-5 flex justify-between items-end">
                <div>
                  <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1">Your Plan</h4>
                  <h2 className="text-4xl font-black text-black">Week at a Glance</h2>
                  <p className="text-zinc-500 mt-1 font-medium">Stick this on your fridge.</p>
                </div>
                <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80" />
              </header>
              <div className="relative z-10 grid grid-cols-7 gap-3 flex-1">
                {generatedPlan.weeks[0].days.map((day, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="bg-black text-white text-center py-2 rounded-xl mb-3">
                      <p className="text-xs font-black uppercase tracking-widest">{day.day?.substring(0, 3)}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      {(day.meals || []).map((meal, mIdx) => (
                        <div key={mIdx} className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                          <p className="text-[9px] font-black text-red-700 uppercase tracking-wide mb-1">{meal.type}</p>
                          <p className="text-[10px] font-semibold text-zinc-800 leading-snug">{meal.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Plans */}
          {(Array.isArray(generatedPlan?.weeks) ? generatedPlan.weeks : []).map((week, weekIdx) => (
            <div key={weekIdx}>
              {(Array.isArray(week?.days) ? week.days : []).map((day, dayIdx) => (
                <div key={dayIdx} className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-white flex flex-col relative overflow-hidden">
                  
                  {/* Subtle Page Watermark */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
                  </div>

                  <header className="relative z-10 mb-8 border-b-2 border-zinc-100 pb-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm">Week {week?.weekNumber || 1}</h4>
                      <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80" />
                    </div>
                    <div className="flex justify-between items-end">
                      <h2 className="text-4xl font-black text-black">{day?.day || "Day"}</h2>
                      {showDailyTotals && (
                        <div className="text-right bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Daily Totals</span>
                          <span className="font-bold text-black text-sm">{day?.dailyTotals || "TBC"}</span>
                        </div>
                      )}
                    </div>
                  </header>

                  <div className="flex-1 space-y-6 relative z-10">
                    {(Array.isArray(day?.meals) ? day.meals : []).map((meal, mealIdx) => (
                      <div key={mealIdx} className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-700 rounded-l-2xl"></div>
                        
                        <div className="flex justify-between items-start mb-3 pl-2">
                          <span className="inline-block px-3 py-1 bg-red-50 text-red-800 text-xs font-bold tracking-wide uppercase rounded-md">
                            {meal?.type || "Meal"}
                          </span>
                          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200">
                            {meal?.metrics || "TBC"}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-black mb-2 pl-2">{meal?.name || "Recipe"}</h4>
                        <p className="text-zinc-600 text-sm mb-3 leading-relaxed pl-2">{meal?.description || ""}</p>
                        {meal?.portionGuide && (
                          <div className="ml-2 mb-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-1">Your Portion</p>
                            <p className="text-sm font-semibold text-zinc-800 leading-relaxed">{meal.portionGuide}</p>
                          </div>
                        )}
                        
                        {(meal?.prepNote || meal?.lazySwap) && (
                          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100 pl-2">
                            {meal?.prepNote && (
                              <div className="flex items-start text-zinc-700 bg-zinc-50 px-4 py-3 rounded-xl text-sm border border-zinc-200/50">
                                <Clock className="w-4 h-4 mr-2.5 mt-0.5 shrink-0 text-red-600" />
                                <span className="font-medium"><strong className="text-black">Prep Note:</strong> {meal.prepNote}</span>
                              </div>
                            )}
                            {meal?.lazySwap && (
                              <div className="flex items-start text-zinc-700 bg-zinc-50 px-4 py-3 rounded-xl text-sm border border-zinc-200/50">
                                <Utensils className="w-4 h-4 mr-2.5 mt-0.5 shrink-0 text-red-600" />
                                <span className="font-medium"><strong className="text-black">Lazy Swap:</strong> {meal.lazySwap}</span>
                              </div>
                            )}
                            {meal?.boostTip && (
                              <div className="flex items-start text-zinc-700 bg-zinc-50 px-4 py-3 rounded-xl text-sm border border-zinc-200/50">
                                <Lightbulb className="w-4 h-4 mr-2.5 mt-0.5 shrink-0 text-red-600" />
                                <span className="font-medium"><strong className="text-black">Boost Tip:</strong> {meal.boostTip}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <p className="relative z-10 mt-6 text-zinc-400 text-xs italic text-center">
                    Nutritional values are estimates. Actual values may vary slightly depending on brands and cooking methods.
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Shopping List & Summary Page */}
          <div className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-zinc-50 relative overflow-hidden">
            {/* Subtle Page Watermark */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>

            <header className="relative z-10 mb-10 border-b-2 border-zinc-200 pb-6 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-black">Shopping List & Tips</h2>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Everything you need for your protocol.</p>
              </div>
              <img src={LOGO_URL} alt="ZA" className="w-12 h-12 object-contain opacity-80" />
            </header>

            <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
              {Object.entries(generatedPlan?.shoppingList || {}).map(([category, items]) => (
                <div key={category} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="font-bold text-black uppercase tracking-wider text-sm mb-4 border-b border-zinc-100 pb-3">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <ul className="space-y-2.5">
                    {(Array.isArray(items) ? items : []).map((item, idx) => (
                      <li key={idx} className="flex items-start text-zinc-700 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 mt-1.5 shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-black text-white p-10 rounded-3xl relative z-10 shadow-2xl">
              <h3 className="text-2xl font-bold flex items-center mb-8">
                <Lightbulb className="w-7 h-7 mr-3 text-red-600" /> 
                Coach's Tips for Success
              </h3>
              <ul className="space-y-5 mb-10">
                {(Array.isArray(generatedPlan?.tips) ? generatedPlan.tips : []).map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 mr-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-zinc-300 leading-relaxed text-lg">{tip}</p>
                  </li>
                ))}
              </ul>
              <div className="bg-zinc-900 p-8 rounded-2xl border border-red-900/50">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-3">The One Thing</p>
                <p className="text-2xl font-medium text-white leading-tight">{generatedPlan?.summary || "Focus on your daily targets and consistency."}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // DEFAULT VIEW: COACH DASHBOARD
  return (
    <div className="min-h-screen bg-zinc-100 font-sans text-zinc-900 pb-24 selection:bg-red-200 selection:text-red-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
              <img src={LOGO_URL} alt="Z.A Training" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-black tracking-tight">Z.A<span className="text-red-700">Training</span></span>
          </div>
          <div className="text-xs font-bold text-zinc-400 tracking-widest uppercase border border-zinc-200 px-3 py-1.5 rounded-full">Coach Portal</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-black mb-3">New Client Protocol</h1>
            <p className="text-zinc-500 font-medium">Complete the intake data to generate an evidence-based, culturally adapted plan.</p>
          </div>
          <button 
            onClick={populateTestData}
            className="flex items-center justify-center text-sm font-bold text-red-800 bg-red-100 hover:bg-red-200 px-5 py-3 rounded-xl transition-all border border-red-200 shrink-0 shadow-sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Auto-Fill Test Data
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 text-red-800 p-5 rounded-xl flex items-start border border-red-200 shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p className="font-medium break-words whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          
          {/* SECTION 1: Personal & Body Metrics */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <User className="w-5 h-5 mr-3 text-red-700" /> Client Data & Metrics
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="e.g. Zara Ahmed" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Age</label>
                <input type="number" name="age" min="1" step="1" value={formData.age} onChange={handleInputChange} placeholder="e.g. 34" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Height (cm)</label>
                <input type="number" name="height" min="1" step="any" value={formData.height} onChange={handleInputChange} placeholder="e.g. 162" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                <input type="number" name="weight" min="1" step="any" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 75" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Sedentary</option><option>Lightly active</option><option>Moderately active</option><option>Very active</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Goals & Health */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <HeartPulse className="w-5 h-5 mr-3 text-red-700" /> Goals & Medical Profile
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Primary Goal</label>
                <input type="text" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="e.g. Fat loss" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Goal Timeframe</label>
                <input type="text" name="timeframe" value={formData.timeframe} onChange={handleInputChange} placeholder="e.g. Lose 5kg over 12 weeks" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Hormonal Status</label>
                <select name="hormonalStatus" value={formData.hormonalStatus} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Regular cycle</option><option>PCOS</option><option>Perimenopause</option><option>Menopause</option><option>Post-menopause</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Medical Flags</label>
                <input type="text" name="medicalFlags" value={formData.medicalFlags} onChange={handleInputChange} placeholder="e.g. Insulin resistance, Type 2 diabetes risk, None" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 3: Dietary Approach */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <Target className="w-5 h-5 mr-3 text-red-700" /> Dietary Approach
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dietary Approach</label>
                <select name="approach" value={formData.approach} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Calories & Macros</option><option>Hand Portions</option><option>Simple Targets</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Plan Duration</label>
                <select name="durationWeeks" value={formData.durationWeeks} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option value="1">1 Week</option>
                  <option value="2">2 Weeks</option>
                  <option value="4">4 Weeks</option>
                  <option value="6">6 Weeks</option>
                  <option value="8">8 Weeks</option>
                  <option value="12">12 Weeks</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Religious Fasting</label>
                <select name="religiousFasting" value={formData.religiousFasting} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>None</option><option>Ramadan</option><option>Intermittent Fasting</option><option>Other</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dietary Preferences / Restrictions</label>
                <input type="text" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleInputChange} placeholder="e.g. Vegetarian, Lactose intolerant, No Beef" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 4: Culture & Lifestyle */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <Globe className="w-5 h-5 mr-3 text-red-700" /> Culture & Lifestyle Context
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Regional Cuisine Focus</label>
                <select name="regionalCuisine" value={formData.regionalCuisine} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Pakistani</option>
                  <option>Indian</option>
                  <option>Bangladeshi</option>
                  <option>Sri Lankan</option>
                  <option>Mixed South Asian</option>
                  <option>Mix of South Asian and Western</option>
                  <option>Western/Standard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cooking For</label>
                <select name="cookingFor" value={formData.cookingFor} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Herself only</option><option>Couple</option><option>Family (with kids)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Daily Cooking Time limit</label>
                <select name="cookingTime" value={formData.cookingTime} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>15 mins max</option><option>30 mins</option><option>45 mins</option><option>60 mins+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Batch Cooking Status</label>
                <select name="batchCooking" value={formData.batchCooking} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Yes - Prioritise Batch Cooking</option><option>No - Prefers Fresh Daily</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Available Ingredients (Optional)</label>
                <textarea name="availableFoods" value={formData.availableFoods} onChange={handleInputChange} placeholder="List specific foods they have or want to use up..." rows="2" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none resize-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-zinc-200 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <button 
            onClick={generateAIPlan}
            disabled={!isFormValid()}
            className="flex items-center bg-red-700 hover:bg-red-800 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 max-w-4xl w-full justify-center tracking-wide"
          >
            <FileText className="w-6 h-6 mr-3" />
            Generate Final Protocol
          </button>
        </div>
      </main>
    </div>
  );
}