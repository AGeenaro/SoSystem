export type StudyOrderItem = {
  id?: string;
  descricao?: string;
  grupoId?: string;
  quantidade?: number;
  produzida?: number;
};

export type StudyOrder = {
  id: string;
  numero?: string;
  codigo?: string;
  descricao?: string;
  status?: string;
  quantidadePlanejada?: number;
  grupoId?: string;
  itens?: StudyOrderItem[];
};

export type StudyEmployee = {
  id: string;
  nome?: string;
  sobrenome?: string;
  funcao?: string;
  ferias?: { inicio?: string; fim?: string };
};

export type StudyResource = {
  id: string;
  nome?: string;
  status?: string;
  funcionarios?: string[];
  grupos?: string[];
  disponivel?: boolean;
};

export type StudySuggestion = {
  orderId: string;
  orderLabel: string;
  itemId: string;
  itemLabel: string;
  recursoId: string;
  recursoNome: string;
  funcionarioId: string;
  funcionarioNome: string;
  motivo: string;
  prioridade: number;
};

export type StudyBottleneck = {
  orderId: string;
  orderLabel: string;
  itemLabel: string;
  percentual: number;
  motivo: string;
};

export type StudyResult = {
  suggestions: StudySuggestion[];
  gargalos: StudyBottleneck[];
  ociosas: string[];
};

type OpenItem = {
  orderId: string;
  orderLabel: string;
  itemId: string;
  itemLabel: string;
  grupoId: string;
  quantidade: number;
  produzida: number;
  status: string;
  score: number;
};

function closed(status: string): boolean {
  return status === "Finalizado" || status === "Encaminhado Expedição" || status === "Concluída";
}

function onVacation(employee: StudyEmployee, today: string): boolean {
  if (!employee.ferias?.inicio) return false;
  if (today < employee.ferias.inicio) return false;
  if (employee.ferias.fim && today > employee.ferias.fim) return false;
  return true;
}

function machineDown(resource: StudyResource): boolean {
  if (resource.disponivel === false) return true;
  const status = String(resource.status || "").toLowerCase();
  return status.includes("quebr") || status.includes("manuten");
}

function personName(employee: StudyEmployee): string {
  return `${employee.nome || ""} ${employee.sobrenome || ""}`.trim() || employee.id;
}

function flatten(orders: StudyOrder[], target: string): OpenItem[] {
  const items: OpenItem[] = [];
  for (const order of orders) {
    const status = order.status || "Não iniciado";
    if (closed(status)) continue;
    const label = order.numero || order.id;
    const source = order.itens?.length
      ? order.itens
      : [{
          id: `${order.id}-item`,
          descricao: order.descricao || order.codigo || label,
          grupoId: order.grupoId || "",
          quantidade: order.quantidadePlanejada || 0,
          produzida: 0
        }];
    source.forEach((item, index) => {
      const quantidade = Number(item.quantidade) || 0;
      const produzida = Number(item.produzida) || 0;
      if (quantidade > 0 && produzida >= quantidade) return;
      const percentual = quantidade > 0 ? (produzida / quantidade) * 100 : 0;
      const isTarget = order.id === target || label === target;
      let score = percentual / 10;
      if (isTarget) score += 1000;
      if (percentual >= 90) score += 500 + percentual;
      if (status === "Bloqueado") score += 40;
      items.push({
        orderId: order.id,
        orderLabel: label,
        itemId: item.id || `${order.id}-${index}`,
        itemLabel: item.descricao || order.descricao || order.codigo || label,
        grupoId: item.grupoId || "",
        quantidade,
        produzida,
        status,
        score
      });
    });
  }
  return items.sort((left, right) => right.score - left.score);
}

export function buildProductionStudy(input: {
  targetOrderId: string;
  orders: StudyOrder[];
  employees: StudyEmployee[];
  resources: StudyResource[];
  today?: string;
}): StudyResult {
  const today = input.today || new Date().toISOString().slice(0, 10);
  const open = flatten(input.orders || [], input.targetOrderId);
  const gargalos: StudyBottleneck[] = open
    .filter((item) => item.quantidade > 0 && (item.produzida / item.quantidade) * 100 >= 90)
    .map((item) => ({
      orderId: item.orderId,
      orderLabel: item.orderLabel,
      itemLabel: item.itemLabel,
      percentual: Math.round((item.produzida / item.quantidade) * 1000) / 10,
      motivo: "Falta pouco para concluir. Priorize este residual para destravar o pedido."
    }));

  const available = (input.resources || []).filter((resource) => !machineDown(resource));
  const usedMachines = new Set<string>();
  const busyPeople = new Set<string>();
  const suggestions: StudySuggestion[] = [];

  for (const item of open) {
    const machine = available.find((resource) => {
      if (usedMachines.has(resource.id)) return false;
      const grupos = resource.grupos || [];
      return !item.grupoId || grupos.length === 0 || grupos.includes(item.grupoId);
    });
    if (!machine) continue;
    const crewIds = machine.funcionarios || [];
    const crew = crewIds
      .map((id) => (input.employees || []).find((employee) => employee.id === id))
      .filter((employee): employee is StudyEmployee => Boolean(employee));
    const pool = crew.length ? crew : (input.employees || []);
    const operator = pool.find((employee) => !busyPeople.has(employee.id) && !onVacation(employee, today));
    if (!operator) continue;
    usedMachines.add(machine.id);
    busyPeople.add(operator.id);
    const percentual = item.quantidade > 0 ? Math.round((item.produzida / item.quantidade) * 100) : 0;
    const targetHit = item.orderId === input.targetOrderId || item.orderLabel === input.targetOrderId;
    suggestions.push({
      orderId: item.orderId,
      orderLabel: item.orderLabel,
      itemId: item.itemId,
      itemLabel: item.itemLabel,
      recursoId: machine.id,
      recursoNome: machine.nome || machine.id,
      funcionarioId: operator.id,
      funcionarioNome: personName(operator),
      prioridade: suggestions.length + 1,
      motivo: targetHit
        ? `Prioriza a entrega do pedido ${item.orderLabel}.`
        : percentual >= 90
          ? `Fecha o residual de ${item.itemLabel} (${percentual}% pronto) antes de abrir trabalho novo.`
          : `Ocupa ${machine.nome || "a máquina"} com o próximo serviço para evitar ociosidade.`
    });
  }

  return {
    suggestions,
    gargalos,
    ociosas: available.filter((resource) => !usedMachines.has(resource.id)).map((resource) => resource.nome || resource.id)
  };
}
