import sys

def solve(n: int, b: int, a: list) -> int:
    INF = float('inf')
    K = (n + 1) // 2  
    
    
    f = [INF] * (K + 1)
    g = [INF] * (K + 1)
    f[0] = 0  # 0 packets seen, 0 picked, "last not picked" trivially true
    
    for i in range(n):
        nf = [INF] * (K + 1)
        ng = [INF] * (K + 1)
        for k in range(K + 1):
           
            v = f[k] if f[k] < g[k] else g[k]
            if v < nf[k]:
                nf[k] = v
            
            if k >= 1 and f[k-1] != INF:
                cand = f[k-1] + a[i]
                if cand < ng[k]:
                    ng[k] = cand
        f, g = nf, ng
    
    
    ans = 0
    for k in range(K + 1):
        best = f[k] if f[k] < g[k] else g[k]
        if best <= b:
            ans = k
    return ans


if __name__ == "__main__":
    try:
        data = sys.stdin.read().split()
        idx = 0
        n = int(data[idx]); idx += 1
        b = int(data[idx]); idx += 1
        a = [int(data[idx + i]) for i in range(n)]
        result = solve(n, b, a)
        print(result)
    except (EOFError, ValueError, IndexError):
        pass
