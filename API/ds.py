import heapq

class PriorityQueue:
    def __init__(self):
        self.q = []
        heapq.heapify(self.q)
        self.order = 0
    def push(self, val, n):
        heapq.heappush(self.q,(val, self.order, n))
        self.order += 1
    def pop(self):
        val = heapq.heappop(self.q)
        return (val[0], val[2])
    def peek(self):
        val = self.q[0]
        return (val[0], val[2])
    def is_empty(self):
        if not self.q: return True
        return False
