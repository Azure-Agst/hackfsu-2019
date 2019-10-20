'''
api.py - holds main functionality for the Nole API
'''
import net
import time
from random import randint

class NoleAPI:
    def __init__(self):
        self.conn = net.NoleCon('rinkeby')
        assert self.conn.run()
        self.conn.decryptKey(net.keypath, '1234')
        assert not self.conn.isLock()
        
    def createNew(self, passphrase):
        address = self.conn.createAccount(passphrase, str(time.time()))
        return address

    def getBalance(self, address):
        assert self.conn.run()
        return self.conn.getBalance(address)
    def getTokenBalance(self, who):
        return self.conn.getTokenBalance(who)
        
    def mint(self, address, tokens):
        if not self.conn.isLock() and self.conn.isRunning():
            self.conn.call(net.contract_address, 'mint', address, tokens)
            return True
        else:
            return False
    
    def transferFrom(self, addresss, address2, value):
        if not self.conn.isLock() and self.conn.isRunning():
            self.conn.call(net.contract_address, 'transferFrom', address, address2, value)
            return True
        return False
    

