class Usuario:
    def __init__(self, nome, ip, porta):
        self.__nome = nome
        self.__ip = ip
        self.__porta = porta
    
    @property
    def nome(self):
        return self.__nome
    
    @property
    def ip(self):
        return self.__ip

    @property
    def porta(self):
        return self.__porta