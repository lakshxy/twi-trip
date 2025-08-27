import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useAuth } from "@/lib/auth";
import type { ConfirmationResult } from "firebase/auth";

const steps = [
  'Auth',
  'Basic',
  'Preferences',
  'Bio',
  'Host/Traveler',
  'Final',
];

// Add a list of suggested interests
const SUGGESTED_INTERESTS = [
  'Hiking', 'Photography', 'Food', 'Culture', 'Music', 'Art', 'Adventure', 'History', 'Nature', 'Sports', 'Technology', 'Reading', 'Writing', 'Dancing', 'Movies', 'Travel', 'Fitness', 'Yoga', 'Meditation', 'Volunteering', 'Cooking', 'Biking', 'Swimming', 'Gaming', 'Languages', 'Crafts', 'Shopping', 'Nightlife', 'Animals', 'Gardening'
];

export function SignupWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    // Auth
    email: '',
    password: '',
    provider: '',
    phone: '',
    otp: '',
    // Basic
    fullName: '',
    age: '',
    gender: '',
    dob: '',
    profilePic: null as File | null,
    location: '',
    // Preferences
    roles: [] as string[],
    purposes: [] as string[],
    frequency: '',
    hosting: '',
    // Bio
    bio: '',
    interests: [] as string[],
    languages: [] as string[],
    social: '',
    // Host/Traveler
    stayType: '',
    stayCost: '',
    maxGuests: '',
    amenities: [] as string[],
    nextDest: '',
    arrival: '',
    duration: '',
    lookingFor: [] as string[],
    connectWith: [] as string[],
    comms: [] as string[],
    // Final
    agree: false,
  });
  const [, navigate] = useLocation();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldWarnings, setFieldWarnings] = useState<{ [key: string]: string }>({});
  const interestInputRef = useRef<HTMLInputElement>(null);
  const [interestQuery, setInterestQuery] = useState('');
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { signUp, signIn, updateUserProfile, startPhoneAuth, confirmPhoneAuth } = useAuth();

  // Helper to check if only Traveler is selected
  const isTravelerOnly = form.roles.includes('Traveler') && !form.roles.includes('Host');

  // Helper to clear host fields if switching to Traveler only
  const clearHostFields = (f: typeof form) => ({
    ...f,
    stayType: '',
    stayCost: '',
    maxGuests: '',
    amenities: [],
  });

  // Autocomplete/tag input for interests
  const filteredInterestSuggestions = SUGGESTED_INTERESTS.filter(
    (interest) =>
      interest.toLowerCase().includes(interestQuery.toLowerCase()) &&
      !form.interests.includes(interest)
  ).slice(0, 5);

  const handleInterestInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestQuery(e.target.value);
    setShowInterestSuggestions(true);
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && interestQuery.trim()) {
      e.preventDefault();
      const value = interestQuery.trim();
      if (value.length < 2 || form.interests.includes(value) || form.interests.length >= 5) return;
      setForm((f) => ({ ...f, interests: [...f.interests, value] }));
      setInterestQuery('');
      setShowInterestSuggestions(false);
    }
  };

  const handleInterestSuggestionClick = (interest: string) => {
    if (!form.interests.includes(interest) && form.interests.length < 5) {
      setForm((f) => ({ ...f, interests: [...f.interests, interest] }));
      setInterestQuery('');
      setShowInterestSuggestions(false);
      if (interestInputRef.current) interestInputRef.current.focus();
    }
  };

 

  const handleNext = async () => {
    const validationWarnings = validateStep(step);
    if (validationWarnings) {
      setFieldWarnings(validationWarnings);
      setError('Please fill all required fields.');
      return;
    }
    setFieldWarnings({});
    setError(null);
    
    // On Auth step, create user with Firebase
    if (step === 0) {
      try {
        if (authMethod === 'email') {
          await signUp(form.email, form.password, form.fullName || form.email);
        } else {
          if (!otpSent) {
            const confirmation = await startPhoneAuth(form.phone, 'recaptcha-container');
            setConfirmationResult(confirmation);
            setOtpSent(true);
            return; // stay on the same step to input OTP
          } else if (confirmationResult) {
            await confirmPhoneAuth(confirmationResult, form.otp);
          } else {
            setError('Please request OTP again.');
            return;
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create account');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    if (name === 'interests' || name === 'languages') {
      fieldValue = value.split(',').map(s => s.trim()).filter(Boolean);
    }
    setForm((f) => ({ ...f, [name]: fieldValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Update user profile with form data
      await updateUserProfile({
        bio: form.bio,
        city: form.location,
        state: '', // You may want to split location into city/state
        interests: form.interests,
        languages: form.languages,
        travelGoals: [], // Add if you collect this
        profileImage: '', // Add if you collect this
        age: form.age ? parseInt(form.age) : null,
        // New fields
        roles: form.roles,
        purposes: form.purposes,
        frequency: form.frequency,
        hosting: form.hosting,
        stayType: form.stayType,
        stayCost: form.stayCost,
        maxGuests: form.maxGuests ? parseInt(form.maxGuests) : null,
        amenities: form.amenities,
        nextDest: form.nextDest,
        arrival: form.arrival,
        duration: form.duration,
        lookingFor: form.lookingFor,
        connectWith: form.connectWith,
        comms: form.comms,
        profileComplete: true,
      });
      
      localStorage.setItem('justSignedUp', 'true');
      navigate('/explore');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  // Placeholder handlers for social logins
  const handleSocial = (provider: string) => {
    alert(`Social login with ${provider} coming soon!`);
  };
  // Tag input helpers for interests and languages
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, field: 'interests' | 'languages' | 'lookingFor' | 'connectWith' | 'comms') => {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    if (e.key === 'Enter' && value) {
      e.preventDefault();
      if (value.length < 2) return; // Prevent tags shorter than 2 chars
      setForm(f => {
        const arr = Array.isArray(f[field]) ? f[field] : [];
        if (arr.length >= 5) return f;
        if (arr.includes(value)) return f;
        return { ...f, [field]: [...arr, value] };
      });
      input.value = '';
    }
  };
  const handleTagRemove = (field: 'interests' | 'languages' | 'lookingFor' | 'connectWith' | 'comms', tag: string) => {
    setForm(f => ({ ...f, [field]: (f[field] as string[]).filter((t: string) => t !== tag) }));
  };
  // Bio word limit
  const bioWordCount = form.bio ? form.bio.trim().split(/\s+/).length : 0;
  const bioOverLimit = bioWordCount > 150;

  // Refactored validation for traveler/host step
  function validateStep(step: number) {
    const warnings: { [key: string]: string } = {};
    if (step === 4) {
      const travelerSelected = form.roles.includes('Traveler');
      const hostSelected = form.roles.includes('Host');
      if (travelerSelected && !hostSelected) {
        if (!form.nextDest?.trim()) warnings.nextDest = 'Required';
        if (!form.arrival?.trim()) warnings.arrival = 'Required';
        if (!form.duration?.trim()) warnings.duration = 'Required';
        if (!Array.isArray(form.lookingFor) || form.lookingFor.filter(tag => tag && tag.trim().length > 0).length === 0) warnings.lookingFor = 'Required';
        if (Object.keys(warnings).length > 0) return warnings;
      } else if (hostSelected) {
        if (!form.stayType) warnings.stayType = 'Required';
        if (!form.stayCost) warnings.stayCost = 'Required';
        if (!form.maxGuests) warnings.maxGuests = 'Required';
        if (form.amenities.length === 0) warnings.amenities = 'Required';
        if (!form.nextDest?.trim()) warnings.nextDest = 'Required';
        if (!form.arrival?.trim()) warnings.arrival = 'Required';
        if (!form.duration?.trim()) warnings.duration = 'Required';
        if (!Array.isArray(form.lookingFor) || form.lookingFor.filter(tag => tag && tag.trim().length > 0).length === 0) warnings.lookingFor = 'Required';
        if (Object.keys(warnings).length > 0) return warnings;
      } else {
        warnings.roles = 'Please select if you are a Traveler, Host, or Both.';
        return warnings;
      }
    }
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
      <Card className="w-full max-w-3xl shadow-xl">
        <form onSubmit={handleSubmit}>
        <CardContent className="p-10">
          {/* Stepper UI - only show after auth step */}
          {step > 0 && (
            <div className="flex justify-between mb-8">
              {steps.map((label, idx) => (
                <div key={label} className={`flex-1 text-center ${idx === step ? 'font-bold text-travel-navy' : 'text-gray-400'}`}>{label}</div>
              ))}
            </div>
          )}
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            {emailVerificationSent && (
              <div className="text-green-600 text-center mt-4">
                Verification email sent! Please check your inbox and verify your email to complete registration.
              </div>
            )}
          {/* Step 0: Authentication */}
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Auth options card */}
              <div className="flex flex-col gap-6 justify-center">
                <h2 className="text-2xl font-bold text-travel-navy mb-2">Sign up to TwiTrip</h2>
                <Button className="w-full flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" type="button" onClick={() => handleSocial('Google')}>
                  <FaGoogle className="text-lg" /> Continue with Google
                </Button>
                <Button className="w-full flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" type="button" onClick={() => handleSocial('Apple')}>
                  <FaApple className="text-lg" /> Continue with Apple
                </Button>
                <Button className="w-full flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" type="button" onClick={() => handleSocial('Facebook')}>
                  <FaFacebookF className="text-lg" /> Continue with Facebook
                </Button>
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="mx-3 text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <Button
                  className="w-full mb-4 bg-gradient-primary text-white font-semibold py-3 rounded-xl"
                  type="button"
                  onClick={() => navigate('/email-link-signup')}
                >
                  Sign up with Email Link (No Password)
                </Button>
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant={authMethod === 'email' ? 'default' : 'outline'} onClick={() => setAuthMethod('email')}>Email</Button>
                  <Button type="button" variant={authMethod === 'phone' ? 'default' : 'outline'} onClick={() => setAuthMethod('phone')}>Phone</Button>
                </div>
                {authMethod === 'email' ? (
                  <>
                    <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                  </>
                ) : (
                  <>
                    <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
                    <div id="recaptcha-container"></div>
                    {!otpSent ? (
                      <Button type="button" className="w-full mt-2" disabled={otpLoading} onClick={async () => { setOtpLoading(true); await handleNext(); }}>
                        {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                      </Button>
                    ) : (
                      <>
                        <Input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} required />
                        <Button type="button" className="w-full mt-2" onClick={handleNext}>
                          Verify OTP
                        </Button>
                      </>
                    )}
                  </>
                )}
                <Button className="w-full mt-4 bg-gradient-primary text-white font-semibold py-3 rounded-xl" type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
              {/* Illustration or info card */}
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-primary rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Welcome to TwiTrip!</h3>
                <p className="text-base opacity-90 mb-4 text-center">Create your account to join a global community of travelers and hosts. Sign up with your favorite method and start your journey!</p>
                {/* You can add an illustration or logo here */}
              </div>
            </div>
          )}
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div>
              <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
              <Input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={e => {
                handleChange(e);
                // Calculate age
                const dob = e.target.value;
                if (dob) {
                  const today = new Date();
                  const birthDate = new Date(dob);
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }
                  setForm(f => ({ ...f, age: age > 0 ? String(age) : '' }));
                } else {
                  setForm(f => ({ ...f, age: '' }));
                }
              }} required />
              <Input name="age" placeholder="Age" value={form.age} readOnly disabled required />
              <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
              <Select name="gender" value={form.gender} onValueChange={(v) => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-travel-navy mb-2">Preferences & Intentions</h2>
                <label className="font-semibold">I want to...</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    'Explore new places',
                    'Meet new people',
                    'Offer a place to stay',
                    'Share local experiences',
                    'Organize group trips',
                    'Provide rides or transport',
                    'Help plan travel',
                    'Connect travelers with services',
                  ].map(role => (
                    <Button
                      key={role}
                      type="button"
                      variant={form.roles.includes(role) ? 'default' : 'outline'}
                      onClick={() => setForm(f => ({
                        ...f,
                        roles: f.roles.includes(role)
                          ? f.roles.filter(r => r !== role)
                          : [...f.roles, role],
                      }))}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">My main purpose</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    'Adventure & Exploration',
                    'Work & Networking',
                    'Volunteering & Giving Back',
                    'Cultural Exchange',
                    'Group Travel',
                    'Local Experiences',
                    'Travel Planning & Support',
                  ].map(purpose => (
                    <Button
                      key={purpose}
                      type="button"
                      variant={form.purposes.includes(purpose) ? 'default' : 'outline'}
                      onClick={() => setForm(f => ({
                        ...f,
                        purposes: f.purposes.includes(purpose)
                          ? f.purposes.filter(p => p !== purpose)
                          : [...f.purposes, purpose],
                      }))}
                    >
                      {purpose}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">Travel Frequency</label>
                <div className="flex gap-2 flex-wrap">
                  {['Often', 'Occasionally', 'Rarely'].map(freq => (
                    <Button
                      key={freq}
                      type="button"
                      variant={form.frequency === freq ? 'default' : 'outline'}
                      onClick={() => setForm(f => ({ ...f, frequency: freq }))}
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">Hosting Availability</label>
                <div className="flex gap-2 flex-wrap">
                  {['Available to host', 'Not hosting right now', 'Maybe open to it'].map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant={form.hosting === option ? 'default' : 'outline'}
                      onClick={() => setForm(f => ({ ...f, hosting: option }))}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-primary rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Your travel style</h3>
                <p className="text-base opacity-90 mb-4 text-center">Let us know your travel and hosting preferences to help us match you with the right people and experiences.</p>
              </div>
            </div>
          )}
          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-travel-navy mb-2">Bio & Personal Vibes</h2>
                <label className="font-semibold">Tell us about yourself</label>
                <Textarea name="bio" placeholder="A little bit about you..." className="h-24" value={form.bio} onChange={handleChange} maxLength={1500} />
                <div className={`text-sm mt-1 ${bioOverLimit ? 'text-red-500' : 'text-gray-500'}`}>{bioWordCount}/150 words</div>
                <label className="font-semibold">Interests</label>
                <div className="text-sm text-travel-navy font-medium mb-1">Selected Interests:</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(form.interests) && form.interests.length === 0 && (
                    <span className="text-gray-400 italic">No interests selected yet</span>
                  )}
                  {Array.isArray(form.interests) && form.interests.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-travel-mint/20 text-travel-navy border border-travel-mint/40 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('interests', tag)}>&times;</button>
                    </span>
                  ))}
                  {Array.isArray(form.interests) && form.interests.length < 5 && (
                      <div style={{ position: 'relative' }}>
                    <input
                          ref={interestInputRef}
                      type="text"
                      placeholder="Add interest and press Enter"
                      className="border border-travel-mint rounded px-2 py-1 text-sm outline-none"
                          value={interestQuery}
                          onChange={handleInterestInput}
                          onKeyDown={handleInterestKeyDown}
                          onFocus={() => setShowInterestSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowInterestSuggestions(false), 100)}
                        />
                        {showInterestSuggestions && filteredInterestSuggestions.length > 0 && (
                          <div className="absolute z-10 bg-white border border-gray-200 rounded shadow-md mt-1 w-full">
                            {filteredInterestSuggestions.map((interest) => (
                              <div
                                key={interest}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => handleInterestSuggestionClick(interest)}
                              >
                                {interest}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                  )}
                </div>
                <label className="font-semibold">Languages Spoken</label>
                <div className="text-sm text-travel-navy font-medium mb-1">Selected Languages:</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(form.languages) && form.languages.length === 0 && (
                    <span className="text-gray-400 italic">No languages selected yet</span>
                  )}
                  {Array.isArray(form.languages) && form.languages.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-travel-lavender/20 text-travel-navy border border-travel-lavender/40 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('languages', tag)}>&times;</button>
                    </span>
                  ))}
                  {Array.isArray(form.languages) && form.languages.length < 5 && (
                    <input
                      type="text"
                      placeholder="Add language and press Enter"
                      className="border border-travel-lavender rounded px-2 py-1 text-sm outline-none"
                      onKeyDown={e => handleTagInput(e, 'languages')}
                    />
                  )}
                </div>
                <label className="font-semibold">Instagram or Social link (optional)</label>
                <Input name="social" placeholder="Instagram or other social link" />
              </div>
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-primary rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Show your vibe</h3>
                <p className="text-base opacity-90 mb-4 text-center">Share your interests, languages, and a fun bio to help others get to know you!</p>
              </div>
            </div>
          )}
          {/* Step 4: Host/Traveler */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-travel-navy mb-2">Host/Traveler Details</h2>
                <label className="font-semibold">I am a:</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  <Button
                    type="button"
                    variant={form.roles.includes('Traveler') && !form.roles.includes('Host') ? 'default' : 'outline'}
                    onClick={() => setForm(f => (
                      f.roles.includes('Traveler') && !f.roles.includes('Host')
                        ? { ...f, roles: [] }
                        : clearHostFields({ ...f, roles: ['Traveler'] })
                    ))}
                  >
                    Traveler
                  </Button>
                  <Button
                    type="button"
                    variant={form.roles.includes('Host') && !form.roles.includes('Traveler') ? 'default' : 'outline'}
                    onClick={() => setForm(f => ({
                      ...f,
                      roles: f.roles.includes('Host') && !f.roles.includes('Traveler') ? [] : ['Host'],
                    }))}
                  >
                    Host
                  </Button>
                  <Button
                    type="button"
                    variant={form.roles.includes('Traveler') && form.roles.includes('Host') ? 'default' : 'outline'}
                    onClick={() => setForm(f => ({
                      ...f,
                      roles: f.roles.includes('Traveler') && f.roles.includes('Host') ? [] : ['Traveler', 'Host'],
                    }))}
                  >
                    Both
                  </Button>
                </div>
                <label className="font-semibold">Type of Stay (for Hosts)</label>
                  {fieldWarnings.stayType && <span className="text-red-500 text-xs">{fieldWarnings.stayType}</span>}
                <div className="flex gap-2 flex-wrap">
                  {['Shared Room', 'Private Room', 'Couch', 'Tent', 'Entire Place'].map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={form.stayType === type ? 'default' : 'outline'}
                      onClick={() => !(form.roles.includes('Traveler') && !form.roles.includes('Host')) && setForm(f => ({ ...f, stayType: type }))}
                      disabled={form.roles.includes('Traveler') && !form.roles.includes('Host')}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">Stay is</label>
                  {fieldWarnings.stayCost && <span className="text-red-500 text-xs">{fieldWarnings.stayCost}</span>}
                <div className="flex gap-2 flex-wrap">
                  {['Free', 'Paid', 'Pay-what-you-can'].map(cost => (
                    <Button
                      key={cost}
                      type="button"
                      variant={form.stayCost === cost ? 'default' : 'outline'}
                      onClick={() => !(form.roles.includes('Traveler') && !form.roles.includes('Host')) && setForm(f => ({ ...f, stayCost: cost }))}
                      disabled={form.roles.includes('Traveler') && !form.roles.includes('Host')}
                    >
                      {cost}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">Max Guests Allowed</label>
                  {fieldWarnings.maxGuests && <span className="text-red-500 text-xs">{fieldWarnings.maxGuests}</span>}
                <Input name="maxGuests" placeholder="e.g. 2" disabled={form.roles.includes('Traveler') && !form.roles.includes('Host')} />
                <label className="font-semibold mt-4">Amenities</label>
                  {fieldWarnings.amenities && <span className="text-red-500 text-xs">{fieldWarnings.amenities}</span>}
                <div className="flex gap-2 flex-wrap mb-2">
                  {['WiFi', 'Kitchen', 'Pet Friendly', 'Laundry'].map(amenity => (
                    <Button
                      key={amenity}
                      type="button"
                      variant={form.amenities.includes(amenity) ? 'default' : 'outline'}
                      onClick={() => !(form.roles.includes('Traveler') && !form.roles.includes('Host')) && setForm(f => ({
                        ...f,
                        amenities: f.amenities.includes(amenity)
                          ? f.amenities.filter(a => a !== amenity)
                          : [...f.amenities, amenity]
                      }))}
                      disabled={form.roles.includes('Traveler') && !form.roles.includes('Host')}
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
                <label className="font-semibold mt-4">Next Destination(s) (for Travelers)</label>
                  {fieldWarnings.nextDest && <span className="text-red-500 text-xs">{fieldWarnings.nextDest}</span>}
                <Input name="nextDest" placeholder="e.g. Paris, Tokyo" value={form.nextDest} onChange={handleChange} />
                <label className="font-semibold mt-4">Arrival Date & Duration</label>
                  {fieldWarnings.arrival && <span className="text-red-500 text-xs">{fieldWarnings.arrival}</span>}
                  {fieldWarnings.duration && <span className="text-red-500 text-xs">{fieldWarnings.duration}</span>}
                <Input name="arrival" placeholder="Arrival Date" type="date" value={form.arrival} onChange={handleChange} />
                <Input name="duration" placeholder="Duration (days)" value={form.duration} onChange={handleChange} />
                <label className="font-semibold mt-4">What you're looking for</label>
                  {fieldWarnings.lookingFor && <span className="text-red-500 text-xs">{fieldWarnings.lookingFor}</span>}
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(form.lookingFor) && form.lookingFor.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-travel-mint/20 text-travel-navy border border-travel-mint/40 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('lookingFor', tag)}>&times;</button>
                    </span>
                  ))}
                  {Array.isArray(form.lookingFor) && form.lookingFor.length < 5 && (
                    <input
                      type="text"
                      placeholder="Add and press Enter"
                      className="border border-travel-mint rounded px-2 py-1 text-sm outline-none"
                      onKeyDown={e => handleTagInput(e, 'lookingFor')}
                    />
                  )}
                </div>
              </div>
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-primary rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Host or Traveler?</h3>
                <p className="text-base opacity-90 mb-4 text-center">Share your hosting details or travel plans to connect with the right people.</p>
              </div>
            </div>
          )}
          {/* Step 5: Final */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-travel-navy mb-2">Final Steps</h2>
                <label className="font-semibold">Who do you want to connect with?</label>
                {/* Predefined options for connectWith */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {['All travelers', 'Solo female travelers', 'Digital nomads', 'Local guides', 'Adventure seekers', 'Families', 'LGBTQ+ travelers'].map(option => (
                    form.connectWith?.includes(option) ? (
                      <span key={option} className="inline-flex items-center bg-travel-mint/20 text-travel-navy border border-travel-mint/40 rounded-full px-3 py-1 text-sm font-medium">
                        {option}
                        <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('connectWith', option)}>&times;</button>
                      </span>
                    ) : (
                      <button
                        key={option}
                        type="button"
                        className="px-3 py-1 rounded-full border text-sm font-medium transition-colors bg-white text-gray-500 border-gray-300 hover:bg-travel-mint/10"
                        onClick={() => {
                          setForm(f => {
                            const arr = Array.isArray(f.connectWith) ? f.connectWith : [];
                            if (arr.length >= 5) return f;
                            return { ...f, connectWith: [...arr, option] };
                          });
                        }}
                        disabled={Array.isArray(form.connectWith) && form.connectWith.length >= 5}
                      >
                        {option}
                      </button>
                    )
                  ))}
                  {/* Custom tag capsules */}
                  {Array.isArray(form.connectWith) && form.connectWith.filter(tag => !['All travelers', 'Solo female travelers', 'Digital nomads', 'Local guides', 'Adventure seekers', 'Families', 'LGBTQ+ travelers'].includes(tag)).map(tag => (
                    <span key={tag} className="inline-flex items-center bg-travel-mint/20 text-travel-navy border border-travel-mint/40 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('connectWith', tag)}>&times;</button>
                    </span>
                  ))}
                  {Array.isArray(form.connectWith) && form.connectWith.length < 5 && (
                    <input
                      type="text"
                      placeholder="Add and press Enter"
                      className="border border-travel-mint rounded px-2 py-1 text-sm outline-none"
                      onKeyDown={e => handleTagInput(e, 'connectWith')}
                    />
                  )}
                </div>
                <label className="font-semibold mt-4">Preferred Communication</label>
                {/* Predefined options for comms */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {['In-app chat', 'WhatsApp', 'Email', 'Phone', 'Telegram'].map(option => (
                    form.comms?.includes(option) ? (
                      <span key={option} className="inline-flex items-center bg-travel-lavender/20 text-travel-navy border border-travel-lavender/40 rounded-full px-3 py-1 text-sm font-medium">
                        {option}
                        <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('comms', option)}>&times;</button>
                      </span>
                    ) : (
                      <button
                        key={option}
                        type="button"
                        className="px-3 py-1 rounded-full border text-sm font-medium transition-colors bg-white text-gray-500 border-gray-300 hover:bg-travel-lavender/10"
                        onClick={() => {
                          setForm(f => {
                            const arr = Array.isArray(f.comms) ? f.comms : [];
                            if (arr.length >= 5) return f;
                            return { ...f, comms: [...arr, option] };
                          });
                        }}
                        disabled={Array.isArray(form.comms) && form.comms.length >= 5}
                      >
                        {option}
                      </button>
                    )
                  ))}
                  {/* Custom tag capsules */}
                  {Array.isArray(form.comms) && form.comms.filter(tag => !['In-app chat', 'WhatsApp', 'Email', 'Phone', 'Telegram'].includes(tag)).map(tag => (
                    <span key={tag} className="inline-flex items-center bg-travel-lavender/20 text-travel-navy border border-travel-lavender/40 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-travel-navy/60 hover:text-red-500" onClick={() => handleTagRemove('comms', tag)}>&times;</button>
                    </span>
                  ))}
                  {Array.isArray(form.comms) && form.comms.length < 5 && (
                    <input
                      type="text"
                      placeholder="Add and press Enter"
                      className="border border-travel-lavender rounded px-2 py-1 text-sm outline-none"
                      onKeyDown={e => handleTagInput(e, 'comms')}
                    />
                  )}
                </div>
                <div className="flex items-center mt-4">
                  <input type="checkbox" id="agree" className="mr-2" />
                  <label htmlFor="agree" className="text-sm">I agree to the <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a></label>
                </div>
                <Button className="w-full mt-4 bg-gradient-primary text-white font-semibold py-3 rounded-xl" type="submit">
                  Submit Profile
                </Button>
              </div>
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-primary rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">You're all set!</h3>
                <p className="text-base opacity-90 mb-4 text-center">Submit your profile to join the TwiTrip community and start your adventure!</p>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-8">
            {step > 0 && <Button type="button" onClick={handleBack}>Back</Button>}
            {step < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>Next</Button>
            ) : (
              <Button type="submit">Submit Profile</Button>
            )}
          </div>
        </CardContent>
        </form>
      </Card>
    </div>
  );
} 