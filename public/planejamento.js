// cronograma (serão carregados do JSON)
let cronogramaData = {};

//carregar os dados do JSON
async function loadCronogramaData() {
    try {
        const response = await fetch('planejamento.json');
        cronogramaData = await response.json();
        loadObrigacoes(cronogramaData.cronograma);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.querySelector('#obligationsTable tbody').innerHTML = 
            '<tr><td colspan="6" style="text-align: center;">Erro ao carregar dados</td></tr>';
    }
}

// carregar os dados na tabela
function loadObrigacoes(obrigacoes) {
    const tbody = document.querySelector('#obligationsTable tbody');
    tbody.innerHTML = '';
    
    if (obrigacoes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Nenhuma obrigação encontrada</td>';
        tbody.appendChild(row);
        return;
    }
    
    obrigacoes.forEach(obrigacao => {
        const row = document.createElement('tr');
        if (obrigacao.status === 'concluido') {
            row.classList.add('completed');
        }
        
        row.innerHTML = `
            <td>${obrigacao.descricao}</td>
            <td>${obrigacao.mes}</td>
            <td>${obrigacao.prazo}</td>
            <td>${obrigacao.tipo}</td>
            <td>${obrigacao.status}</td>
            <td class="action-buttons">
                <button class="btn btn-success btn-sm" onclick="markAsCompleted(this, ${obrigacao.id})">
                    ${obrigacao.status === 'concluido' ? 'Desfazer' : 'Concluído'}
                </button>
                <button class="btn btn-primary btn-sm" onclick="addReminder(this, ${obrigacao.id})">
                    Lembrete
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

//  filtrar por mês
function filterByMonth(month) {
    if (!month) {
        return cronogramaData.cronograma;
    }
    return cronogramaData.cronograma.filter(item => item.mes.toLowerCase() === month.toLowerCase());
}

// Event Listeners
document.getElementById('viewSchedule').addEventListener('click', function() {
    const monthSelect = document.getElementById('month');
    const selectedMonth = monthSelect.value;
    
    if (!selectedMonth) {
        alert('Por favor, selecione um mês válido');
        return;
    }
    
    const filteredData = filterByMonth(selectedMonth);
    loadObrigacoes(filteredData);
});

document.getElementById('clearSelection').addEventListener('click', function() {
    document.getElementById('month').value = '';
    loadObrigacoes([]);
});

document.getElementById('viewAllMonths').addEventListener('click', function() {
    loadObrigacoes(cronogramaData.cronograma);
});

//interação
function markAsCompleted(button, id) {
    const obrigacao = cronogramaData.cronograma.find(item => item.id === id);
    obrigacao.status = obrigacao.status === 'concluido' ? 'pendente' : 'concluido';
    
    const row = button.closest('tr');
    row.classList.toggle('completed');
    button.textContent = obrigacao.status === 'concluido' ? 'Desfazer' : 'Concluído';
    row.cells[4].textContent = obrigacao.status;
}

function addReminder(button, id) {
    const obrigacao = cronogramaData.cronograma.find(item => item.id === id);
    alert(`Lembrete adicionado para: ${obrigacao.descricao}\nPrazo: ${obrigacao.prazo}`);
}

//dados quando a página é carregada
document.addEventListener('DOMContentLoaded', loadCronogramaData);