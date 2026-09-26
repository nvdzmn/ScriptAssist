const option = (id, label, dosage, frequency, quantity) => ({ id, label, dosage, frequency, quantity });

const plansByMedication = {
  stelazio: [option('starter', 'Starter schedule (demo)', '45 mg / 0.5 mL Subcutaneous', 'Week 0, then week 4', '2 syringes'), option('maintenance', 'Maintenance schedule (demo)', '45 mg / 0.5 mL Subcutaneous', 'Every 12 weeks', '1 syringe')],
  skyrizi: [option('starter', 'Starter schedule (demo)', '150 mg / mL Subcutaneous', 'Week 0, then week 4', '2 pens'), option('maintenance', 'Maintenance schedule (demo)', '150 mg / mL Subcutaneous', 'Every 12 weeks', '1 pen')],
  dupixent: [option('starter', 'Starter schedule (demo)', '600 mg Subcutaneous', 'Once at initiation', '2 pens'), option('maintenance', 'Maintenance schedule (demo)', '300 mg / 2 mL Subcutaneous', 'Every 2 weeks', '2 pens')],
  humira: [option('starter', 'Starter schedule (demo)', 'Diagnosis-specific starter dose', 'Per verified diagnosis-specific plan', 'Starter pack'), option('maintenance', 'Maintenance schedule (demo)', '40 mg / 0.4 mL Subcutaneous', 'Every other week', '2 pens')],
  cosentyx: [option('starter', 'Starter schedule (demo)', '300 mg Subcutaneous', 'Weekly for 5 doses', '5 pens'), option('maintenance', 'Maintenance schedule (demo)', '300 mg Subcutaneous', 'Every 4 weeks', '2 pens')],
  rinvoq: [option('standard', 'Standard schedule (demo)', '15 mg orally', 'Once daily', '30 tablets'), option('custom', 'Custom clinician plan', '15 mg orally', 'Once daily', '30 tablets')],
  entyvio: [option('standard', 'Maintenance schedule (demo)', '108 mg / 0.68 mL Subcutaneous', 'Every 2 weeks', '2 pens'), option('custom', 'Custom clinician plan', '108 mg / 0.68 mL Subcutaneous', 'Every 2 weeks', '2 pens')],
  hydrocortisone: [option('short-course', 'Short course (demo)', 'Apply thin layer', 'Twice daily for up to 14 days', '30 g'), option('custom', 'Custom clinician plan', 'Apply thin layer', 'Twice daily', '30 g')],
  adbry: [option('starter', 'Starter schedule (demo)', '600 mg Subcutaneous', 'Once at initiation', '4 syringes'), option('maintenance', 'Maintenance schedule (demo)', '300 mg Subcutaneous', 'Every 2 weeks', '4 syringes')],
  taltz: [option('starter', 'Starter schedule (demo)', '160 mg Subcutaneous', 'Once at initiation', '2 autoinjectors'), option('maintenance', 'Maintenance schedule (demo)', 'Diagnosis-specific maintenance dose', 'Per verified diagnosis-specific plan', '1 to 4 autoinjectors')],
  tremfya: [option('starter', 'Starter schedule (demo)', '100 mg Subcutaneous', 'Weeks 0 and 4', '2 pens'), option('maintenance', 'Maintenance schedule (demo)', '100 mg Subcutaneous', 'Every 8 weeks', '1 pen')],
  otezla: [option('titration', 'Titration schedule (demo)', 'Dose pack', 'Titrate over 5 days', 'Starter pack'), option('maintenance', 'Maintenance schedule (demo)', '30 mg orally', 'Twice daily', '60 tablets')],
  methotrexate: [option('starting', 'Starting schedule (demo)', '10 mg orally', 'Once weekly', '16 tablets'), option('standard', 'Standard schedule (demo)', '15 mg orally', 'Once weekly', '24 tablets')],
  sulfasalazine: [option('starting', 'Starting schedule (demo)', '500 mg orally', 'Once daily; titrate per plan', '60 tablets'), option('standard', 'Standard schedule (demo)', '500 mg orally', 'Twice daily; titrate per plan', '120 tablets')],
  tacrolimus: [option('standard', 'Standard schedule (demo)', 'Apply thin layer', 'Twice daily', '60 g'), option('custom', 'Custom clinician plan', 'Apply thin layer', 'Twice daily', '60 g')]
};

export function dosingOptionsFor(drug) {
  return plansByMedication[drug?.id] || [option('standard', 'Standard schedule (demo)', drug?.defaultDose || '', drug?.frequency || '', drug?.quantity || '')];
}
