-- ============================================================
-- SISTEMA DE RH - SCRIPT COMPLETO DE BANCO DE DADOS
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS rh_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE rh_system;

-- ============================================================
-- 1. COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. EMPLOYEES (criada antes de users para FK de employee_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  responsible BIGINT UNSIGNED NULL,
  description TEXT NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_departments_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS positions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_positions_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS employees (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  rg VARCHAR(20) NULL,
  birth_date DATE NULL,
  gender ENUM('masculino', 'feminino', 'outro') NULL,
  marital_status VARCHAR(30) NULL,
  email VARCHAR(255) NULL UNIQUE,
  phone VARCHAR(20) NULL,
  address TEXT NULL,
  zip_code VARCHAR(10) NULL,
  city VARCHAR(255) NULL,
  state VARCHAR(2) NULL,
  neighborhood VARCHAR(255) NULL,
  street VARCHAR(255) NULL,
  number VARCHAR(10) NULL,
  complement VARCHAR(255) NULL,
  position_id BIGINT UNSIGNED NULL,
  department_id BIGINT UNSIGNED NULL,
  company_id BIGINT UNSIGNED NULL,
  salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  hire_date DATE NULL,
  status ENUM('ativo', 'afastado', 'ferias', 'desligado') NOT NULL DEFAULT 'ativo',
  photo VARCHAR(255) NULL,
  notes TEXT NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employees_cpf_email (cpf, email),
  INDEX idx_employees_department (department_id),
  INDEX idx_employees_position (position_id),
  INDEX idx_employees_status (status),
  INDEX idx_employees_company (company_id),
  CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_employees_position FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
  CONSTRAINT fk_employees_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('administrador', 'rh', 'gestor', 'funcionario') NOT NULL DEFAULT 'funcionario',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  company_id BIGINT UNSIGNED NULL,
  employee_id BIGINT UNSIGNED NULL,
  remember_token VARCHAR(100) NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_company (company_id),
  INDEX idx_users_employee (employee_id),
  INDEX idx_users_role (role),
  CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_users_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add FK departments.responsible -> users.id (agora que users existe)
ALTER TABLE departments
  ADD CONSTRAINT fk_departments_responsible FOREIGN KEY (responsible) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================
-- 4. PAYROLLS
-- ============================================================
CREATE TABLE IF NOT EXISTS payrolls (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  reference_month INT NOT NULL,
  reference_year INT NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  benefits_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  discounts_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  inss DECIMAL(12,2) NOT NULL DEFAULT 0,
  fgts DECIMAL(12,2) NOT NULL DEFAULT 0,
  irrf DECIMAL(12,2) NOT NULL DEFAULT 0,
  transportation_vouchers DECIMAL(12,2) NOT NULL DEFAULT 0,
  meal_vouchers DECIMAL(12,2) NOT NULL DEFAULT 0,
  net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('pendente', 'processado', 'pago', 'cancelado') NOT NULL DEFAULT 'pendente',
  payment_date DATE NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payrolls_employee (employee_id),
  INDEX idx_payrolls_month_year (reference_month, reference_year),
  INDEX idx_payrolls_company (company_id),
  INDEX idx_payrolls_status (status),
  CONSTRAINT fk_payrolls_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_payrolls_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. VACATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS vacations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT NOT NULL,
  period VARCHAR(50) NULL,
  status ENUM('solicitada', 'aprovada', 'rejeitada', 'cancelada') NOT NULL DEFAULT 'solicitada',
  approved_by BIGINT UNSIGNED NULL,
  approved_at TIMESTAMP NULL,
  notes TEXT NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vacations_employee (employee_id),
  INDEX idx_vacations_status (status),
  INDEX idx_vacations_company (company_id),
  CONSTRAINT fk_vacations_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_vacations_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_vacations_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. TIME RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS time_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  record_date DATE NOT NULL,
  entry_time TIME NULL,
  exit_time TIME NULL,
  lunch_start TIME NULL,
  lunch_end TIME NULL,
  overtime DECIMAL(5,2) NOT NULL DEFAULT 0,
  bank_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_employee_date (employee_id, record_date),
  INDEX idx_time_records_date (record_date),
  INDEX idx_time_records_company (company_id),
  CONSTRAINT fk_time_records_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_time_records_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. BENEFITS
-- ============================================================
CREATE TABLE IF NOT EXISTS benefits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  type VARCHAR(50) NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_benefits_company (company_id),
  CONSTRAINT fk_benefits_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. EMPLOYEE BENEFIT (PIVOT)
-- ============================================================
CREATE TABLE IF NOT EXISTS employee_benefit (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  benefit_id BIGINT UNSIGNED NOT NULL,
  granted_date DATE NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_employee_benefit (employee_id, benefit_id),
  CONSTRAINT fk_eb_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_eb_benefit FOREIGN KEY (benefit_id) REFERENCES benefits(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. RECRUITMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS recruitments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  position VARCHAR(255) NOT NULL,
  description TEXT NULL,
  requirements TEXT NULL,
  salary_range VARCHAR(100) NULL,
  status ENUM('aberto', 'em_andamento', 'fechado', 'cancelado') NOT NULL DEFAULT 'aberto',
  open_date DATE NULL,
  close_date DATE NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_recruitments_status (status),
  INDEX idx_recruitments_company (company_id),
  CONSTRAINT fk_recruitments_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. CANDIDATES
-- ============================================================
CREATE TABLE IF NOT EXISTS candidates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recruitment_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  resume TEXT NULL,
  status ENUM('recebido', 'em_analise', 'entrevistado', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'recebido',
  interview_date TIMESTAMP NULL,
  interview_notes TEXT NULL,
  observations TEXT NULL,
  company_id BIGINT UNSIGNED NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_candidates_recruitment (recruitment_id),
  INDEX idx_candidates_status (status),
  INDEX idx_candidates_company (company_id),
  CONSTRAINT fk_candidates_recruitment FOREIGN KEY (recruitment_id) REFERENCES recruitments(id) ON DELETE CASCADE,
  CONSTRAINT fk_candidates_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(255) NOT NULL,
  model_type VARCHAR(255) NOT NULL,
  model_id BIGINT UNSIGNED NOT NULL,
  old_values JSON NULL,
  new_values JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_model (model_type, model_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_created (created_at),
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. PERSONAL ACCESS TOKENS (SANCTUM)
-- ============================================================
CREATE TABLE IF NOT EXISTS personal_access_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tokenable_type VARCHAR(255) NOT NULL,
  tokenable_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  abilities TEXT NULL,
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pat_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. PASSWORD RESET TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  notifiable_type VARCHAR(255) NOT NULL,
  notifiable_id BIGINT UNSIGNED NOT NULL,
  data JSON NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notifications_notifiable (notifiable_type, notifiable_id),
  INDEX idx_notifications_read (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. JOBS / FAILED JOBS / JOB BATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  queue VARCHAR(255) NOT NULL,
  payload LONGTEXT NOT NULL,
  attempts TINYINT UNSIGNED NOT NULL,
  reserved_at INT UNSIGNED NULL,
  available_at INT UNSIGNED NOT NULL,
  created_at INT UNSIGNED NOT NULL,
  INDEX idx_jobs_queue (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS failed_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(255) NOT NULL UNIQUE,
  connection TEXT NOT NULL,
  queue TEXT NOT NULL,
  payload LONGTEXT NOT NULL,
  exception LONGTEXT NOT NULL,
  failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_batches (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  total_jobs INT NOT NULL,
  pending_jobs INT NOT NULL,
  failed_jobs INT NOT NULL,
  failed_job_ids LONGTEXT NOT NULL,
  options MEDIUMTEXT NULL,
  cancelled_at INT NULL,
  created_at INT NOT NULL,
  finished_at INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ============================================================
-- SEEDS - DADOS INICIAIS
-- ============================================================
-- ============================================================

-- ---------------------------------------------------------
-- COMPANY
-- ---------------------------------------------------------
INSERT INTO companies (name, cnpj, is_active) VALUES
('Empresa Principal LTDA', '00.000.000/0001-91', 1);

-- ---------------------------------------------------------
-- DEPARTMENTS
-- ---------------------------------------------------------
INSERT INTO departments (name, description, company_id) VALUES
('Recursos Humanos', 'Departamento de Gestão de Pessoas', 1),
('Tecnologia da Informação', 'Departamento de TI e Sistemas', 1),
('Financeiro', 'Departamento Financeiro e Contábil', 1),
('Comercial', 'Departamento de Vendas e Comercial', 1),
('Operações', 'Departamento de Operações e Logística', 1);

-- ---------------------------------------------------------
-- POSITIONS
-- ---------------------------------------------------------
INSERT INTO positions (name, base_salary, description, company_id) VALUES
('Analista de RH', 4500.00, 'Analista de Recursos Humanos', 1),
('Desenvolvedor', 6000.00, 'Desenvolvedor de Software', 1),
('Analista Financeiro', 5000.00, 'Analista do Departamento Financeiro', 1),
('Vendedor', 2500.00, 'Vendedor Comercial', 1),
('Auxiliar Administrativo', 2000.00, 'Auxiliar Administrativo', 1),
('Gerente de TI', 10000.00, 'Gerente de Tecnologia da Informação', 1),
('Coordenador de RH', 7000.00, 'Coordenador de Recursos Humanos', 1),
('Assistente de DP', 3000.00, 'Assistente de Departamento Pessoal', 1);

-- ---------------------------------------------------------
-- EMPLOYEES
-- ---------------------------------------------------------
INSERT INTO employees (name, cpf, rg, birth_date, gender, marital_status, email, phone, salary, status, department_id, position_id, company_id, hire_date, address, city, state, zip_code) VALUES
('Ana Silva',            '529.982.247-25', '12.345.678-9', '1990-03-15', 'feminino', 'casado',   'ana.silva@empresa.com',          '(11) 99999-0001', 4500.00, 'ativo',    1, 1, 1, '2022-01-10', 'Rua Exemplo, 100', 'São Paulo', 'SP', '01000-000'),
('Carlos Santos',        '123.456.789-09', '98.765.432-1', '1988-07-22', 'masculino', 'solteiro', 'carlos.santos@empresa.com',      '(11) 99999-0002', 6000.00, 'ativo',    2, 2, 1, '2021-03-15', 'Rua Exemplo, 101', 'São Paulo', 'SP', '01000-000'),
('Mariana Oliveira',     '987.654.321-00', '11.222.333-4', '1992-11-08', 'feminino',  'casado',   'mariana.oliveira@empresa.com',   '(11) 99999-0003', 5000.00, 'ativo',    3, 3, 1, '2022-06-20', 'Rua Exemplo, 102', 'São Paulo', 'SP', '01000-000'),
('Pedro Costa',          '111.222.333-44', '55.666.777-8', '1995-02-14', 'masculino', 'solteiro', 'pedro.costa@empresa.com',       '(11) 99999-0004', 2500.00, 'ativo',    4, 4, 1, '2023-02-01', 'Rua Exemplo, 103', 'São Paulo', 'SP', '01000-000'),
('Juliana Lima',         '555.666.777-88', '99.888.777-6', '1998-09-30', 'feminino',  'solteiro', 'juliana.lima@empresa.com',      '(11) 99999-0005', 2000.00, 'ativo',    5, 5, 1, '2024-01-15', 'Rua Exemplo, 104', 'São Paulo', 'SP', '01000-000'),
('Roberto Almeida',      '444.555.666-77', '33.444.555-6', '1985-05-10', 'masculino', 'casado',   'roberto.almeida@empresa.com',    '(11) 99999-0006', 10000.00,'ativo',    2, 6, 1, '2020-08-01', 'Rua Exemplo, 105', 'São Paulo', 'SP', '01000-000'),
('Fernanda Souza',       '777.888.999-00', '77.888.999-0', '1991-12-25', 'feminino',  'casado',   'fernanda.souza@empresa.com',    '(11) 99999-0007', 7000.00, 'ativo',    1, 7, 1, '2021-11-10', 'Rua Exemplo, 106', 'São Paulo', 'SP', '01000-000'),
('Lucas Pereira',        '222.333.444-55', '44.555.666-7', '1996-04-18', 'masculino', 'solteiro', 'lucas.pereira@empresa.com',     '(11) 99999-0008', 3000.00, 'ativo',    1, 8, 1, '2023-05-20', 'Rua Exemplo, 107', 'São Paulo', 'SP', '01000-000'),
('Amanda Rodrigues',     '888.999.000-11', '66.777.888-9', '1993-08-05', 'feminino',  'divorciado','amanda.rodrigues@empresa.com',  '(11) 99999-0009', 4500.00, 'ativo',    3, 1, 1, '2022-09-01', 'Rua Exemplo, 108', 'São Paulo', 'SP', '01000-000'),
('Gabriel Martins',      '333.444.555-66', '22.333.444-5', '1987-01-20', 'masculino', 'casado',   'gabriel.martins@empresa.com',   '(11) 99999-0010', 6000.00, 'ativo',    2, 2, 1, '2021-06-15', 'Rua Exemplo, 109', 'São Paulo', 'SP', '01000-000'),
('Larissa Barbosa',      '666.777.888-99', '88.999.000-1', '1994-06-12', 'feminino',  'solteiro', 'larissa.barbosa@empresa.com',   '(11) 99999-0011', 5000.00, 'ativo',    4, 3, 1, '2022-04-10', 'Rua Exemplo, 110', 'São Paulo', 'SP', '01000-000'),
('Thiago Rocha',         '999.000.111-22', '11.222.333-4', '1990-10-28', 'masculino', 'casado',   'thiago.rocha@empresa.com',      '(11) 99999-0012', 2500.00, 'afastado', 5, 4, 1, '2021-12-01', 'Rua Exemplo, 111', 'São Paulo', 'SP', '01000-000'),
('Patrícia Dias',        '000.111.222-33', '55.666.777-8', '1997-03-08', 'feminino',  'solteiro', 'patricia.dias@empresa.com',     '(11) 99999-0013', 2000.00, 'ativo',    3, 5, 1, '2024-02-01', 'Rua Exemplo, 112', 'São Paulo', 'SP', '01000-000'),
('Felipe Nunes',         '111.222.333-55', '99.888.777-6', '1986-07-15', 'masculino', 'divorciado','felipe.nunes@empresa.com',     '(11) 99999-0014', 10000.00,'ativo',    2, 6, 1, '2020-01-10', 'Rua Exemplo, 113', 'São Paulo', 'SP', '01000-000'),
('Camila Freitas',       '222.333.444-66', '33.444.555-6', '1992-11-22', 'feminino',  'casado',   'camila.freitas@empresa.com',    '(11) 99999-0015', 7000.00, 'ferias',   1, 7, 1, '2021-07-20', 'Rua Exemplo, 114', 'São Paulo', 'SP', '01000-000'),
('Rafael Campos',        '333.444.555-77', '77.888.999-0', '1995-09-05', 'masculino', 'solteiro', 'rafael.campos@empresa.com',     '(11) 99999-0016', 3000.00, 'ativo',    4, 8, 1, '2023-08-15', 'Rua Exemplo, 115', 'São Paulo', 'SP', '01000-000'),
('Letícia Moreira',      '444.555.666-88', '44.555.666-7', '1989-12-30', 'feminino',  'casado',   'leticia.moreira@empresa.com',   '(11) 99999-0017', 4500.00, 'desligado',3, 1, 1, '2020-05-01', 'Rua Exemplo, 116', 'São Paulo', 'SP', '01000-000'),
('Diego Carvalho',       '555.666.777-99', '66.777.888-9', '1993-04-14', 'masculino', 'solteiro', 'diego.carvalho@empresa.com',    '(11) 99999-0018', 6000.00, 'ativo',    2, 2, 1, '2022-10-01', 'Rua Exemplo, 117', 'São Paulo', 'SP', '01000-000'),
('Vanessa Teixeira',     '666.777.888-00', '22.333.444-5', '1991-08-19', 'feminino',  'casado',   'vanessa.teixeira@empresa.com',  '(11) 99999-0019', 5000.00, 'ativo',    3, 3, 1, '2021-04-15', 'Rua Exemplo, 118', 'São Paulo', 'SP', '01000-000'),
('Bruno Araújo',         '777.888.999-11', '88.999.000-1', '1996-06-25', 'masculino', 'solteiro', 'bruno.araujo@empresa.com',     '(11) 99999-0020', 2500.00, 'ativo',    5, 4, 1, '2024-03-01', 'Rua Exemplo, 119', 'São Paulo', 'SP', '01000-000');

-- ---------------------------------------------------------
-- USERS (senha: 123456 - bcrypt hash)
-- ---------------------------------------------------------
INSERT INTO users (name, email, password, role, is_active, company_id) VALUES
('Administrador', 'admin@rhsystem.com',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 1, 1),
('Usuário RH',    'rh@rhsystem.com',        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'rh',            1, 1),
('Gestor',        'gestor@rhsystem.com',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor',        1, 1),
('Funcionário',   'funcionario@rhsystem.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'funcionario',   1, 1);

-- ---------------------------------------------------------
-- BENEFITS
-- ---------------------------------------------------------
INSERT INTO benefits (name, value, type, description, is_active, company_id) VALUES
('Vale Transporte',    250.00, 'transporte',    'Vale Transporte mensal',            1, 1),
('Vale Alimentação',   500.00, 'alimentacao',   'Vale Alimentação mensal',           1, 1),
('Plano de Saúde',     400.00, 'saude',         'Plano de Saúde empresarial',        1, 1),
('Plano Odontológico', 100.00, 'odontologico',  'Plano Odontológico empresarial',    1, 1),
('Seguro de Vida',      50.00, 'seguro',        'Seguro de Vida em grupo',           1, 1),
('Auxílio Creche',     300.00, 'creche',        'Auxílio Creche mensal',             1, 1);
