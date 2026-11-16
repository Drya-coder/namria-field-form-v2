'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import SketchPad from '@/components/SketchPad';
import { type FieldObservation } from '@/db/db';

export default function MainContent() {
  const { register, control, watch, setValue } = useFormContext<FieldObservation>();

  const { fields: denrFields, append: appendDenr, remove: removeDenr } = useFieldArray({
    control,
    name: 'denrRepresentatives',
  });

  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
    control,
    name: 'namriaSurveyTeam',
  });

  const handleImageUpload = (field: keyof FieldObservation, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setValue(field, uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* PAGE 2: SKETCH MAP & PHOTOGRAPHS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-6 shadow-sm">
        <div className="border-b pb-2 flex justify-between items-center">
          <h3 className="font-bold uppercase text-[#182848] text-xs tracking-wider">
            Page 2: Sketch Map & Photo Documentation
          </h3>
          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">Official Form Page 2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TOP-LEFT: SKETCH MAP WITH SKETCHPAD */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-bold text-xs uppercase text-slate-700">1. SKETCH MAP</label>
              <span className="text-[10px] text-slate-500 font-mono">[North Arrow Fixed]</span>
            </div>
            <p className="text-[11px] text-slate-500">Maaaring iguhit nang direkta gamit ang pen, mouse, o kamay, o kaya ay mag-upload ng larawan.</p>
            
            <SketchPad 
              initialDataUrl={watch('sketchMapDataUrl')}
              onSave={(dataUrl) => setValue('sketchMapDataUrl', dataUrl)} 
            />

            <div className="mt-2">
              <label className="block text-[10px] font-semibold text-slate-700 mb-1">O mag-upload ng Sketch Map image file:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload('sketchMapDataUrl', e)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-teal-700 cursor-pointer"
              />
            </div>
          </div>

          {/* TOP-RIGHT: PICTURE OF CONCRETE MONUMENT */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
            <label className="font-bold text-xs uppercase text-slate-700 block">2. Picture of Concrete Monument</label>
            <p className="text-[11px] text-slate-500">Kunan o i-upload ang larawan ng monolitong kongkreto / corner marker.</p>
            
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload('monumentPhotoDataUrl', e)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-teal-700 cursor-pointer"
            />

            {watch('monumentPhotoDataUrl') && (
              <div className="mt-2 border rounded-lg overflow-hidden bg-white h-48">
                <img src={watch('monumentPhotoDataUrl')} alt="Monument Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* MIDDLE: PICTURE FACING PROPOSED A&D LAND */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
            <label className="font-bold text-xs uppercase text-slate-700 block">3. Picture Facing Proposed A&D Land</label>
            <p className="text-[11px] text-slate-500">I-upload ang kuha patungo sa Proposed Alienable & Disposable land.</p>
            
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload('adLandPhotoDataUrl', e)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-teal-700 cursor-pointer"
            />

            {watch('adLandPhotoDataUrl') && (
              <div className="mt-2 border rounded-lg overflow-hidden bg-white h-48">
                <img src={watch('adLandPhotoDataUrl')} alt="A&D Land Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* BOTTOM: PICTURE FACING PROPOSED FORESTLAND */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
            <label className="font-bold text-xs uppercase text-slate-700 block">4. Picture Facing Proposed Forestland</label>
            <p className="text-[11px] text-slate-500">I-upload ang kuha patungo sa Proposed Forestland.</p>
            
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload('forestlandPhotoDataUrl', e)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-teal-700 cursor-pointer"
            />

            {watch('forestlandPhotoDataUrl') && (
              <div className="mt-2 border rounded-lg overflow-hidden bg-white h-48">
                <img src={watch('forestlandPhotoDataUrl')} alt="Forestland Preview" className="w-full h-full object-contain" />
              </div>
            )}
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

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 uppercase text-[11px]">DENR Representatives</span>
            <button type="button" onClick={() => appendDenr({ name: '', office: '', designation: '', date: '' })} className="px-3 py-1.5 bg-[#009688] hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition cursor-pointer">
              + Add Representative
            </button>
          </div>
          {denrFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-slate-600">Name</label>
                <input type="text" {...register(`denrRepresentatives.${index}.name` as const)} className="w-full border p-2 rounded-lg bg-white outline-none" placeholder="Full Name" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-600">Office</label>
                <input type="text" {...register(`denrRepresentatives.${index}.office` as const)} className="w-full border p-2 rounded-lg bg-white outline-none" placeholder="Office" />
              </div>
              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-slate-600">Designation</label>
                <input type="text" {...register(`denrRepresentatives.${index}.designation` as const)} className="w-full border p-2 rounded-lg bg-white outline-none" placeholder="Designation" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-600">Date</label>
                  <input type="date" {...register(`denrRepresentatives.${index}.date` as const)} className="w-full border p-2 rounded-lg bg-white outline-none text-[11px]" />
                </div>
                {denrFields.length > 1 && (
                  <button type="button" onClick={() => removeDenr(index)} className="text-red-600 font-bold p-2 mt-4 hover:bg-red-50 rounded-lg cursor-pointer">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 uppercase text-[11px]">NAMRIA Survey Team</span>
            <button type="button" onClick={() => appendTeam({ name: '', designation: 'FST Member', date: '' })} className="px-3 py-1.5 bg-[#009688] hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition cursor-pointer">
              + Add Team Member
            </button>
          </div>
          {teamFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-slate-600">Name</label>
                <input type="text" {...register(`namriaSurveyTeam.${index}.name` as const, { required: true })} className="w-full border p-2 rounded-lg bg-white outline-none" placeholder="Full Name" />
              </div>
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-slate-600">Designation</label>
                <input type="text" {...register(`namriaSurveyTeam.${index}.designation` as const, { required: true })} className="w-full border p-2 rounded-lg bg-white outline-none" placeholder="FST Leader / Member" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-600">Date</label>
                  <input type="date" {...register(`namriaSurveyTeam.${index}.date` as const)} className="w-full border p-2 rounded-lg bg-white outline-none text-[11px]" />
                </div>
                {teamFields.length > 1 && (
                  <button type="button" onClick={() => removeTeam(index)} className="text-red-600 font-bold p-2 mt-4 hover:bg-red-50 rounded-lg cursor-pointer">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}