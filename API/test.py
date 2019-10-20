'''
    test-py - runs infrastructure and connection tests.
'''

import sys
import unittest


sys.path.insert(0,'../nim')

from net import Infura
from verifier import SimpleCheck
from hash import soliditySha3,byte32

solpath = '/home/abzu/PycharmProjects/Nim/res/solidity/'
token = 'n9LBfW1SzRzIjZfK5MfC'
newtoken = '9324c0d26478447aa2ccc26377e86dc7'
path = '/home/abzu/.ethereum/rinkeby/keystore/UTC--2018-06-29T15-24-00.421088464Z--7f039dee9c7d69db4009089d60b0eb5f355c3a81'
path2 = '/home/abzu/.ethereum/rinkeby/keystore/UTC--2018-07-23T14-16-06.281040785Z--030f7f7cc2689d4787a791501226680570d77372'

'''
if len(sys.arg)==0:
    print('Usage: \'python3 test.py [Option] [InfuraToken] \'')
    print('Options: [--fast] - Covers selected testing.')
    print('         [--]')
'''

testType = 'slow'

class InfuraTest(unittest.TestCase):
    def setUp(self):
        self.A = Infura('rinkeby', newtoken)
        self.B = Infura('rinkeby', newtoken)
        self.assertTrue(self.A.run())
        self.assertTrue(self.B.run())
        self.A.decryptKey(path, 'hola123')
        self.B.decryptKey(path2, 'hola123')
        self.assertTrue(not self.A.isLock())
        self.assertTrue(not self.B.isLock())
    @unittest.skipIf(testType == 'fast','Takes some time.')
    def test_hash(self):
        print('...test_hash()')

        stri = 'this is a test'

        sign = self.A.signStr(stri)
        self.assertEqual(self.A.address, self.A.whoSign(sign.messageHash, sign.signature))
        print("...Local string hashing test passed.")
        print("...Recover signer from signature obj test passed.")

        address = self.A.deploy('test3.sol')

        print("...test3.sol contract deployed")
        
        a = self.B.call(address,'hash',4)[0]
        b = soliditySha3(['uint256'], [4])
        self.assertEqual(a, b)

        hash1 = self.B.call(address, 'hashSenderAddress')[1]['logs'][0]['data']
        hash2 = byte32(soliditySha3(['address'], [self.B.address]))
        rAddress = self.B.call(address, 'returnAddress')[1]
        rAddress =rAddress['logs'][0]['data']

        print("msg.sender(Event): "+ str(rAddress))
        print("msg.sender(self.B.address): " +self.B.address)
        print("Calculated Hash of address(EVM event): "+str(hash1))
        print("Web3Py calculated byte32(keccak256(address)): "+ hash2)

        self.assertEqual(hash1,hash2)

        hash3 = self.B.call(address,'hashSpecial',10,3)[1]['logs'][0]['data']
        hash4 = byte32(soliditySha3(['address','uint256','uint256','address'], [self.B.address,10,3,address]))
        print("EVM keccak256(msg.sender,amount,nonce,this): " + str(hash3))
        print('Web3Py calculated byte32(print("EVM keccak256(msg.sender,amount,nonce,this))'+ hash4)
        self.assertEqual(hash3, hash4)
        print()

    @unittest.skipIf(testType == 'fast','Reduces Ether in account and is slow.')
    def test_send(self):
        print('...Testing ether transactions.')
        amount = 0.2
        balA = self.A.getBalance()
        balB = self.B.getBalance()
        self.A.send(self.B.address, amount)
        balA2 = self.A.getBalance()
        balB2 = self.B.getBalance()
        self.assertTrue((float(balA2) + amount) < balA)
        self.assertTrue(balB2 > balB)
        print()

    @unittest.skipIf(testType == 'fast','Reduces Ether in account and is slow.')
    def test_deploy(self):
        #Checks that a contract can be deployed, tests whether a value can be attached.
        print('...test_deploy()')
        balA = self.A.getBalance()
        print('A: ' + str(balA) + ' ' + self.A.address)
        address = self.A.deploy('greeter.sol', 'hi', value=0.15)
        print('A deployed contract at ' + address)
        balA2 = self.A.getBalance()
        print('A: ' + str(balA2) + ' ' + self.A.address)
        self.assertTrue(type(address) == str)
        self.assertTrue((float(balA2) + 0.15) < balA)
        print()

    @unittest.skipIf(testType == 'fast', 'Reduces Ether in account and is slow.')
    def test_methods(self):
        print('...test_methods()')
        balA = self.A.getBalance()
        balB = self.B.getBalance()
        print('A: ' + str(balA) + ' ' + self.A.address)
        print('B: ' + str(balB) + ' ' + self.B.address)
        address = self.A.deploy('test.sol',  value=0.2)
        balA2 = self.A.getBalance()
        print('A: ' + str(balA2) + ' ' + self.A.address)
        print('A deployed contract at '+ address)
        self.assertTrue(float(balA2) + 0.2 < balA)
        self.B.call(address, 'getBalance',5)
        balB2 = self.B.getBalance()
        print('B called getBalance(5)')
        self.assertTrue((float(balB2) + 0.2) > balB)
        self.assertTrue(balB2 > balB)
        print('A: ' + str(balA2) + ' ' + self.A.address)
        print('B: ' + str(balB2) + ' ' + self.B.address)
        print()


    @unittest.skipIf(testType =='fast','Reduces Ether in account')
    def test_check(self):
        print('...test_check()')
        balA = self.A.getBalance()
        print('A: ' + str(balA) + ' ' + self.A.address)
        check = SimpleCheck(self.A)
        check2 = SimpleCheck(self.B)

        receipt = check.write(self.B.address, 0.2)
        balB = self.B.getBalance()
        print('B: ' + str(balB) + ' ' + self.B.address)
        message = check2.claim(receipt)

        balB2 = self.B.getBalance()
        print('B: ' + str(balB2) + ' ' + self.B.address)
        self.assertTrue(balB2 > balB)


if __name__ == '__main__':
    unittest.main()


