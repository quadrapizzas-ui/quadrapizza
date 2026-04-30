const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');

const routes = {
  dueño: [
    { path: 'inventario', name: 'Gestor de Stock' },
    { path: 'ventas', name: 'Reportes de Ventas' },
    { path: 'finanzas', name: 'Flujo de Caja' },
    { path: 'usuarios', name: 'Usuarios y Permisos' },
    { path: 'perfil', name: 'Perfil de Dueño' }
  ]
};

Object.keys(routes).forEach(moduleName => {
  const modulePath = path.join(srcApp, moduleName);
  
  routes[moduleName].forEach(route => {
    const routePath = path.join(modulePath, route.path);
    if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
    }
    
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
  console.log(`Generated additional routes for module: ${moduleName}`);
});
