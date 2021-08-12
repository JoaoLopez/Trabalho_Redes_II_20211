#Este arquivo possui funções e constantes que definem um protocolo de comunicação
#utilizado pelos módulos cliente e servidor da aplicação para se comunicarem

"""
Estrutura das mensagens trocadas: "TIPO_DA_MENSAGEM: INFORMACOES_DA_MENSAGEM"

Possíveis mensagens trocadas entre os módulos cliente e servidor da aplicação:
    Registro de um novo usuário:
        Cliente: "Registrar: nome, IP, porta, socket_id"
        Servidor: "OK: Novo usuário registrado! json_usuario socket_id"
                  "Erro: Já há um usuário registrado com esse nome! socket_id"

    Consulta de dados de outro usuário:
        Cliente: "Consultar: nome socket_id"
        Servidor: "OK: IP, porta socket_id"
                "Erro: Não há nenhum usuário registrado com esse nome! socket_id"

    Fechamennto de conexão:
        Cliente: "Fechar conexão: nome socket_id"
        Servidor: "OK: Conexão encerrada socket_id nome"
"""

MENSAGEM_TIPO_REGISTRAR = 1
MENSAGEM_TIPO_CONSULTAR = 2
MENSAGEM_TIPO_FECHAR_CONEXAO = 3
MENSAGEM_TIPO_OK = 4
MENSAGEM_TIPO_ERRO = 5

def get_mensagem_do_tipo_registrar(informacoes):
    return "Registrar: {0}".format(informacoes)

def get_mensagem_do_tipo_consultar(informacoes):
    return "Consultar: {0}".format(informacoes)

def get_mensagem_do_tipo_fechar_conexao(informacoes):
    return "Fechar conexão: {0}".format(informacoes)

def get_mensagem_do_tipo_ok(informacoes):
    return "OK: {0}".format(informacoes)

def get_mensagem_do_tipo_erro(informacoes):
    return "Erro: {0}".format(informacoes)

def get_informacoes_da_mensagem(mensagem):
    return mensagem[mensagem.find(":") + 1 :].strip()

def get_tipo_de_mensagem(mensagem):
    if(mensagem.startswith("Registrar")):   return MENSAGEM_TIPO_REGISTRAR
    if(mensagem.startswith("Consultar")):   return MENSAGEM_TIPO_CONSULTAR
    if(mensagem.startswith("Fechar conexão")):   return MENSAGEM_TIPO_FECHAR_CONEXAO
    if(mensagem.startswith("OK")):   return MENSAGEM_TIPO_OK
    if(mensagem.startswith("Erro")):   return MENSAGEM_TIPO_ERRO
