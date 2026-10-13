import EstadoPedidoClient from "./EstadoPedidoClient";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default function EstadoPedidoPage() {
  return <EstadoPedidoClient />;
}
