"""

hash.py - Holds the necessary wrapper classes to provide a simple but yet powerful array
of tools in dealing with private and public key operations.

eth_account - useful for key operations and account encryption without running an ethereum node.
"""


from eth_account import Account
from eth_account.messages import defunct_hash_message
from web3 import Web3

class Key:
    '''
        Class used to represent an ethereum json keyfile.
    '''
    def __init__(self,path = None):
        if path != None:
            self.load(path)

    def load(self,path):
        if 'keystore' in path:
            with open(path) as keyfile:
                self.keyFile = str(keyfile.read())
                self.lock = True
            return True
        else:
            print('File path does not contain \' keystore \'')
            return False

    def isLock(self):
        return self.lock

    def decrypt(self,passphrase):
        if self.keyFile != None:
            try:
                self.__privateKey = Account.decrypt(self.keyFile,passphrase)
                self.account = Account.privateKeyToAccount(self.__privateKey)
                self.address = self.account.address
            except:
                print('Wrong passphrase')
                return False
            else:
                self.lock = False
                return True

    def display(self):
        print('KeyFile (JSON): '+str(self.keyFile))
        #print('Private Key(HexBytes): '+str(self.__privateKey))

    def getPrivate(self):
        if self.lock == False:
            return self.__privateKey

def hashStr(msg):
    '''
    :param msg:
    :return:
    '''
    return defunct_hash_message(text=msg)
def hashBytes(n):
    return  defunct_hash_message(n)
def byte32(val):
    '''

    :param val:(HexBytes)
    :return:
    '''
    return Web3.toHex(Web3.toBytes(val).rjust(32, b'\0'))


def format(signObj):
    '''
    Formats a web3py signature object to be sent to a solidity contract.
    :param signObj:
    :return: Tuple with
    '''
    return (Web3.toHex(signObj.messageHash),signObj.v,byte32(signObj.r),byte32(signObj.s))


def decode(hexMsg,hexSig):
    '''
    If the hex string messages and signature are provided.
    This returns a tuple with hexMsg ,v,r and s.
    All values besides v should be hex Strings
    :param hexMsg:
    :param hexSig:
    :return:
    '''
    msgHash = defunct_hash_message(hexstr=hexMsg)
    hexMsgHash = Web3.toHex(msgHash)
    sig = Web3.toBytes(hexstr=hexSig)
    v, hex_r, hex_s = Web3.toInt(sig[-1]), Web3.toHex(sig[:32]), Web3.toHex(sig[32:64])
    return (hexMsgHash,v,hex_r,hex_s)
def sha3txt(n):
    return Web3.sha3(text=n)

def soliditySha3(types,values):
    '''
    :param types: list of solidity types(strings)
    :param values: list of values to hash (solidity primitives)
    :return: Hash of values.(HexBytes)
    '''
    return Web3.soliditySha3(types,values)
def eth_sign(msg):
    '''

    :param msg:
    :return:
    '''
    return soliditySha3(['string','bytes32'],["\x19Ethereum Signed Message:\n32", msg])
