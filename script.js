
let alunos = [];


let nextId = 1;
function generateId() {
    return nextId++;
}


function calcularMedia(notas) {
    if (notas.length === 0) {
        return 'N/A'; 
    }
    const total = notas.reduce((acc, nota) => acc + nota.nota, 0);
    return (total / notas.length).toFixed(2);
}


document.getElementById('form-aluno').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const email = document.getElementById('email').value;

    // 
    const matriculaExistente = alunos.some(aluno => aluno.matricula === matricula);
    if (matriculaExistente) {
        alert('Erro: Já existe um aluno com esta matrícula!');
        return;
    }

    const novoAluno = {
        id: generateId(), 
        nome,
        matricula,
        email,
        notas: []
    };
    alunos.push(novoAluno);

    alert("Aluno cadastrado com sucesso!");
    this.reset();
    mostrarAlunos(); 
});


function mostrarAlunos() {
    const tableBody = document.getElementById('alunos-table-body');
    tableBody.innerHTML = ''; 

    alunos.forEach(aluno => {
        const media = calcularMedia(aluno.notas);
        const row = tableBody.insertRow(); 

        row.insertCell().textContent = aluno.nome;
        row.insertCell().textContent = aluno.matricula;
        row.insertCell().textContent = aluno.email;
        row.insertCell().textContent = media;

        const actionsCell = row.insertCell();
        const btnDetalhes = document.createElement('button');
        btnDetalhes.textContent = 'Detalhes';
        btnDetalhes.classList.add('action-button', 'details-button'); 
        btnDetalhes.onclick = () => buscarAlunoPorMatricula(aluno.matricula); 
        actionsCell.appendChild(btnDetalhes);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('action-button', 'edit-button');
        btnEditar.onclick = () => editarAluno(aluno.id);
        actionsCell.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('action-button', 'delete-button');
        btnExcluir.onclick = () => excluirAluno(aluno.id);
        actionsCell.appendChild(btnExcluir);
    });
}


function editarAluno(idAluno) {
    const aluno = alunos.find(a => a.id === idAluno);
    if (!aluno) {
        alert('Aluno não encontrado para edição.');
        return;
    }

    
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('matricula').value = aluno.matricula;
    document.getElementById('email').value = aluno.email;

    const formAluno = document.getElementById('form-aluno');
    const oldButton = formAluno.querySelector('button[type="submit"]');
    oldButton.textContent = 'Salvar Edição';
    oldButton.style.backgroundColor = '#FFC107'; 

    
    const newSubmitHandler = function(e) {
        e.preventDefault();

        aluno.nome = document.getElementById('nome').value;
  
        aluno.email = document.getElementById('email').value;

        alert('Aluno atualizado com sucesso!');
        formAluno.reset();
        mostrarAlunos();
        oldButton.textContent = 'Cadastrar Aluno';
        oldButton.style.backgroundColor = ''; 
        formAluno.removeEventListener('submit', newSubmitHandler); 
        formAluno.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
        });
    
    };

    
    formAluno.onsubmit = function(e) { 
        e.preventDefault();
        aluno.nome = document.getElementById('nome').value;
        aluno.email = document.getElementById('email').value;
        alert('Aluno atualizado com sucesso!');
        formAluno.reset();
        mostrarAlunos();
        oldButton.textContent = 'Cadastrar Aluno';
        oldButton.style.backgroundColor = '';
        formAluno.onsubmit = addStudentFormHandler; 
    };
    
    const addStudentFormHandler = document.getElementById('form-aluno')._originalSubmitHandler ||
                                  document.getElementById('form-aluno').addEventListener('submit', function(e){ e.preventDefault(); /* ... */ }, false); // fallback

}


function excluirAluno(idAluno) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        alunos = alunos.filter(aluno => aluno.id !== idAluno);
        
        grades = grades.filter(nota => nota.studentId !== idAluno);
        alert('Aluno excluído com sucesso!');
        mostrarAlunos(); 
        document.getElementById('info-aluno').innerHTML = '';
    }
}



document.getElementById('form-nota').addEventListener('submit', function(e) {
    e.preventDefault();

    const matricula = document.getElementById('matricula-nota').value;
    const disciplina = document.getElementById('disciplina').value;
    const nota = parseFloat(document.getElementById('nota').value);

    const aluno = alunos.find(a => a.matricula === matricula);
    if (aluno) {
       
        if (isNaN(nota) || nota < 0 || nota > 10) {
            alert("Por favor, insira uma nota válida entre 0 e 10.");
            return;
        }

        aluno.notas.push({ disciplina, nota });
        alert("Nota registrada com sucesso!");
        this.reset();
        mostrarAlunos(); 
    } else {
        alert("Aluno não encontrado. Verifique a matrícula.");
    }
});


function buscarAlunoPorMatricula(matriculaParaBuscar) {
    const aluno = alunos.find(a => a.matricula === matriculaParaBuscar);
    const infoDiv = document.getElementById('info-aluno');
    infoDiv.innerHTML = ''; 

    if (aluno) {
        const media = calcularMedia(aluno.notas);

        let notasHtml = '';
        if (aluno.notas.length === 0) {
            notasHtml = '<p>Nenhuma nota registrada.</p>';
        } else {
            notasHtml = `<h3>Notas Detalhadas:</h3><ul>`;
            aluno.notas.forEach(nota => {
                notasHtml += `<li>${nota.disciplina}: ${nota.nota}</li>`;
            });
            notasHtml += `</ul>`;
        }

        infoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${aluno.nome}</p>
            <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
            <p><strong>Email:</strong> ${aluno.email}</p>
            <p><strong>Média Geral:</strong> ${media}</p>
            ${notasHtml}
        `;
    } else {
        infoDiv.innerHTML = '<p>Aluno não encontrado. Verifique a matrícula.</p>';
    }
}

document.getElementById('btn-buscar').addEventListener('click', function() {
    const matricula = document.getElementById('buscar-matricula').value;
    buscarAlunoPorMatricula(matricula);
});


document.addEventListener('DOMContentLoaded', mostrarAlunos);


alunos.push({ id: generateId(), nome: 'Maria Oliveira', matricula: '2024001', email: 'maria@example.com', notas: [{ disciplina: 'Matemática', nota: 7.5 }, { disciplina: 'Português', nota: 8.0 }] });
alunos.push({ id: generateId(), nome: 'João Santos', matricula: '2024002', email: 'joao@example.com', notas: [{ disciplina: 'História', nota: 6.0 }, { disciplina: 'Geografia', nota: 7.0 }, { disciplina: 'Matemática', nota: 5.5 }] });

