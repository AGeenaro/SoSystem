export const ORDER_STATUSES = [
  "Não iniciado",
  "Iniciado/Parado",
  "Bloqueado",
  "Finalizado/Em Pintura",
  "Finalizado/Em montagem",
  "Finalizado",
  "Encaminhado Expedição"
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const LEGACY: Record<string, OrderStatus> = {
  Aberta: "Não iniciado",
  "Em Produção": "Iniciado/Parado",
  Concluída: "Finalizado"
};

export function normalizeOrderStatus(status: unknown): OrderStatus {
  const value = typeof status === "string" ? status : "";
  if ((ORDER_STATUSES as readonly string[]).includes(value)) return value as OrderStatus;
  return LEGACY[value] ?? "Não iniciado";
}

export function orderStatusNeedsReason(status: OrderStatus): boolean {
  return status === "Iniciado/Parado" || status === "Bloqueado";
}

export function changeOrderStatus(
  _current: unknown,
  next: unknown,
  detail: { setor?: unknown; motivo?: unknown }
): { status: OrderStatus; setor: string; motivo: string } {
  const raw = typeof next === "string" && next.trim() ? next.trim() : "Não iniciado";
  const known = (ORDER_STATUSES as readonly string[]).includes(raw) || Object.prototype.hasOwnProperty.call(LEGACY, raw);
  if (!known) throw new Error("Status de pedido desconhecido.");
  const status = normalizeOrderStatus(raw);
  const setor = String(detail.setor ?? "").trim();
  const motivo = String(detail.motivo ?? "").trim();
  if (orderStatusNeedsReason(status) && !motivo) {
    if (Object.prototype.hasOwnProperty.call(LEGACY, raw)) {
      return {
        status,
        setor: setor || "Geral",
        motivo: motivo || "Status anterior sem detalhe."
      };
    }
    throw new Error("Informe o motivo.");
  }
  return { status, setor, motivo };
}
