import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TripRequest } from '../types';
import { VisualQuiz } from '../components/VisualQuiz';

const POPULAR_DESTINATIONS = [
  { name: "Kyoto, Japan", icon: "⛩️" },
  { name: "Reykjavik, Iceland", icon: "❄️" },
  { name: "Cape Town, SA", icon: "🇿🇦" },
  { name: "Paris, France", icon: "🗼" },
  { name: "Bali, Indonesia", icon: "🏝️" }
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENCIES = ["INR - ₹", "USD - $", "EUR - €", "GBP - £", "JPY - ¥"];
const LANGUAGES = ["English", "Bengali", "Hindi", "Spanish", "French", "German"];
const INTERESTS = ["Nature", "History", "Food", "Adventure", "Relaxation", "Nightlife", "Shopping", "Culture"];

export const TravelForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { generateTrip, isGenerating, tripError } = useAppContext();

  const [isSurpriseMe, setIsSurpriseMe] = useState(false);
  const [isAdvancedBudget, setIsAdvancedBudget] = useState(false);

  const [formData, setFormData] = useState<TripRequest>({
    origin: '',
    destination: '',
    tripType: 'Single City',
    stops: [],
    duration: 5,
    travelMonth: 'June',
    currency: 'USD - $',
    language: 'English',
    dietary: 'No Restrictions',
    budget: 'Moderate',
    budgetBreakdown: { flights: 0, hotels: 0, daily: 0 },
    activityLevel: 'Moderate',
    groupType: 'Couple',
    interests: [],
    vibe: ''
  });

  // Pre-fill from shared/copied trip
  useEffect(() => {
    const state = location.state as { copyTrip?: any };
    if (state?.copyTrip) {
      const trip = state.copyTrip;
      // Map TripPlan to TripRequest (best effort)
      // Note: TripPlan doesn't store all the original request parameters perfectly, 
      // so we infer some or default them.

      setFormData(prev => ({
        ...prev,
        destination: (trip.itinerary[0]?.city as string) || '',
        duration: trip.itinerary.length || 5,
        budget: 'Moderate', // Default as we don't store the exact setting
        // Potentially infer more fields if available in metadata
      }));

      // If Multi-City
      if (trip.itinerary.length > 1 && trip.itinerary[0].city !== trip.itinerary[1].city) {
        const cities = [...new Set(trip.itinerary.map((day: any) => day.city))];
        if (cities.length > 1) {
          setFormData(prev => ({
            ...prev,
            tripType: 'Multi-City',
            destination: cities[0] as string,
            stops: cities.slice(1) as string[]
          }));
        }
      }
    }
  }, [location.state]);

  const [isFormValid, setIsFormValid] = useState(false);

  // --- LIVE COST ESTIMATION LOGIC ---
  const estimatedCost = useMemo(() => {
    // Advanced Logic
    if (isAdvancedBudget && formData.budgetBreakdown) {
      const { flights, hotels, daily } = formData.budgetBreakdown;
      const days = formData.duration || 1;
      const total = flights + (hotels * days) + (daily * days);
      const selectedCurr = formData.currency.split(' - ')[1] || '$';
      return `${selectedCurr}${total.toLocaleString()}`;
    }

    // Base daily costs in USD (Approximate)
    const baseRates: Record<string, number> = {
      'Backpacker': 50,
      'Budget': 100,
      'Moderate': 250,
      'Luxury': 500,
      'Ultra Luxury': 1000
    };

    // Group multipliers (Approximate economies of scale vs raw headcount)
    const groupMultipliers: Record<string, number> = {
      'Solo': 1,
      'Couple': 1.8, // Sharing rooms
      'Family with Kids': 3.5,
      'Family with Teens': 3.8,
      'Friends': 4,
      'Business': 1.5,
      'Large Group': 8
    };

    const currencyRates: Record<string, number> = {
      'USD - $': 1,
      'INR - ₹': 83,
      'EUR - €': 0.92,
      'GBP - £': 0.79,
      'JPY - ¥': 150
    };

    const days = formData.duration || 1;
    const rate = baseRates[formData.budget] || 250;
    const multiplier = groupMultipliers[formData.groupType] || 2;
    const totalUSD = rate * days * multiplier;

    // Convert
    const selectedCurr = formData.currency;
    const conversion = currencyRates[selectedCurr] || 1;
    const finalValue = Math.round(totalUSD * conversion);

    // Format
    const currencySymbol = selectedCurr.split(' - ')[1] || '$';
    return `${currencySymbol}${finalValue.toLocaleString()}`;
  }, [formData, isAdvancedBudget]);
  // ----------------------------------

  useEffect(() => {
    let isValid = false;
    if (isSurpriseMe) {
      isValid = !!formData.vibe && formData.duration > 0;
    } else if (formData.tripType === 'Multi-City') {
      isValid = (formData.stops?.length || 0) > 1 && formData.stops!.every(s => s.trim() !== '') && formData.duration > 0;
    } else {
      isValid = formData.destination.trim() !== '' && formData.duration > 0 && formData.interests.length > 0;
    }
    setIsFormValid(isValid);
  }, [formData, isSurpriseMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const requestData = { ...formData };
    if (isSurpriseMe) {
      requestData.destination = "Surprise Me";
    }

    await generateTrip(requestData);
    navigate('/result');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 1 : value
    }));
  };

  const handleBudgetBreakdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      budgetBreakdown: {
        ...prev.budgetBreakdown!,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleSelection = (field: keyof TripRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const current = prev.interests;
      return current.includes(interest) ? { ...prev, interests: current.filter(i => i !== interest) } : { ...prev, interests: [...current, interest] };
    });
  };

  // --- SUB-COMPONENTS ---
  const RadioCard = ({ label, subLabel, value, groupValue, onClick, icon }: any) => {
    const isSelected = groupValue === value;
    return (
      <div
        onClick={onClick}
        className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-2 group ${isSelected
          ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/20 shadow-lg shadow-forest-500/10 ring-1 ring-forest-500'
          : 'border-sand-200 dark:border-charcoal-700 bg-white/50 dark:bg-charcoal-800/50 hover:border-forest-300 dark:hover:border-forest-600 hover:scale-[1.02]'
          }`}
      >
        <div className={`text-2xl mb-1 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
        <div>
          <div className={`font-bold text-sm ${isSelected ? 'text-forest-900 dark:text-white' : 'text-charcoal-700 dark:text-sand-200'}`}>{label}</div>
          <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">{subLabel}</div>
        </div>
      </div>
    );
  };

  const labelClasses = "flex items-center gap-2 text-xs font-bold text-charcoal-500 dark:text-sand-400 uppercase tracking-wider mb-2 ml-1";
  const selectClasses = "w-full bg-sand-50 dark:bg-charcoal-800 border-none rounded-xl px-4 py-3.5 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-forest-500 cursor-pointer appearance-none font-medium";
  const inputClasses = "w-full bg-sand-50 dark:bg-charcoal-800 border-none rounded-xl px-4 py-3.5 text-charcoal-900 dark:text-white focus:ring-2 focus:ring-forest-500 font-medium placeholder-charcoal-300 dark:placeholder-charcoal-600";

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-charcoal-950 flex justify-center py-24 px-4 relative overflow-hidden transition-colors duration-500">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-forest-900 dark:bg-black skew-y-3 origin-top-left -z-0"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-forest-500 rounded-full blur-[100px] opacity-30 animate-pulse-slow"></div>

      <div className="w-full max-w-5xl glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10 animate-fade-in-up">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-4 font-display">
            Design Your Journey
          </h1>
          <p className="text-charcoal-600 dark:text-sand-300 max-w-lg mx-auto text-lg">
            Let Gemini AI craft a bespoke itinerary tailored to your unique travel DNA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* Section 1: Trip Type & Destination */}
          <div className="bg-white/50 dark:bg-charcoal-800/50 rounded-3xl p-8 border border-white/40 dark:border-white/5 shadow-sm space-y-8">

            {/* Trip Type Toggle */}
            <div className="flex justify-center">
              <div className="bg-sand-100 dark:bg-charcoal-800 p-1 rounded-2xl inline-flex">
                {['Single City', 'Multi-City'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tripType: type as any, stops: [], destination: '' }))}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${formData.tripType === type
                      ? 'bg-white dark:bg-charcoal-700 text-forest-700 dark:text-white shadow-sm'
                      : 'text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-sand-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className={labelClasses}>
                <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {isSurpriseMe ? "Your Vibe" : "Where to?"}
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isSurpriseMe ? 'text-forest-600' : 'text-charcoal-400'}`}>Surprise Me! 🎉</span>
                <button
                  type="button"
                  onClick={() => setIsSurpriseMe(!isSurpriseMe)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isSurpriseMe ? 'bg-forest-500' : 'bg-charcoal-200 dark:bg-charcoal-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isSurpriseMe ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {isSurpriseMe ? (
              <VisualQuiz
                selectedVibe={formData.vibe}
                onSelect={(vibe) => setFormData(prev => ({ ...prev, vibe }))}
              />
            ) : (
              <>
                {formData.tripType === 'Single City' ? (
                  <div className="relative group">
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g. Kyoto, Japan"
                      className="w-full bg-transparent border-b-2 border-charcoal-200 dark:border-charcoal-600 text-3xl md:text-5xl font-display font-bold text-charcoal-900 dark:text-white placeholder-charcoal-300 dark:placeholder-charcoal-600 focus:outline-none focus:border-forest-500 py-4 transition-all"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-charcoal-600 dark:text-sand-300">Destinations / Stops</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, stops: [...(prev.stops || []), ''] }))}
                        className="text-xs font-bold text-forest-500 hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Stop
                      </button>
                    </div>
                    {(formData.stops || []).map((stop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-6 text-xs text-charcoal-400 font-mono">{index + 1}.</span>
                        <input
                          type="text"
                          value={stop}
                          onChange={(e) => {
                            const newStops = [...(formData.stops || [])];
                            newStops[index] = e.target.value;
                            setFormData(prev => ({ ...prev, stops: newStops }));
                          }}
                          placeholder="City Name"
                          className="flex-1 bg-transparent border-b border-charcoal-200 dark:border-charcoal-700 py-2 text-lg font-bold text-charcoal-900 dark:text-white focus:outline-none focus:border-forest-500"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, stops: prev.stops?.filter((_, i) => i !== index) }))}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(!formData.stops || formData.stops.length === 0) && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, stops: [''] }))}
                        className="w-full py-3 border-2 border-dashed border-charcoal-200 dark:border-charcoal-700 rounded-xl text-charcoal-400 font-bold hover:border-forest-500 hover:text-forest-500 transition-all"
                      >
                        + Add First Stop
                      </button>
                    )}
                  </div>
                )}

                {formData.tripType === 'Single City' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {POPULAR_DESTINATIONS.map(dest => (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, destination: dest.name }))}
                        className="px-4 py-1.5 rounded-full text-xs font-bold border border-charcoal-200 dark:border-charcoal-700 hover:border-forest-500 hover:text-forest-600 dark:text-sand-300 dark:hover:text-forest-400 transition-all bg-white dark:bg-charcoal-800 flex items-center gap-2"
                      >
                        <span>{dest.icon}</span>
                        {dest.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Section 2: Logistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-700 dark:text-forest-300 flex items-center justify-center text-sm">01</span>
                The Basics
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Starting From (Optional)
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. New York"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Duration (Days)
                  </label>
                  <input type="number" name="duration" min="1" max="60" value={formData.duration} onChange={handleChange} className={selectClasses} />
                </div>
                <div>
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Month
                  </label>
                  <select name="travelMonth" value={formData.travelMonth} onChange={handleChange} className={selectClasses}>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* BUDGET SECTION */}
                <div className="col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className={labelClasses}>
                      <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Budget
                    </label>
                    <button type="button" onClick={() => setIsAdvancedBudget(!isAdvancedBudget)} className="text-xs text-forest-500 font-bold hover:underline">
                      {isAdvancedBudget ? 'Simple Mode' : 'Advanced Calculator'}
                    </button>
                  </div>

                  {!isAdvancedBudget ? (
                    <select name="budget" value={formData.budget} onChange={handleChange} className={selectClasses}>
                      {['Backpacker', 'Budget', 'Moderate', 'Luxury', 'Ultra Luxury'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  ) : (
                    <div className="grid grid-cols-3 gap-4 bg-sand-50 dark:bg-charcoal-800 p-4 rounded-xl border border-sand-200 dark:border-charcoal-700 animate-slide-up">
                      <div>
                        <label className="text-[10px] font-bold text-charcoal-500 uppercase block mb-1">Max Flights</label>
                        <input type="number" name="flights" value={formData.budgetBreakdown?.flights} onChange={handleBudgetBreakdownChange} className="w-full bg-white dark:bg-charcoal-900 rounded-lg p-2 text-sm" placeholder="0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-charcoal-500 uppercase block mb-1">Hotel / Night</label>
                        <input type="number" name="hotels" value={formData.budgetBreakdown?.hotels} onChange={handleBudgetBreakdownChange} className="w-full bg-white dark:bg-charcoal-900 rounded-lg p-2 text-sm" placeholder="0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-charcoal-500 uppercase block mb-1">Daily Spend</label>
                        <input type="number" name="daily" value={formData.budgetBreakdown?.daily} onChange={handleBudgetBreakdownChange} className="w-full bg-white dark:bg-charcoal-900 rounded-lg p-2 text-sm" placeholder="0" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Travelers
                  </label>
                  <select name="groupType" value={formData.groupType} onChange={handleChange} className={selectClasses}>
                    {['Solo', 'Couple', 'Family with Kids', 'Family with Teens', 'Friends', 'Business', 'Large Group'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {!isSurpriseMe && (
                <div>
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INTERESTS.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${formData.interests.includes(interest)
                          ? 'bg-forest-600 text-white shadow-lg shadow-forest-600/30 transform scale-105'
                          : 'bg-sand-50 dark:bg-charcoal-800 text-charcoal-600 dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-charcoal-700'
                          }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Fine Tuning & Estimate */}
            <div className="space-y-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-clay-100 dark:bg-clay-900 text-clay-700 dark:text-clay-300 flex items-center justify-center text-sm">02</span>
                Fine Tuning
              </h3>

              <div>
                <label className={labelClasses}>
                  <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Pace
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <RadioCard label="Chill" subLabel="Relaxed" value="Relaxed" groupValue={formData.activityLevel} onClick={() => handleSelection('activityLevel', 'Relaxed')} icon="☕" />
                  <RadioCard label="Balanced" subLabel="Medium" value="Moderate" groupValue={formData.activityLevel} onClick={() => handleSelection('activityLevel', 'Moderate')} icon="⚖️" />
                  <RadioCard label="Packed" subLabel="Fast" value="Fast Paced" groupValue={formData.activityLevel} onClick={() => handleSelection('activityLevel', 'Fast Paced')} icon="⚡" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Currency
                  </label>
                  <select name="currency" value={formData.currency} onChange={handleChange} className={selectClasses}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                    Output Language
                  </label>
                  <select name="language" value={formData.language} onChange={handleChange} className={selectClasses}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* --- LIVE ESTIMATE CARD --- */}
              <div className="mt-auto bg-gradient-to-br from-forest-800 to-forest-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.62 1.87 1.58 0 2.49-.72 2.49-1.8 0-1.11-.81-1.63-2.67-2.07-2.33-.56-3.79-1.47-3.79-3.28 0-1.76 1.4-3.08 3.01-3.41V4h2.67v1.94c1.61.32 2.89 1.42 3.03 3.15h-1.95c-.13-.91-.85-1.6-2.42-1.6-1.5 0-2.3.73-2.3 1.63 0 1.05.9 1.54 2.67 1.99 2.45.62 3.8 1.59 3.8 3.32 0 1.82-1.43 3.17-3.18 3.52z" /></svg>
                </div>
                <div className="relative z-10">
                  <p className="text-forest-200 text-xs font-bold uppercase tracking-widest mb-1">Live Estimate</p>
                  <h4 className="text-3xl md:text-4xl font-bold font-display">{estimatedCost}</h4>
                  <p className="text-forest-200 text-sm mt-2 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Est. Total for {formData.duration} Days
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-forest-300">
                    {isAdvancedBudget ? 'Custom estimate based on your inputs.' : `Based on ${formData.budget} tier for ${formData.groupType}. Excludes flights.`}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {tripError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
              <span className="text-xl">⚠️</span> {tripError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isGenerating}
            className={`w-full py-6 rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl transform active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden group ${!isFormValid || isGenerating
              ? 'bg-charcoal-200 dark:bg-charcoal-800 text-charcoal-400 cursor-not-allowed'
              : 'bg-forest-900 text-white hover:bg-forest-800 hover:shadow-2xl hover:shadow-forest-900/30'
              }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white/50" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Crafting Itinerary...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Generate Trip Plan</span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </>
            )}
          </button>
          {!isFormValid && (
            <div className="text-center mt-3 animate-pulse">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                {isSurpriseMe ? "✨ Please select a Vibe (Quiz) to proceed." : "✨ Please enter a destination (or select a vibe) and valid details."}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};