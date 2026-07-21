// Banco de dados simulado para o Showcase da Tabela Catppuccin

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  salary: number;
  joinedDate: string;
}

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Data Scientist",
  "QA Specialist",
  "HR Manager",
  "Sales Executive",
  "Marketing Coordinator",
  "Financial Analyst"
];

const DEPARTMENTS: Record<string, string> = {
  "Software Engineer": "Engineering",
  "Product Manager": "Product",
  "UX Designer": "Design",
  "DevOps Engineer": "Engineering",
  "Data Scientist": "Analytics",
  "QA Specialist": "Engineering",
  "HR Manager": "Operations",
  "Sales Executive": "Sales",
  "Marketing Coordinator": "Marketing",
  "Financial Analyst": "Finance"
};

const STATUSES: ('Active' | 'Inactive' | 'Pending')[] = ["Active", "Inactive", "Pending"];

const FIRST_NAMES = [
  "Gabriel", "Lucas", "Mateus", "Pedro", "João", "Guilherme", "Enzo", "Felipe", "Gustavo", "Vinícius",
  "Rodrigo", "Bruno", "Daniel", "Thiago", "Diego", "Leonardo", "Arthur", "Rafael", "André", "Carlos",
  "Júlia", "Sophia", "Isabella", "Maria", "Alice", "Manuela", "Laura", "Luiza", "Valentina", "Giovanna",
  "Beatriz", "Helena", "Carolina", "Mariana", "Gabriela", "Amanda", "Larissa", "Fernanda", "Letícia", "Camila"
];

const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
  "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Dias", "Barbosa", "Vieira",
  "Machado", "Teixeira", "Moreira", "Cardoso", "Nunes", "Rocha", "Assis", "Mendes", "Freitas", "Neves"
];

function generateInitialData(): Employee[] {
  const data: Employee[] = [];
  const totalRecords = 75; // ~75 registros para demonstração rápida e paginação
  
  const startDate = new Date("2023-01-01").getTime();
  const endDate = new Date("2026-06-01").getTime();
  
  for (let i = 1; i <= totalRecords; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    
    const emailBase = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".");
    const email = `${emailBase}${Math.floor(Math.random() * 90) + 10}@empresa.com`;
    
    const role = ROLES[Math.floor(Math.random() * ROLES.length)];
    const department = DEPARTMENTS[role] || "Operations";
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    
    let baseSalary = 4000;
    if (role.includes("Manager") || role.includes("Executive")) baseSalary = 9000;
    else if (role.includes("Engineer") || role.includes("Scientist")) baseSalary = 7500;
    else if (role.includes("Designer")) baseSalary = 6000;
    
    const salary = baseSalary + Math.floor(Math.random() * 4000) - 1500;
    
    const randomTime = startDate + Math.random() * (endDate - startDate);
    const joinedDate = new Date(randomTime).toISOString().split("T")[0];
    
    data.push({
      id: `EMP-${1000 + i}`,
      name,
      email,
      role,
      department,
      status,
      salary,
      joinedDate
    });
  }
  
  return data;
}

// Banco de dados em memória persistente na sessão do app
let _database = generateInitialData();

