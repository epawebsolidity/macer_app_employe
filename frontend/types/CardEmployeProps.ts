import { Employee } from "./Employe";
export interface CardEmployeProps {
  employee: Employee;
  onSendReward?: (id: number) => void; // handler opsional
}
