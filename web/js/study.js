(function (root) {
  function closed(status) {
    return status === "Finalizado" || status === "Encaminhado Expedição" || status === "Concluída";
  }
  function onVacation(employee, today) {
    if (!employee.ferias || !employee.ferias.inicio) return false;
    if (today < employee.ferias.inicio) return false;
    if (employee.ferias.fim && today > employee.ferias.fim) return false;
    return true;
  }
  function machineDown(resource) {
    if (resource.disponivel === false) return true;
    var status = String(resource.status || "").toLowerCase();
    return status.indexOf("quebr") >= 0 || status.indexOf("manuten") >= 0;
  }
  function personName(employee) {
    return ((employee.nome || "") + " " + (employee.sobrenome || "")).trim() || employee.id;
  }
  function buildProductionStudy(input) {
    var today = input.today || new Date().toISOString().slice(0, 10);
    var open = [];
    (input.orders || []).forEach(function (order) {
      var status = order.status || "Não iniciado";
      if (closed(status)) return;
      var label = order.numero || order.id;
      var source = order.itens && order.itens.length ? order.itens : [{
        id: order.id + "-item",
        descricao: order.descricao || order.codigo || label,
        grupoId: order.grupoId || "",
        quantidade: order.quantidadePlanejada || 0,
        produzida: 0
      }];
      source.forEach(function (item, index) {
        var quantidade = Number(item.quantidade) || 0;
        var produzida = Number(item.produzida) || 0;
        if (quantidade > 0 && produzida >= quantidade) return;
        var percentual = quantidade > 0 ? (produzida / quantidade) * 100 : 0;
        var isTarget = order.id === input.targetOrderId || label === input.targetOrderId;
        var prioridade = Number(order.prioridade);
        if (prioridade !== 1 && prioridade !== 3) prioridade = 2;
        var score = percentual / 10;
        if (isTarget) score += 1000;
        if (prioridade === 1) score += 300;
        else if (prioridade === 2) score += 100;
        if (percentual >= 90) score += 500 + percentual;
        if (status === "Bloqueado") score += 40;
        open.push({
          orderId: order.id,
          orderLabel: label,
          itemId: item.id || (order.id + "-" + index),
          itemLabel: item.descricao || order.descricao || order.codigo || label,
          grupoId: item.grupoId || "",
          quantidade: quantidade,
          produzida: produzida,
          status: status,
          prioridade: prioridade,
          score: score
        });
      });
    });
    open.sort(function (left, right) { return right.score - left.score; });
    var gargalos = open.filter(function (item) {
      return item.quantidade > 0 && (item.produzida / item.quantidade) * 100 >= 90;
    }).map(function (item) {
      return {
        orderId: item.orderId,
        orderLabel: item.orderLabel,
        itemLabel: item.itemLabel,
        percentual: Math.round((item.produzida / item.quantidade) * 1000) / 10,
        motivo: "Falta pouco para concluir. Priorize este residual para destravar o pedido."
      };
    });
    var available = (input.resources || []).filter(function (resource) { return !machineDown(resource); });
    var usedMachines = {};
    var busyPeople = {};
    var suggestions = [];
    open.forEach(function (item) {
      var machine = available.find(function (resource) {
        if (usedMachines[resource.id]) return false;
        var grupos = resource.grupos || [];
        return !item.grupoId || !grupos.length || grupos.indexOf(item.grupoId) >= 0;
      });
      if (!machine) return;
      var crew = (machine.funcionarios || []).map(function (id) {
        return (input.employees || []).find(function (employee) { return employee.id === id; });
      }).filter(Boolean);
      var pool = crew.length ? crew : (input.employees || []);
      var operator = pool.find(function (employee) {
        return !busyPeople[employee.id] && !onVacation(employee, today);
      });
      if (!operator) return;
      usedMachines[machine.id] = true;
      busyPeople[operator.id] = true;
      var percentual = item.quantidade > 0 ? Math.round((item.produzida / item.quantidade) * 100) : 0;
      var targetHit = item.orderId === input.targetOrderId || item.orderLabel === input.targetOrderId;
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
          ? "Prioriza a entrega do pedido " + item.orderLabel + "."
          : percentual >= 90
            ? "Fecha o residual de " + item.itemLabel + " (" + percentual + "% pronto) antes de abrir trabalho novo."
            : "Ocupa " + (machine.nome || "a máquina") + " com o próximo serviço para evitar ociosidade."
      });
    });
    root.ProdifyStudy = root.ProdifyStudy || {};
    return {
      suggestions: suggestions,
      gargalos: gargalos,
      ociosas: available.filter(function (resource) { return !usedMachines[resource.id]; }).map(function (resource) { return resource.nome || resource.id; })
    };
  }
  root.ProdifyStudy = { buildProductionStudy: buildProductionStudy };
})(typeof globalThis !== "undefined" ? globalThis : this);
