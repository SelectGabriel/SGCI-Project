export function getTypeMap() {
  return {
    Aluno: 'Student',
    Pesquisador: 'Teacher',
    Funcionário: 'Employee',
  };
}

export function getTypeLabel(typeValue: string): string {
  const map: { [key: string]: string } = {
    Student: 'Aluno',
    Teacher: 'Pesquisador',
    Employee: 'Funcionário',
  };
  return map[typeValue] || typeValue;
}
