import React from "react";

export function RestaurantJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "name": "Quadra Pizza",
    "image": "https://quadrapizza.com/logo.webp",
    "description": "Pizzería y rotisería artesanal en Yocsina y Malagueño. Pizzas rectangulares por filas, sándwiches, lomos y menú del día con delivery a domicilio.",
    "servesCuisine": [
      "Pizza",
      "Comida Rápida",
      "Rotisería Argentina"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "ARS",
    "paymentAccepted": "Efectivo, Transferencia, Mercado Pago, Tarjeta de crédito",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pje. Blas Parera 148",
      "postalCode": "X5101",
      "addressLocality": "Yocsina, Malagueño",
      "addressRegion": "Córdoba",
      "addressCountry": "AR"
    },
    "sameAs": [
      "https://www.instagram.com/quadra.pizza/"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Yocsina"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Malagueño"
      },
      {
        "@type": "AdministrativeArea",
        "name": "La Perla"
      }
    ],
    "hasMenu": "https://quadrapizza.com/#catalogo",
    "potentialAction": {
      "@type": "OrderAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://quadrapizza.com",
        "inLanguage": "es-AR",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "deliveryMethod": [
        "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload",
        "http://purl.org/goodrelations/v1#DeliveryModePickUp"
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
