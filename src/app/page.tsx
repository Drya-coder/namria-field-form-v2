'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type FieldObservation } from '@/db/db';
import { exportObservationToPDF } from '@/utils/exportPdf';

const emptyValues: FieldObservation = {
  formTitle: 'NAMRIA-ENRM-Forms18 Vers00',
  cornerNo: '',
  mapCodeNo: '',
  proposedClassification: 'Forestland',
  sitio: '',
  barangay: '',
  municipality: '',
  province: '',
  lcCornerNo: '',
  lcMapNo: '',
  lcArcProgNo: '',
  lcStNo: '',
  lcStProgNo: '',
  lcIdNo: '',
  observationDate: '',
  timeStarted: '',
  timeEnded: '',
  duration: '',
  instrumentType: 'Handheld Unit',
  brandModel: '',
  method: '',
  easting: '',
  northing: '',
  datum: 'WGS 84',
  gnssAccuracy: '',
  baseStationName: '',
  antennaHeight: '',
  gnssCivNo: '',
  generalObservation: '',
  existingTenure: 'N/A',
  issuesAndConflicts: 'N/A',
  treeSpeciesAd: '',
  timberAd: 'w/o',
  treeSpeciesForest: '',
  timberForest: 'w/o',
  topographySlope: '',
  existingLandUse: '',
  claimants: '',
  denrRepresentatives: [{ name: '', office: '', designation: '', date: '' }],
  namriaSurveyTeam: [{ name: '', designation: 'FST Member', date: '' }]
};

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe live query with error handling for mobile browsers
  const observations = useLiveQuery(async () => {
    try {
      if (!db?.observations) return [];
      return await db.observations.toArray();
    } catch (err) {
      console.error('Dexie error:', err);
      return [];
    }
  }) || [];

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<FieldObservation>({
    defaultValues: emptyValues
  });

  useEffect(() => {
    setValue('observationDate', new Date().toISOString().split('T')[0]);
  }, [setValue]);

  const { fields: denrFields, append: appendDenr, remove: removeDenr } = useFieldArray({
    control,
    name: 'denrRepresentatives'
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
    control,
    name: 'namriaSurveyTeam'
  });

  const handleViewObservation = (obs: FieldObservation) => {
    reset(obs);
    setView('form');
  };

  const handleNewObservation = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reset({
      ...emptyValues,
      observationDate: new Date().toISOString().split('T')[0]
    });
    setView('form');
  };

  const onSubmit = async (data: FieldObservation) => {
    try {
      if (db?.observations) {
        await db.observations.add({
          ...data,
          createdAt: new Date(),
          synced: false
        });
      }
      setSuccessMessage('Field observation successfully saved offline!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      reset({
        ...emptyValues,
        observationDate: new Date().toISOString().split('T')[0]
      });
      setTimeout(() => {
        setSuccessMessage('');
        setView('dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving observation:', error);
      alert('Failed to save observation.');
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600 font-sans text-xs">Loading NAMRIA App...</div>;
  }

  return (
    <main className="min-h-screen py-6 px-3 sm:px-6 lg:px-8 bg-slate-100 select-none">
      <div className="max-w-4xl mx-auto">
        {view === 'dashboard' ? (
          <div className="space-y-6">
            <div className="bg-[#182848] text-white p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#009688] gap-4">
              <div>
                <h1 className="text-base sm:text-xl font-black uppercase tracking-wider">NAMRIA Field Observation Dashboard</h1>
                <p className="text-xs text-teal-300 mt-1">Land Classification of Unclassified Public Forest (Offline Mode)</p>
              </div>
              <button
                type="button"
                onClick={handleNewObservation}
                onTouchEnd={handleNewObservation}
                className="w-full sm:w-auto px-6 py-4 bg-[#009688] hover:bg-teal-700 active:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xl transition cursor-pointer touch-manipulation z-50"
              >
                + New Field Observation
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b">
                Offline Saved Records ({observations.length})
              </h2>

              {observations.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500 py-8 text-center">
                  No offline observations saved yet. Tap &quot;+ New Field Observation&quot; above to begin.
                </p>
              ) : (
                <div className="space-y-4">
                  {observations.map((obs) => (
                    <div 
                      key={obs.id || Math.random()} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                    >
                      <div className="cursor-pointer flex-1 w-full" onClick={() => handleViewObservation(obs)}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#182848]">Corner: {obs.cornerNo || 'N/A'}</span>
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-semibold">{obs.proposedClassification}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Location: {obs.barangay}, {obs.municipality}, {obs.province}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Date Observed: {obs.observationDate} (Tap to view)</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleViewObservation(obs)}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
                        >
                          View / Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => exportObservationToPDF(obs)}
                          className="px-4 py-2 bg-[#182848] hover:bg-[#009688] text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
                        >
                          Export PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 font-sans text-xs">
            <div className="bg-[#182848] text-white px-6 py-5 flex justify-between items-center border-b-4 border-[#009688]">
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-teal-300">REPUBLIC OF THE PHILIPPINES</h2>
                <h1 className="text-sm font-black tracking-wide">DENR - NAMRIA</h1>
              </div>
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl text-white shadow transition cursor-pointer"
              >
                ← Back to Dashboard
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-6 p-4 bg-teal-50 border-l-4 border-[#009688] text-teal-900 text-xs font-semibold rounded-r-xl">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 pb-32 space-y-6">
              <div className="text-center pb-4 border-b border-slate-200">
                <h1 className="text-sm sm:text-base font-black uppercase text-[#182848] tracking-tight">
                  FIELD OBSERVATION FOR LAND CLASSIFICATION OF UNCLASSIFIED PUBLIC FOREST
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {watch('formTitle')}
                </p>
              </div>

              {/* SECTION I */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider border-b pb-2">
                  I. Pre-Determined Corner Description
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corner No.:</label>
                    <input type="text" {...register('cornerNo', { required: true })} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Corner 5" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Map Code/No.:</label>
                    <input type="text" {...register('mapCodeNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Map Code" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Proposed Classification:</label>
                    <select {...register('proposedClassification')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none">
                      <option value="Alienable & Disposable">Alienable & Disposable</option>
                      <option value="Forestland">Forestland</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sitio/Purok:</label>
                    <input type="text" {...register('sitio')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Sitio" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Barangay:</label>
                    <input type="text" {...register('barangay', { required: true })} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Barangay" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Municipality:</label>
                    <input type="text" {...register('municipality', { required: true })} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Municipality" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Province:</label>
                    <input type="text" {...register('province', { required: true })} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Province" />
                  </div>
                </div>
              </div>

              {/* LC MAP APPROVAL */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2">
                  To Be Filled Out Upon Approval of Proposed LC Map
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Corner No.:</label>
                    <input type="text" {...register('lcCornerNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Map No.:</label>
                    <input type="text" {...register('lcMapNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">ARC Prog. No.:</label>
                    <input type="text" {...register('lcArcProgNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">St. No.:</label>
                    <input type="text" {...register('lcStNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">St. Prog. No.:</label>
                    <input type="text" {...register('lcStProgNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Id. No.:</label>
                    <input type="text" {...register('lcIdNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                </div>
              </div>

              {/* SECTION II */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider border-b pb-2">
                  II. Record of GNSS Coordinates & Instruments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Observation Date:</label>
                    <input type="date" {...register('observationDate', { required: true })} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Started:</label>
                    <input type="time" {...register('timeStarted')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Time Ended:</label>
                    <input type="time" {...register('timeEnded')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration:</label>
                    <input type="text" {...register('duration')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="e.g. 15 mins" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Instrument Type:</label>
                    <select {...register('instrumentType')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none">
                      <option value="Handheld Unit">Handheld Unit</option>
                      <option value="Survey Grade Unit">Survey Grade Unit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand / Model:</label>
                    <input type="text" {...register('brandModel')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="e.g. Montana 700" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Method:</label>
                    <input type="text" {...register('method')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Method" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Northing:</label>
                    <input type="text" {...register('northing')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Northing" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Easting:</label>
                    <input type="text" {...register('easting')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Easting" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Datum:</label>
                    <input type="text" {...register('datum')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="WGS 84" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GNSS Accuracy:</label>
                    <input type="text" {...register('gnssAccuracy')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Accuracy" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Base Station Name:</label>
                    <input type="text" {...register('baseStationName')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Antenna Height:</label>
                    <input type="text" {...register('antennaHeight')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GNSS Civ No.:</label>
                    <input type="text" {...register('gnssCivNo')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                </div>
              </div>

              {/* SECTION III */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider border-b pb-2">
                  III. Other Relevant Information
                </h3>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description / General Observation of Corner & Immediate Surroundings:</label>
                  <textarea rows={3} {...register('generalObservation')} className="w-full border border-slate-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="e.g. Foot of hill, roadside..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Existing Tenure / Instruments:</label>
                    <input type="text" {...register('existingTenure')} className="w-full border border-slate-300 p-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Issues and Conflicts:</label>
                    <input type="text" {...register('issuesAndConflicts')} className="w-full border border-slate-300 p-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" />
                  </div>
                </div>
              </div>

              {/* SECTION IV */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider border-b pb-2">
                  IV. Characteristics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide text-teal-800">Proposed A & D Land</h4>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tree Species Found:</label>
                      <input type="text" {...register('treeSpeciesAd')} className="w-full border border-slate-300 p-2.5 rounded-xl focus:ring-2 focus:ring-[#009688] outline-none" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stand of Timber:</label>
                      <select {...register('timberAd')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none">
                        <option value="with">With Commercial Timber</option>
                        <option value="w/o">W/O Commercial Timber</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide text-teal-800">Proposed Forestland</h4>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tree Species Found:</label>
                      <input type="text" {...register('treeSpeciesForest')} className="w-full border border-slate-300 p-2.5 rounded-xl focus:ring-2 focus:ring-[#009688] outline-none" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stand of Timber:</label>
                      <select {...register('timberForest')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-[#009688] outline-none">
                        <option value="with">With Commercial Timber</option>
                        <option value="w/o">W/O Commercial Timber</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">B. Topography / Slope:</label>
                    <input type="text" {...register('topographySlope')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="e.g. Steep 18%" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">C. Existing Land-Use:</label>
                    <input type="text" {...register('existingLandUse')} className="w-full border border-slate-300 p-2.5 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="e.g. Fruit Trees / Brushland" />
                  </div>
                </div>
              </div>

              {/* SECTION V */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5 shadow-sm">
                <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider border-b pb-2">
                  V. Claimants & Personnel Signatures
                </h3>
                
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NAME OF CLAIMANTS:</label>
                  <input type="text" {...register('claimants')} className="w-full border border-slate-300 p-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-[#009688] outline-none" placeholder="Claimant names if any" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#182848] text-xs uppercase">Representatives (DENR / PENRO / CENRO / LGU)</span>
                    <button type="button" onClick={() => appendDenr({ name: '', office: '', designation: '', date: '' })} className="px-3 py-1.5 bg-[#009688] hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer">
                      + Add Representative
                    </button>
                  </div>
                  {denrFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-bold text-slate-600">Name</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.name` as const)} className="w-full border border-slate-300 p-2 rounded-lg bg-white" placeholder="Full Name" />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-600">Office</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.office` as const)} className="w-full border border-slate-300 p-2 rounded-lg bg-white" placeholder="Office" />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-600">Designation</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.designation` as const)} className="w-full border border-slate-300 p-2 rounded-lg bg-white" placeholder="Designation" />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-600">Date</label>
                          <input type="date" {...register(`denrRepresentatives.${index}.date` as const)} className="w-full border border-slate-300 p-2 rounded-lg bg-white" />
                        </div>
                        {denrFields.length > 1 && (
                          <button type="button" onClick={() => removeDenr(index)} className="text-red-600 hover:text-red-800 font-bold px-1 mt-4">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#182848] text-xs uppercase">NAMRIA Survey Team</span>
                    <button type="button" onClick={() => appendTeam({ name: '', designation: 'FST Member', date: '' })} className="px-3 py-1.5 bg-[#009688] hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow transition cursor-pointer">
                      + Add Team Member
                    </button>
                  </div>
                  {teamFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="sm:col-span-6">
                        <label className="text-[10px] font-bold text-slate-600">Name</label>
                        <input type="text" {...register(`namriaSurveyTeam.${index}.name` as const, { required: true })} className="w-full border border-slate-300 p-2 rounded-lg bg-white" placeholder="Full Name" />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-bold text-slate-600">Designation</label>
                        <input type="text" {...register(`namriaSurveyTeam.${index}.designation` as const, { required: true })} className="w-full border border-slate-300 p-2 rounded-lg bg-white" placeholder="FST Leader / Member" />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-600">Date</label>
                          <input type="date" {...register(`namriaSurveyTeam.${index}.date` as const)} className="w-full border border-slate-300 p-2 rounded-lg bg-white" />
                        </div>
                        {teamFields.length > 1 && (
                          <button type="button" onClick={() => removeTeam(index)} className="text-red-600 hover:text-red-800 font-bold px-1 mt-4">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView('dashboard')}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#182848] hover:bg-[#111c33] text-white font-bold rounded-xl shadow-lg border-b-4 border-[#009688] transition cursor-pointer"
                >
                  Save Field Observation Offline
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}