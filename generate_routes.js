const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');

// Move (admin) to gerencia
const adminDir = path.join(srcApp, '(admin)');
const gerenciaDir = path.join(srcApp, 'gerencia');

if (fs.existsSync(adminDir)) {
  fs.mkdirSync(gerenciaDir, { recursive: true });
  const adminDirs = fs.readdirSync(adminDir);
  adminDirs.forEach(item => {
    fs.renameSync(path.join(adminDir, item), path.join(gerenciaDir, item));
  });
  fs.rmdirSync(adminDir);
  console.log('Migrated (admin) to gerencia');
} else {
  console.log('(admin) already migrated or missing');
}

// Routes Definition
const routes = {
  recepcion: [
    { path: 'login', name: 'Login Operario' },
    { path: 'nueva-venta', name: 'Nueva Venta (POS)' },
    { path: 'estado-pedidos', name: 'Estado de Pedidos' },
    { path: 'clientes', name: 'Base de Clientes' },
    { path: 'stock-rapido', name: 'Consulta de Stock' },
    { path: 'catalogo', name: 'Catálogo de Lectura' },
    { path: 'perfil', name: 'Mi Perfil' }
  ],
  cocina: [
    { path: 'login', name: 'Login Cocina' },
    { path: 'monitor-pedidos', name: 'Monitor KDS' },
    { path: 'stock-critico', name: 'Alertas de Insumos' },
    { path: 'perfil', name: 'Mi Perfil' }
  ],
  delivery: [
    { path: 'login', name: 'Login Repartidor' },
    { path: 'mis-viajes', name: 'Viajes Asignados' },
    { path: 'perfil', name: 'Mi Perfil' }
  ],
  backoffice: [
    { path: 'login', name: 'Login Backoffice' },
    { path: 'dashboard', name: 'Dashboard Contable' },
    { path: 'consultas-ventas', name: 'Reportes de Ventas' },
    { path: 'consultas-finanzas', name: 'Reportes Financieros' },
    { path: 'perfil', name: 'Perfil Administrativo' }
  ]
};

// Layout scaffolding (basic empty layout for next app router)
const createLayoutIfNeeded = (moduleName) => {
  const layoutPath = path.join(srcApp, moduleName, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    let content = `import React from "react";\n\nexport default function ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">\n      {/* Aquí podrías incluir un Sidebar o Header compartido para ${moduleName} */}\n      <main className="flex-1 w-full">\n        {children}\n      </main>\n    </div>\n  );\n}\n`;
    fs.writeFileSync(layoutPath, content);
  }
};

// Generate standard pages
Object.keys(routes).forEach(moduleName => {
  const modulePath = path.join(srcApp, moduleName);
  fs.mkdirSync(modulePath, { recursive: true });
  
  createLayoutIfNeeded(moduleName);

  routes[moduleName].forEach(route => {
    const routePath = path.join(modulePath, route.path);
    fs.mkdirSync(routePath, { recursive: true });
    
    const pagePath = path.join(routePath, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      const content = `"use client";
import { UnderConstruction } from "@/components/shared/UnderConstruction";

export default function ${route.name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <UnderConstruction moduleName="${moduleName.toUpperCase()}" pageName="${route.name}" />
    </div>
  );
}
`;
      fs.writeFileSync(pagePath, content);
    }
  });
  console.log(`Generated routes for module: ${moduleName}`);
});
