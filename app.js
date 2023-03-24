// objeto com os valores da despesa
class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }

        return true
    }
}

// objeto banco de dados
class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarRegistros() {
        // Array do objetos de despesa
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas
        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            //se existir algum índice que foi removido vamos pular esse índice
            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
        
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()

        // console.log(despesa)

        // console.log(despesasFiltradas)
        

        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)

        window.location.reload()
    }

}

let bd = new Bd()

function cadastroDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesas = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if(despesas.validarDados()) {
        bd.gravar(despesas)

        document.getElementById('modal_title').innerHTML = 'Resgitro inserido com sucesso!'
        document.getElementById('modal_title_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        

        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        document.getElementById('modal_title').innerHTML = 'Erro na inclusão de registro'
        document.getElementById('modal_title_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Verifique se todas as caixas do formulário foram preenchidas corretamente'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        // //dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }

}

function carregarLista(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {

        // console.log(despesas)

        //criando linha(tr)
        let linha = listaDespesas.insertRow() 
        //criando colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar o tipo
        switch(parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar um botão para remover alguma despesa
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa:${d.id}`
        btn.onclick = function() {
            let id = this.id.replace('id_despesa:', '')

            let confirmar = confirm('Esta despesa será apagada. confirmar?')

            // console.log(confirmar)

            if(confirmar == true) {
                // console.log('Apagado')
                bd.remover(id)
            }
 
        }
        linha.insertCell(4).append(btn)

        // console.log(d)

    })

}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregarLista(despesas, true)
    // console.log(despesas)
}

////////////////////////////////////////////////

function setupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = ""
    

    let page_count = Math.ceil(items.length / rows_per_page)

    for(let i = 1; i < page_count + 1; i++) {
        let btn = paginationButton(i, items)
        let link = paginationLink(i)

        wrapper.appendChild(btn)
        btn.appendChild(link)
    }
}

function paginationButton(page, items) {
    let button = document.createElement('li')
    
    button.classList.add('page-item')

    if(current_page == page) {
        button.classList += ' active'
    }

    button.addEventListener('click', function() {
        current_page = page
        displayList(items, list_element, rows, current_page)

        let current_btn = document.querySelector('li.active')
        current_btn.classList.remove('active')

        button.classList.add('active')
    })

    return button
}

function paginationLink(page) {
    let link = document.createElement('a')
    link.classList.add('page-link')

    link.innerText = page

    return link
}

let pagination_element = document.getElementById('navegacao')

items = bg.recuperarRegistros()
let current_page = 1 //página atual
let rows = 4  //linhas por página

setupPagination(items, pagination_element, rows)