function normalizeString(str: string): string {
  return str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

export interface FetchParams {
  search?: string;
  status?: string;
  role?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc' | '';
  page?: number;
  limit?: number;
  latency?: number;
}

export interface ApiResponse {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta: {
    url: string;
    latency: number;
    timestamp: string;
  };
}

/**
 * Simula requisições do servidor
 */
export function fetchDataFromServer(params: FetchParams = {}): Promise<ApiResponse> {
  return new Promise((resolve) => {
    const search = params.search || "";
    const status = params.status || "";
    const role = params.role || "";
    const sortField = params.sortField || "";
    const sortOrder = params.sortOrder || "";
    const page = params.page || 1;
    const limit = params.limit || 10;
    const latency = params.latency !== undefined ? params.latency : 600;
    
    const startTime = performance.now();
    
    // Gerar URL simulada
    const queryParts = [];
    if (search) queryParts.push(`search=${encodeURIComponent(search)}`);
    if (status) queryParts.push(`status=${status}`);
    if (role) queryParts.push(`role=${encodeURIComponent(role)}`);
    if (sortField) queryParts.push(`sort=${sortField}&order=${sortOrder}`);
    queryParts.push(`page=${page}`);
    queryParts.push(`limit=${limit}`);
    
    const simulatedUrl = `/api/employees?${queryParts.join("&")}`;
    
    // 1. Filtragem
    let filteredData = [..._database];
    
    if (search) {
      const normalizedSearch = normalizeString(search);
      filteredData = filteredData.filter(item => 
        normalizeString(item.name).includes(normalizedSearch) ||
        normalizeString(item.email).includes(normalizedSearch) ||
        normalizeString(item.role).includes(normalizedSearch) ||
        normalizeString(item.department).includes(normalizedSearch) ||
        item.id.toLowerCase().includes(normalizedSearch)
      );
    }
    
    if (status && status !== "All") {
      filteredData = filteredData.filter(item => item.status === status);
    }
    
    if (role && role !== "All") {
      filteredData = filteredData.filter(item => item.role === role);
    }
    
    // 2. Ordenação
    if (sortField && sortOrder) {
      filteredData.sort((a: any, b: any) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (typeof valA === "string") {
          valA = normalizeString(valA);
          valB = normalizeString(valB);
        }
        
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    const total = filteredData.length;
    
    // 3. Paginação
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit) || 1;
    
    setTimeout(() => {
      const elapsedMs = Math.round(performance.now() - startTime + latency);
      
      resolve({
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages
        },
        meta: {
          url: simulatedUrl,
          latency: elapsedMs,
          timestamp: new Date().toLocaleTimeString()
        }
      });
    }, latency);
  });
}

/**
 * Adiciona um funcionário
 */
export function addEmployee(employeeData: Omit<Employee, "id" | "department">): Promise<Employee> {
  return new Promise((resolve) => {
    const nextIdNum = Math.max(..._database.map(item => Number(item.id.replace("EMP-", "")))) + 1;
    const newId = `EMP-${nextIdNum}`;
    
    const newRecord: Employee = {
      id: newId,
      name: employeeData.name,
      email: employeeData.email,
      role: employeeData.role,
      department: DEPARTMENTS[employeeData.role] || "Operations",
      status: employeeData.status,
      salary: Number(employeeData.salary) || 3000,
      joinedDate: employeeData.joinedDate || new Date().toISOString().split("T")[0]
    };
    
    _database.unshift(newRecord);
    
    setTimeout(() => {
      resolve(newRecord);
    }, 200);
  });
}

/**
 * Atualiza um funcionário
 */
export function updateEmployee(id: string, updatedFields: Partial<Employee>): Promise<Employee> {
  return new Promise((resolve, reject) => {
    const index = _database.findIndex(item => item.id === id);
    if (index === -1) {
      return reject(new Error("Funcionário não encontrado"));
    }
    
    if (updatedFields.role) {
      updatedFields.department = DEPARTMENTS[updatedFields.role] || "Operations";
    }
    
    _database[index] = {
      ..._database[index],
      ...updatedFields
    } as Employee;
    
    setTimeout(() => {
      resolve(_database[index]);
    }, 150);
  });
}

/**
 * Exclui um funcionário
 */
export function deleteEmployee(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    _database = _database.filter(item => item.id !== id);
    setTimeout(() => {
      resolve(true);
    }, 150);
  });
}

/**
 * Exclui vários funcionários
 */
export function deleteMultipleEmployees(ids: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    _database = _database.filter(item => !ids.includes(item.id));
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
}

/**
 * Retorna todos os dados locais
 */
export function getFullLocalDatabase(): Employee[] {
  return [..._database];
}

/**
 * Retorna cargos e status únicos
 */
export function getFilterMetadata() {
  return {
    roles: ROLES,
    statuses: STATUSES
  };
}
