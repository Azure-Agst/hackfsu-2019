"""
Author: Christopher Holder
eth.py - Manages the connections between the Ethereum Node and the program through
a Web3py wrapper.
"""
import os
import time
import sqlite3
import pickle
import datetime
import logging
import exc

from abc import ABC
from solc import compile_source
from web3 import Web3,HTTPProvider,IPCProvider,middleware
from web3.middleware import geth_poa_middleware
from hash import Key,byte32,hashStr


cwd = os.getcwd().split('/')
cwd.pop()
cwd.append('res')
cwd.append('solidity')
cwd.append('')
solpath = '/'.join(cwd)
netIds = {'main':1,'morden':2,'ropsten':3,'rinkeby':4,'kovan':42,'sokol':77,'core':99}


#TODO: Time in between waiting for server to response.
#TODO: Provide richer information when returning.

class Connection(ABC):
    '''
    Base class for the different type of connections with the Ethereum network.
    Not meant to be instantiated by itself.
    '''
    def __init__(self, type, network):
        self.type = type
        self.network = network
        self.running = False
        self.lock = True
        self.key = Key()
        self.conn = sqlite3.connect('../res/nim.db')
        self.c = self.conn.cursor()
        self.c.execute('CREATE TABLE IF NOT EXISTS Deployed (address STRING UNIQUE,filename STRING,contractObj BLOB,dat datetime)')
        self.conn.commit()

    def __call__(self, *args, **kwargs):
        try:
            if self.type == 'infura':
                self.web3 = Web3(HTTPProvider('https://' + self.network + '.infura.io/v3/' + self.token))
                if self.network == 'rinkeby':
                    self.web3.middleware_stack.inject(geth_poa_middleware, layer=0)
            elif self.type == 'local' or self.type =='ipc':
                #Default location for geth.
                self.web3 = Web3(IPCProvider())
            self.time = time.asctime(time.localtime())
        except Exception as e:
            print(e + ' ' + str(type(e)))
            raise exc.Connection('__call__')
        else:
            #print('...Connection established with the ' + self.network + ' Ethereum network')
            print('...Connection established with the ' + self.network + ' Ethereum network')
            if self.web3.isConnected():
                #print('...Active connection at : ' + self.time)
                print('...Active connection at : ' + self.time)
                self.running = True
                return True


    #Alias to the () operator, and guarantees a boolean value.
    def run(self):
        if self.__call__():
            return True
        else:
            return False
    #Loads key from given path
    def isLock(self):
        return self.lock

    def isRunning(self):
        return self.running

    def loadKey(self,path):
        self.web3.eth.enable_unaudited_features()
        self.key.load(path)

    def decryptKey(self,path,passphrase):
        '''
        :param path: Path to json keyfile.
        :param passphrase: Decrypts keyfile.
        :return: Decrypts keyfile(JSON) with passphrase.
        TODO: Handle exceptions better here.
        '''
        #Deprecated
        #self.web3.eth.enable_unaudited_features()
        self.key.load(path)
        self.key.decrypt(passphrase)
        self.address = self.key.address
        self.lock = False
    def wait_for_receipt(self, tx_hash, poll_interval):
        '''
        :param tx_hash: Transaction hash(bytes?)
        :param poll_interval: Seconds to wait per in-between fetching.
        :return: Transaction Receipt.
        '''
        while True:
            tx_receipt = self.web3.eth.getTransactionReceipt(tx_hash)
            if tx_receipt:
                print('...Transaction mined.')
                return tx_receipt
            print('...Pending Transaction')
            time.sleep(poll_interval)

    def signStr(self,s):
        '''
        :param s: String
        :return: Signature object of s
        '''
        #TODO: Review correct hashing.
        return self.web3.eth.account.signHash(hashStr(s), private_key=self.key.getPrivate())

    def signHash(self,msgHash):
        '''
        :param msgHash:
        :return: Signature object of the message hash.
        '''
        return self.web3.eth.account.signHash(msgHash, private_key=self.key.getPrivate())

    def whoSign(self,msgHash,signature):
        '''
        :param msgHash: Hashed message.
        :param signature: Hex String or Hex Bytes
        :return: Address of signer
        '''
        return self.web3.eth.account.recoverHash(msgHash, signature=signature)

    def getBalance(self):
        return self.web3.fromWei(self.web3.eth.getBalance(self.address), 'ether')

    def searchContract(self,filename):
        '''

        :param filename: name of the solidity filename.(String)
        :return:
        '''
        self.c.execute('SELECT address FROM Deployed WHERE filename = ? ORDER BY dat DESC',(filename,))
        data = self.c.fetchone()
        if data == None:
            raise exc.ContractNotDeployed('searchContract(' + filename+')')
        return data[0]

