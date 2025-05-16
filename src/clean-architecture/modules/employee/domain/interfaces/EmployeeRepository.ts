import { Employee } from '../entities/Employee';

export interface EmployeeRepository {
  findById(id: string): Promise<Employee | null>;
  findAll(): Promise<Employee[]>;
  findByDepartment(department: string): Promise<Employee[]>;
  save(employee: Employee): Promise<void>;
  update(employee: Employee): Promise<void>;
  delete(id: string): Promise<void>;
  getPerformanceStats(): Promise<{
    averageScore: number;
    departmentAverages: { [key: string]: number };
    topPerformers: Employee[];
  }>;
} 