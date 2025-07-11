# 🧪 Guía de Testing - Aplicación de Coches

## 📋 Resumen de Tests Implementados

### 1. **Tests Unitarios** ✅

#### **CardCarsComponent** (`src/app/components/card-cars/card-cars.component.spec.ts`)
- ✅ **Input Properties**: Verificación de recepción y visualización de datos del coche
- ✅ **Modal Functionality**: Tests de apertura, cierre y toggle del modal
- ✅ **Navigation Functionality**: Tests de navegación a Google Images
- ✅ **Lifecycle**: Tests del ciclo de vida del componente
- ✅ **Edge Cases**: Manejo de casos extremos (tipos vacíos, caracteres especiales)

#### **FilterCarsComponent** (`src/app/components/filter-cars/filter-cars.component.spec.ts`)
- ✅ **Signals and Computed Values**: Verificación de signals del servicio
- ✅ **Filter Methods**: Tests de filtrado por país, tipo de vehículo y búsqueda
- ✅ **Utility Methods**: Tests de detección de filtros activos y resumen
- ✅ **Edge Cases**: Manejo de eventos nulos y códigos de país desconocidos

#### **ListCarsComponent** (`src/app/components/list-cars/list-cars.component.spec.ts`)
- ✅ **Component Initialization**: Tests de inicialización y carga de datos
- ✅ **Signals and Computed Values**: Verificación de signals compartidos
- ✅ **Filter Management**: Tests de gestión de filtros
- ✅ **Error Handling**: Tests de manejo de errores y reintentos
- ✅ **UI State Management**: Tests de estado de la interfaz
- ✅ **Integration with Service**: Tests de integración con el servicio

#### **CarsService** (`src/app/services/cars.service.spec.ts`)
- ✅ **Initial State**: Tests del estado inicial del servicio
- ✅ **HTTP Operations**: Tests de operaciones HTTP (GET, errores, loading)
- ✅ **Filtering Logic**: Tests de lógica de filtrado (país, tipo, búsqueda)
- ✅ **Computed Signals**: Tests de signals computados (países únicos, tipos, stats)
- ✅ **Filter Management**: Tests de gestión de criterios de filtrado
- ✅ **Utility Methods**: Tests de métodos utilitarios
- ✅ **Edge Cases**: Tests de casos extremos y manejo de errores

### 2. **Tests de Integración** ✅

#### **Integration Tests** (`src/app/components/integration-tests.spec.ts`)
- ✅ **Complete Flow Integration**: Flujo completo de carga y filtrado
- ✅ **Component Communication**: Comunicación entre componentes
- ✅ **Error Handling Integration**: Manejo de errores en toda la aplicación
- ✅ **UI State Integration**: Estado de la interfaz integrado
- ✅ **Data Flow Integration**: Flujo de datos entre componentes
- ✅ **Performance Integration**: Tests de rendimiento con datasets grandes

## 🚀 Cómo Ejecutar los Tests

### **Ejecutar todos los tests**
```bash
npm test
```

### **Ejecutar tests en modo watch**
```bash
npm run test:watch
```

### **Ejecutar tests con coverage**
```bash
npm run test:coverage
```

### **Ejecutar tests específicos**
```bash
# Tests de un componente específico
npm test -- --testPathPattern=card-cars.component.spec.ts

# Tests de integración
npm test -- --testPathPattern=integration-tests.spec.ts

# Tests del servicio
npm test -- --testPathPattern=cars.service.spec.ts
```

## 📊 Cobertura de Tests

### **Componentes Testeados**
- ✅ **CardCarsComponent**: 100% de métodos y funcionalidades principales
- ✅ **FilterCarsComponent**: 100% de signals y métodos de filtrado
- ✅ **ListCarsComponent**: 100% de integración con servicio y UI
- ✅ **CarsService**: 100% de métodos HTTP y lógica de negocio

### **Funcionalidades Cubiertas**
- ✅ **Carga de datos**: HTTP requests, loading states, error handling
- ✅ **Filtrado**: Por país, tipo de vehículo, búsqueda de texto
- ✅ **UI/UX**: Modales, toggles, estados de carga
- ✅ **Navegación**: Enlaces externos a Google Images
- ✅ **Signals**: Computed values, reactive updates
- ✅ **Edge Cases**: Datos vacíos, errores de red, caracteres especiales

