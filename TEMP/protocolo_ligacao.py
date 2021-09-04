"""
Convidar um usuário:
    Cliente: "Convite: nome_cliente, ip_cliente, porta_cliente"
    Servidor: "Resposta ao Convite: Aceito"
    Servidor: "Resposta ao Convite: Rejeitado"
Enviar dados de voz:
    Cliente: "Enviar Dados: "
    Servidor: "Dados: "
Encerrar uma ligação:
    Cliente: "Encerrar Ligação:"
"""

MENSAGEM_CONVITE = 1
MENSAGEM_RESP_CONVITE = 2
MENSAGEM_ENVIAR_DADOS = 3
MENSAGEM_DADOS = 4
MENSAGEM_ENCERRAR_LIGACAO = 5

def get_msg_convite(informacoes):
    return "Convite: {0}".format(informacoes)

def get_msg_resp_convite(informacoes):
    return "Resposta ao Convite: {0}".format(informacoes)

def get_msg_enviar_dados():
    return "Enviar Dados:"

def get_msg_dados(informacoes):
    return "Dados: {0}".format(informacoes)

def get_msg_encerrar_ligacao():
    return "Encerrar Ligação:"

def get_info_msg(mensagem):
    return mensagem[mensagem.find(":") + 1 :].strip()

def get_tipo_msg(mensagem):
    if(mensagem.startswith("Convite")): return MENSAGEM_CONVITE
    if(mensagem.startswith("Resposta ao Convite")): return MENSAGEM_RESP_CONVITE
    if(mensagem.startswith("Enviar Dados")): return MENSAGEM_ENVIAR_DADOS
    if(mensagem.startswith("Dados")): return MENSAGEM_DADOS
    if(mensagem.startswith("Encerrar Ligação")): return MENSAGEM_ENCERRAR_LIGACAO
