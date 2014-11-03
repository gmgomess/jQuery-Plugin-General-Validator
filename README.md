jQuery-Plugin-General-Validator
===============================
Um plugin simples de validação e máscaras. Você pode definir se deseja a implantação de máscaras nos campos, as mensagens padrões e ainda o que deseja ser feito quando os dados forem consistentes ou inconsistentes. Tipos de validação:
<ul>
<li>Campos obrigatórios:<code>required</code></li>
<li>Valor numérico:<code>numeric</code></li>
<li>Comparação de Senha com Confirmação de Senha:<code>password</code> (em ambos os campos)</li>
<li>E-mail:<code>email</code></li>
<li>Data (dd/MM/yyyy): <code>date</code></li>
<li>Validação de CEP e recuperação dos dados (rua, cidade...) através do CEP:<code>cep</code></li>
<li>CPF:<code>cpf</code></li>
<li>CNPJ:<code>cnpj</code></li>
<br/>
Para validação de tamanho mínimo e máximo, adicione o atributo<code>data-minlength</code> ou<code>data-maxlength</code> 
<li>Tamanho mínimo - exemplo:<code>data-minlength="5"</code></li>
<li>Tamanho máximo - exemplo:<code>data-minlength="20"</code></li>
<br/>
<li>Validação customizada através de Expressão Regular (regex)</li>
        Para validação customizada com Regex, adicione o atributo<code>data-pattern</code><br/>
        Exemplo:<code>data-pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"</code>
</ul>

<h3>Início</h3>
Para iniciar com o plugin, selecione o formulário que deseja validar:
```
   $(document).ready(function () {
      $('#form1').validate();
   });
```
<h3>Propriedades</h3>
<h4>Defina as Mensagens</h4>
Defina as mensagens padrões para cada tipo de validação.<br/>

| Validação  | Propriedade | Mensagem Default |
| ------------- | ------------- | ------------- |
| Campo Obrigatório            |requiredMsg  | 'Campo Requerido!'|
| Campo Obrigatório (radio)    |radioMsg     | 'Selecione uma opção!'|
| Campo Obrigatório (checkbox) |checkedMsg| 'Marque uma opção!'|
| E-mail                       |emailMsg| 'O e-mail informado é inválido!'|
| CPF                          |cpfMsg| 'CPF informado é inválido!'|
| CNPJ                         |cnpjMsg| 'CNPJ informado é inválido!'|
| Data Invalida                |dateMsg| 'Data informada é inválida!'|
| Tipo Numérico                |numericMsg| 'O valor deve ser númerico!'|
| Tamanho Mínimo               |minlengthMsg| 'Informe ao menos § caracteres!' Obs:("§" será substituido pelo valor definido no atributo data-minlength)|
| Tamanho Máximo               |maxlengthMsg| 'A quantidade máxima é de § caracteres!'Obs:("§" será substituido pelo valor definido no atributo data-maxlength)|
| Senha e Confirmação de Senha |passwordMsg| 'Senhas não conferem!'|
| Telefone                     |phoneMsg| 'O telefone informado é inválido!'|
| CEP                          |cepMsg| 'Cep não encontrado, informe um CEP válido.'|

Para definir as mensagens padrão indique em seu seletor a(s) mensagem(ns) que deseja alterar. Exemplo:
```
      $('#form1').validate({
        requiredMsg: 'Por favor, preencha esse campo',
        cepMsg: 'A mensagem do cep também foi alterada!'
      });
```
<h5>Mensagens Específicas para um Controle</h5>
Para definir uma mensagem específica a um campo, utilize o atributo<code>data-msg-*</code> seguido do tipo da validação que você deseja que essa mensagem seja exibida:
<div id="tipo">
| Descrição da Validação | data-msg-* |
| ------------- | ------------- |
| Campo Obrigatório            |required  |
| E-mail                       |email|
| CPF                          |cpf|
| CNPJ                         |cnpj|
| Data Invalida                |date|
| Tipo Numérico                |numeric|
| Tamanho Mínimo               |min|
| Tamanho Máximo               |max|
| Senha e Confirmação de Senha |password|
| Telefone                     |phone|
| CEP                          |cep|
</div>
Exemplo:
```<input type="text" id="fone" class="required cep" data-msg-required="Preencha esse campo!!!" data-msg-cep="O CEP informado não é valido!!!" />```
<br/>

<h4>Funções Callback</h4>
<h5>Se INVÁLIDO</h5>
Por padrão, quando alguma inconsistência é encontrada, o plugin adiciona um <code><span class='error-msg'>[menssagem]</span></code> e evita o post do form. Caso deseje realizar mais alguma ação apenas define a função "ifInvalid".
<br/>
<br/>
<b>Parâmetros que podem ser recuperados:</b>
<br/>
<code>field</code>: Retorna o objeto seletor jQuery o campo inconsistente.<br/>
<code>message</code>: Retorna uma string com a Mensagem do span.<br/>
<code>error</code>: Retorna Tipo de validação inconsistente (os mesmos valores da tabela <a href="#tipo">acima</a>.
Exemplo:
```
 $('form').validate({
    ifInvalid: function (field, message, error) {
    }
});
```
<br/>
<h5>Se VÁLIDO</h5>
Por padrão, quando os dados de um são válidos, o plugin remove o span de erro daquele campo. Caso deseje realizar mais alguma ação apenas define a função "ifValid".
<b>Parâmetros que podem ser recuperados:</b>
<br/>
<code>field</code>: Retorna o objeto seletor jQuery o campo inconsistente.<br/>
<code>message</code>:  Mensagem do span.<br/>
<code>error</code>:  Tipo de validação inconsistente (os mesmos valores da tabela <a href="#tipo">acima</a>.
Exemplo:
```
 $('form').validate({
    ifValid: function (field) {
    }
});
```
<h5>Função CEP</h5>
Adicione a classe<code>cep</code> no controle e recupere os dados relacionados ao CEP informado. Defina a function<code>callbackCep</code> e recupere os dados adicionando um paramatro. A função é disparada no evento<code>focusout</code> do controle.
O objeto retorna as propriedades:
<ul>
<li>bairro</li>
<li>cidade</li>
<li>logradouro</li>
<li>resultado: <code>0</code> para CEP inválido e <code>1</code> para CEP válido</li>
<li>resultado_txt: descrição de sucesso/falha</li>
<li>tipo_logradouro: Rua, Avenida...</li>
<li>uf</li>

Exemplo:
```
 $('form').validate({
    callbackCep: function (field) {
      alert(field.logradouro);
    }
});
```