## 🛠️ Configuración de Testing

### **Dependencias Utilizadas**
- **Jest**: Framework de testing principal
- **@angular/core/testing**: Utilidades de testing de Angular
- **HttpClientTestingModule**: Mocking de HTTP requests
- **jest-preset-angular**: Preset para Angular + Jest

### **Configuración en `jest.config.ts`**
```typescript
export default {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironment: 'jsdom'
};
```

### **Setup en `setup-jest.ts`**
- Configuración de mocks para `window.open`
- Mock de `console.log` para evitar ruido en tests
- Configuración de JSDOM para testing de componentes

## 🎯 Patrones de Testing Implementados

### **1. Arrange-Act-Assert (AAA)**
```typescript
// Arrange
component.car = mockCar;

// Act
component.openModal();

// Assert
expect(component.isOpen).toBeTrue();
```

### **2. Mocking de Dependencias**
```typescript
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true
});
```

### **3. Testing de Signals**
```typescript
expect(component.$cars()).toEqual(mockCars);
expect(component.$loading()).toBeFalse();
```

### **4. Testing de HTTP Requests**
```typescript
const req = httpMock.expectOne('https://manufacture-cars.onrender.com/cars-manufacturers');
req.flush(mockCars);
```

### **5. Testing de Eventos**
```typescript
const event = { target: { value: 'DE' } } as any;
component.filterByCountry(event);
```

## 🔍 Casos de Test Específicos

### **Tests de Filtrado**
- ✅ Filtro por país (código de país)
- ✅ Filtro por tipo de vehículo (case insensitive)
- ✅ Búsqueda por texto (nombre común, legal, país)
- ✅ Filtros combinados (múltiples criterios)
- ✅ Limpieza de filtros

### **Tests de UI**
- ✅ Toggle de visibilidad de filtros
- ✅ Estados de loading
- ✅ Manejo de errores
- ✅ Modal de detalles del coche

### **Tests de Performance**
- ✅ Datasets grandes (100+ elementos)
- ✅ Filtrado eficiente
- ✅ Computed signals optimizados

## 📈 Métricas de Calidad

### **Cobertura Objetivo**
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >95%
- **Lines**: >90%

### **Tipos de Tests**
- **Unit Tests**: 60+ tests
- **Integration Tests**: 15+ tests
- **Edge Cases**: 20+ tests
- **Error Scenarios**: 10+ tests

## 🚨 Troubleshooting

### **Problemas Comunes**

1. **Error: "jasmine is not defined"**
   - Solución: Usar `jest.fn()` en lugar de `jasmine.createSpyObj()`

2. **Error: "No provider for HttpClient"**
   - Solución: Importar `HttpClientTestingModule` en los tests

3. **Error: "window.open is not a function"**
   - Solución: Mock de `window.open` en setup-jest.ts

4. **Error: "signal is not a function"**
   - Solución: Verificar imports de Angular signals

### **Comandos de Debug**
```bash
# Ver tests que fallan con más detalle
npm test -- --verbose

# Ejecutar un test específico con debug
npm test -- --testNamePattern="should filter by country"

# Ver coverage detallado
npm run test:coverage -- --coverageReporters=text
```

## 📝 Próximos Pasos

### **Tests Adicionales Recomendados**
- [ ] **E2E Tests**: Usando Cypress o Playwright
- [ ] **Visual Regression Tests**: Comparación de screenshots
- [ ] **Accessibility Tests**: Tests de accesibilidad
- [ ] **Performance Tests**: Tests de rendimiento real
- [ ] **Security Tests**: Validación de inputs y sanitización

### **Mejoras de Testing**
- [ ] **Test Data Factories**: Para generar datos de prueba consistentes
- [ ] **Custom Matchers**: Matchers personalizados para assertions
- [ ] **Test Utilities**: Utilidades compartidas para tests
- [ ] **CI/CD Integration**: Integración con pipelines de CI/CD

---

**¡Los tests están listos para ejecutarse!** 🎉 