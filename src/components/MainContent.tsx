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

  const observations = useLiveQuery(() => db.observations.toArray()) || [];

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

  const handleNewObservation = (e: React.MouseEvent) => {
    e.preventDefault();
    reset({
      ...emptyValues,
      observationDate: new Date().toISOString().split('T')[0]
    });
    setView('form');
  };

  const onSubmit = async (data: FieldObservation) => {
    try {
      await db.observations.add({
        ...data,
        createdAt: new Date(),
        synced: false
      });
      setSuccessMessage('Field observation successfully saved offline to IndexedDB!');
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

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-4xl mx-auto">
        {view === 'dashboard' ? (
          <div className="space-y-6">
            <div className="bg-[#182848] text-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#009688]">
              <div>
                <h1 className="text-xl font-black uppercase tracking-wider">NAMRIA Field Observation Dashboard</h1>
                <p className="text-xs text-teal-300 mt-1">Land Classification of Unclassified Public Forest (Offline Mode)</p>
              </div>
              <button
                type="button"
                onClick={handleNewObservation}
                className="mt-4 sm:mt-0 px-6 py-3 bg-[#009688] active:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg cursor-pointer transition touch-manipulation"
              >
                + New Field Observation
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-slate-300">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b">
                Offline Saved Records ({observations.length})
              </h2>

              {observations.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  No offline observations saved yet. Click &quot;+ New Field Observation&quot; to begin.
                </p>
              ) : (
                <div className="space-y-3">
                  {observations.map((obs) => (
                    <div 
                      key={obs.id} 
                      className="p-4 bg-slate-50 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-100 transition"
                    >
                      <div className="cursor-pointer flex-1" onClick={() => handleViewObservation(obs)}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#182848]">Corner: {obs.cornerNo || 'N/A'}</span>
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">{obs.proposedClassification}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Location: {obs.barangay}, {obs.municipality}, {obs.province}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Date Observed: {obs.observationDate} (Click to view)</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewObservation(obs)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded shadow transition"
                        >
                          View / Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => exportObservationToPDF(obs)}
                          className="px-3 py-1.5 bg-[#182848] hover:bg-[#009688] text-white text-xs font-bold rounded shadow transition"
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
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-slate-800 font-sans text-xs">
            <div className="bg-[#182848] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#009688]">
              <div>
                <h2 className="text-sm font-black tracking-widest uppercase">REPUBLIC OF THE PHILIPPINES</h2>
                <p className="text-[10px] text-teal-300">DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES - NAMRIA</p>
              </div>
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-[11px] font-bold rounded text-white"
              >
                ← Back to Dashboard
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-4 p-3 bg-teal-50 border-l-4 border-[#009688] text-teal-900 text-xs font-semibold">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 pb-32 space-y-4">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h1 className="text-base font-black uppercase text-[#182848]">
                  FIELD OBSERVATION FOR LAND CLASSIFICATION OF UNCLASSIFIED PUBLIC FOREST
                </h1>
                <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                  {watch('formTitle')}
                </p>
              </div>

              {/* SECTION I */}
              <div className="border border-slate-400">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[#182848] border-b border-slate-400">
                  I. Pre-Determined Corner Description
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-slate-300">
                  <div>
                    <label className="block font-bold text-slate-700">Corner No.:</label>
                    <input type="text" {...register('cornerNo', { required: true })} className="w-full border border-slate-300 p-1 rounded" placeholder="Corner 5" />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block font-bold text-slate-700">Map Code/No.:</label>
                    <input type="text" {...register('mapCodeNo')} className="w-full border border-slate-300 p-1 rounded" placeholder="Map Code" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Proposed Classification:</label>
                    <select {...register('proposedClassification')} className="w-full border border-slate-300 p-1 rounded bg-white">
                      <option value="Alienable & Disposable">Alienable & Disposable</option>
                      <option value="Forestland">Forestland</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50">
                  <div>
                    <label className="block font-bold text-slate-700">Sitio/Purok:</label>
                    <input type="text" {...register('sitio')} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="Sitio" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Barangay:</label>
                    <input type="text" {...register('barangay', { required: true })} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="Barangay" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Municipality:</label>
                    <input type="text" {...register('municipality', { required: true })} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="Municipality" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Province:</label>
                    <input type="text" {...register('province', { required: true })} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="Province" />
                  </div>
                </div>
              </div>

              {/* LC MAP APPROVAL */}
              <div className="border border-slate-400">
                <div className="bg-slate-100 px-3 py-1 font-bold text-[11px] text-slate-700 border-b border-slate-300">
                  TO BE FILLED OUT UPON THE APPROVAL OF THE PROPOSED LC MAP
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2">
                  <div>
                    <label className="block font-semibold text-[10px]">Corner No.:</label>
                    <input type="text" {...register('lcCornerNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-[10px]">Map No.:</label>
                    <input type="text" {...register('lcMapNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-[10px]">ARC Prog. No.:</label>
                    <input type="text" {...register('lcArcProgNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-[10px]">St. No.:</label>
                    <input type="text" {...register('lcStNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-[10px]">St. Prog. No.:</label>
                    <input type="text" {...register('lcStProgNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-semibold text-[10px]">Id. No.:</label>
                    <input type="text" {...register('lcIdNo')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                </div>
              </div>

              {/* SECTION II */}
              <div className="border border-slate-400">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[#182848] border-b border-slate-400">
                  II. Record of GNSS Coordinates & Instruments
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 border-b border-slate-300">
                  <div>
                    <label className="block font-bold text-slate-700">Observation Date:</label>
                    <input type="date" {...register('observationDate', { required: true })} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Time Started:</label>
                    <input type="time" {...register('timeStarted')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Time Ended:</label>
                    <input type="time" {...register('timeEnded')} className="w-full border border-slate-300 p-1 rounded" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Duration:</label>
                    <input type="text" {...register('duration')} className="w-full border border-slate-300 p-1 rounded" placeholder="e.g. 15 mins" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border-b border-slate-300 bg-slate-50">
                  <div>
                    <label className="block font-bold text-slate-700">Instrument Type:</label>
                    <select {...register('instrumentType')} className="w-full border border-slate-300 p-1 rounded bg-white">
                      <option value="Handheld Unit">Handheld Unit</option>
                      <option value="Survey Grade Unit">Survey Grade Unit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Brand / Model:</label>
                    <input type="text" {...register('brandModel')} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="e.g. Montana 700" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Method:</label>
                    <input type="text" {...register('method')} className="w-full border border-slate-300 p-1 rounded bg-white" placeholder="Method" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 border-b border-slate-300">
                  <div>
                    <label className="block font-bold text-slate-700">Northing:</label>
                    <input type="text" {...register('northing')} className="w-full border border-slate-300 p-1 rounded" placeholder="Northing" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Easting:</label>
                    <input type="text" {...register('easting')} className="w-full border border-slate-300 p-1 rounded" placeholder="Easting" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Datum:</label>
                    <input type="text" {...register('datum')} className="w-full border border-slate-300 p-1 rounded" placeholder="WGS 84" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">GNSS Accuracy:</label>
                    <input type="text" {...register('gnssAccuracy')} className="w-full border border-slate-300 p-1 rounded" placeholder="Accuracy" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50">
                  <div>
                    <label className="block font-bold text-slate-700">Base Station Name:</label>
                    <input type="text" {...register('baseStationName')} className="w-full border border-slate-300 p-1 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Antenna Height:</label>
                    <input type="text" {...register('antennaHeight')} className="w-full border border-slate-300 p-1 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">GNSS Civ No.:</label>
                    <input type="text" {...register('gnssCivNo')} className="w-full border border-slate-300 p-1 rounded bg-white" />
                  </div>
                </div>
              </div>

              {/* SECTION III */}
              <div className="border border-slate-400">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[#182848] border-b border-slate-400">
                  III. Other Relevant Information
                </div>
                <div className="p-3 border-b border-slate-300">
                  <label className="block font-bold text-slate-700 mb-1">Description / General Observation of Corner & Immediate Surroundings:</label>
                  <textarea rows={2} {...register('generalObservation')} className="w-full border border-slate-300 p-1.5 rounded" placeholder="e.g. Foot of hill, roadside..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50">
                  <div>
                    <label className="block font-bold text-slate-700">Existing Tenure / Instruments:</label>
                    <input type="text" {...register('existingTenure')} className="w-full border border-slate-300 p-1.5 rounded bg-white" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">Issues and Conflicts:</label>
                    <input type="text" {...register('issuesAndConflicts')} className="w-full border border-slate-300 p-1.5 rounded bg-white" />
                  </div>
                </div>
              </div>

              {/* SECTION IV */}
              <div className="border border-slate-400">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[#182848] border-b border-slate-400">
                  IV. Characteristics
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-400">
                  <div className="p-3 space-y-3">
                    <h3 className="font-black text-slate-800 underline">PROPOSED A & D LAND</h3>
                    <div>
                      <label className="block font-bold text-slate-700">1. Tree Species Found:</label>
                      <input type="text" {...register('treeSpeciesAd')} className="w-full border border-slate-300 p-1 rounded mt-1" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700">2. Stand of Timber:</label>
                      <select {...register('timberAd')} className="w-full border border-slate-300 p-1 rounded mt-1 bg-white">
                        <option value="with">With Commercial Timber</option>
                        <option value="w/o">W/O Commercial Timber</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 bg-slate-50">
                    <h3 className="font-black text-slate-800 underline">PROPOSED FORESTLAND</h3>
                    <div>
                      <label className="block font-bold text-slate-700">1. Tree Species Found:</label>
                      <input type="text" {...register('treeSpeciesForest')} className="w-full border border-slate-300 p-1 rounded mt-1 bg-white" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700">2. Stand of Timber:</label>
                      <select {...register('timberForest')} className="w-full border border-slate-300 p-1 rounded mt-1 bg-white">
                        <option value="with">With Commercial Timber</option>
                        <option value="w/o">W/O Commercial Timber</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border-t border-slate-400 bg-white">
                  <div>
                    <label className="block font-bold text-slate-700">B. Topography / Slope:</label>
                    <input type="text" {...register('topographySlope')} className="w-full border border-slate-300 p-1 rounded mt-1" placeholder="e.g. Steep 18%" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">C. Existing Land-Use:</label>
                    <input type="text" {...register('existingLandUse')} className="w-full border border-slate-300 p-1 rounded mt-1" placeholder="e.g. Fruit Trees / Brushland" />
                  </div>
                </div>
              </div>

              {/* SECTION V */}
              <div className="border border-slate-400">
                <div className="bg-slate-200 px-3 py-1 font-bold uppercase text-[#182848] border-b border-slate-400">
                  V. Claimants & Personnel Signatures
                </div>
                
                <div className="p-3 border-b border-slate-300">
                  <label className="block font-bold text-slate-700 mb-1">NAME OF CLAIMANTS:</label>
                  <input type="text" {...register('claimants')} className="w-full border border-slate-300 p-1.5 rounded" placeholder="Claimant names if any" />
                </div>

                <div className="p-3 border-b border-slate-300 bg-slate-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#182848] uppercase text-[10px] sm:text-xs">Representatives from DENR Regional Office / PENRO / CENRO / LGU / Other Offices</span>
                    <button type="button" onClick={() => appendDenr({ name: '', office: '', designation: '', date: '' })} className="px-2 py-1 bg-[#009688] text-white font-bold rounded text-[10px]">
                      + Add Representative
                    </button>
                  </div>
                  {denrFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2 items-end bg-white p-2 rounded border border-slate-300">
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold">Name</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.name` as const)} className="w-full border p-1 rounded" placeholder="Full Name" />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[9px] font-bold">Office</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.office` as const)} className="w-full border p-1 rounded" placeholder="Office" />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[9px] font-bold">Designation</label>
                        <input type="text" {...register(`denrRepresentatives.${index}.designation` as const)} className="w-full border p-1 rounded" placeholder="Designation" />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-1">
                        <div className="flex-1">
                          <label className="text-[9px] font-bold">Date</label>
                          <input type="date" {...register(`denrRepresentatives.${index}.date` as const)} className="w-full border p-1 rounded" />
                        </div>
                        {denrFields.length > 1 && (
                          <button type="button" onClick={() => removeDenr(index)} className="text-red-600 font-bold px-1 mt-3">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#182848] uppercase">NAMRIA Survey Team</span>
                    <button type="button" onClick={() => appendTeam({ name: '', designation: 'FST Member', date: '' })} className="px-2 py-1 bg-[#009688] text-white font-bold rounded text-[10px]">
                      + Add Team Member
                    </button>
                  </div>
                  {teamFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2 items-end bg-slate-50 p-2 rounded border border-slate-300">
                      <div className="sm:col-span-6">
                        <label className="text-[9px] font-bold">Name</label>
                        <input type="text" {...register(`namriaSurveyTeam.${index}.name` as const, { required: true })} className="w-full border p-1 rounded bg-white" placeholder="Full Name" />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold">Designation</label>
                        <input type="text" {...register(`namriaSurveyTeam.${index}.designation` as const, { required: true })} className="w-full border p-1 rounded bg-white" placeholder="FST Leader / Member" />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-1">
                        <div className="flex-1">
                          <label className="text-[9px] font-bold">Date</label>
                          <input type="date" {...register(`namriaSurveyTeam.${index}.date` as const)} className="w-full border p-1 rounded bg-white" />
                        </div>
                        {teamFields.length > 1 && (
                          <button type="button" onClick={() => removeTeam(index)} className="text-red-600 font-bold px-1 mt-3">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView('dashboard')}
                  className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#182848] hover:bg-[#111c33] text-white font-bold rounded shadow-lg border-b-4 border-[#009688]"
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