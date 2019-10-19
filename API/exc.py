'''
exc.py - Defines the exceptions for the interactions in the framework.
'''

class MethodNotDefined(Exception):
    def __init__(self,method):
        self.par = 'Method Not Defined Exception : '+ method
    def __str__(self):
        return self.par

class TimedOutException(Exception):
    def __init__(self,method):
        self.par = 'Timed Out Exception : '+method
    def __str__(self):
        return self.par
class ContractNotDeployed(Exception):
    def __init__(self,method):
        self.par = 'Contract Not Deployed Exception: '+ method
    def __str__(self):
        return self.par
class TransactionBuild(Exception):
    def __init__(self,method):
        self.par = 'Transaction Building Exception : '+method
    def __str__(self):
        return self.par

class InvalidDecryption(Exception):
    def __init__(self,method):
        self.par = 'Invalid Decryption Exception : ' + method
    def __str__(self):
        return self.par
class SendRawTransaction(Exception):
    def __init__(self,method):
        self.par = 'Send Raw Transaction Exception : ' + method
    def __str__(self):
        return self.par
class Connection(Exception):
    def __init__(self,method):
        self.par = 'Connection Exception : ' + method
    def __str__(self):
        return self.par
class LockedConnection(Exception):
    def __init__(self,method):
        self.par = 'Lock Exception : ' + method
    def __str__(self):
        return self.par
