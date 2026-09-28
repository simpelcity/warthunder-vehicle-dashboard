import type { Countries } from '@/types/Countries'

export function getOperatorStrings(operator: Countries) {
  if (operator === "Canada (modern)") return "Canada"
  if (operator === "Hungary (old)") return "Hungary"
  if (operator === "South Africa (modern)") return "South Africa"
  else return operator
}