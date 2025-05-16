import { EmployeeRepositoryImpl } from '../../../infrastructure/repositories/EmployeeRepositoryImpl';
import { GetAllEmployees } from './GetAllEmployees';

export class GetAllEmployeesFactory {
  static create() {
    const repository = new EmployeeRepositoryImpl();
    const useCase = new GetAllEmployees(repository);
    
    return { useCase };
  }
} 