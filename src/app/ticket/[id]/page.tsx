import TicketClient from "./TicketClient";

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default function TicketPage() {
  return <TicketClient />;
}
