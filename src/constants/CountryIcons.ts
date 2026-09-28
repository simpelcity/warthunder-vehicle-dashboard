export function getCountryIcons(vehicle: { nation: string, operator?: string }) {
  const fileName = vehicle?.operator ? vehicle.operator : vehicle.nation ?? vehicle.nation ?? "usa";
  if (vehicle.operator === "serbia") return `lang_${fileName}`;
  if (vehicle.operator === "republic_china") return `flag_${fileName}`
  else return `country_${fileName}`;
}