class Infura(Connection):
    '''
    Child class to connection, customized for interaction with Infura nodes.
    '''
    def __init__(self,network,token):
        Connection.__init__(self,'infura', network)
        self.token = token

    def send(self, to, value, price=6):
        '''
        :param to: Hex string of payment receiver.
        :param value: Value in Ether
        :param price: Price of gas
        :return: Receipt of the transaction.
        '''
        # Gas estimation also depends on the specified ethereum network

        nonce = self.web3.eth.getTransactionCount(self.key.address)
        gas = self.web3.eth.estimateGas({'to': to, 'from': self.key.address, 'value': Web3.toWei(value, 'ether')})
        trans = {'to': to,'value': Web3.toWei(value, 'ether'),
                'gas': gas,'gasPrice': Web3.toWei(price, 'gwei'),
                'nonce': nonce,'chainId': netIds[self.network]}

        #self.web3.eth.enable_unaudited_features()
        signObj = self.web3.eth.account.signTransaction(trans, self.key.getPrivate())
        try:
            txnHash = self.web3.eth.sendRawTransaction(signObj.rawTransaction)
        except Exception as e:
            print(e + ' ' + str(type(e)))
        else:
            return self.wait_for_receipt(byte32(txnHash), 10)


    def deploy(self, path, *arg, price=4, value=0):
        '''
        Deploys a solidity source file and returns the address of the contract.
        Also stores the serialized compile object on a sql database.
        '''
        # self.c.execute('SELECT address FROM Deployed WHERE address = ?', (contractAddress,))

        solname = path
        path = solpath + path
        f = open(path, 'r')
        compiled_sol = compile_source(f.read())
        f.close()
        contractName, contract_interface = compiled_sol.popitem()
        blob = pickle.dumps(contract_interface)
        bin, abi = contract_interface['bin'], contract_interface['abi']
        contract = self.web3.eth.contract(abi=abi, bytecode=bin)
        nonce = self.web3.eth.getTransactionCount(self.key.address)

        trans ={'gasPrice': Web3.toWei(price, 'gwei'),'value':Web3.toWei(value, 'ether'),
                'nonce':nonce,'chainId':netIds[self.network],'from':self.address}
        if arg == None:
            txn = contract.constructor().buildTransaction(trans)
        else:
            txn = contract.constructor(*arg).buildTransaction(trans)

        print('Cost of deployment: ' + str( self.web3.fromWei(txn['gasPrice'] * txn['gas'] + txn['value'],'ether')  ) +' ETH' )

        signObj = self.web3.eth.account.signTransaction(txn, self.key.getPrivate())

        try:
            txnHash = self.web3.eth.sendRawTransaction(signObj.rawTransaction)
        except ValueError as e:
            print(type(e.args[0]))

        txnHash = byte32(txnHash)

        address = self.wait_for_receipt(txnHash, 10)['contractAddress']

        entry = (address, solname, blob,datetime.datetime.now())
        self.c.execute('INSERT INTO Deployed(address,filename,contractObj,dat) VALUES (?,?,?,?)', entry)
        self.conn.commit()
        return address

    def call(self, contractAddress, methodName, *arg, price=4, value=0):
        '''
        Broadcasts a method call transaction to the network.
        :param contractAddress: HexString address of a contract deployed through Nim.
        #TODO: Let people load their own abi ?
        :param methodName: (string)
        :param arg: Respective arguments for the method
        :param price: (unsigned int) price in gwei for gas
        :param value: (ether)value for the transaction in ether.
        :return: tuple with locally calculated return value at [0] and transaction receipt at [1].
        '''
        self.c.execute('SELECT contractObj FROM Deployed WHERE address = ?', (contractAddress,))
        data = self.c.fetchone()
        if data == None:
            raise exc.ContractNotDeployed('Infura.call()')
        interface = pickle.loads(data[0])
        contract = self.web3.eth.contract(abi=interface['abi'], bytecode=interface['bin'], address=contractAddress)
        #print(contract.functions.__dict__.keys())
        if methodName not in contract.functions.__dict__.keys():
            raise exc.MethodNotDefined('Infura.call()')
        if methodName == 'fallback':
            func = contract.functions.fallback
        else:
            func = contract.functions.__dict__[methodName]

        counter = 0
        b = True
        while True:
            try:
                counter += 1
                nonce = self.web3.eth.getTransactionCount(self.key.address)
                trans = {'gasPrice': Web3.toWei(price, 'gwei'), 'value': Web3.toWei(value, 'ether'),
                         'nonce': nonce, 'chainId': netIds[self.network],'from':self.address,'gas':90000}
                txn = func(*arg).buildTransaction(trans)


            except ValueError as e:
                raise exc.TransactionBuild('Infura.call()')
            else:
                print('Cost of method calling : ' + str(self.web3.fromWei(txn['gasPrice'] * txn['gas'] + txn['value'], 'ether')) + ' ETH')
                signObj = self.web3.eth.account.signTransaction(txn, self.key.getPrivate())
                txnHash = byte32(self.web3.eth.sendRawTransaction(signObj.rawTransaction))
                return (func(*arg).call(), self.wait_for_receipt(txnHash, 10))




