def dp_max_profit(A):
    bestProfit = 0
    bestStock = -1
    bestBuyDay = -1
    bestSellDay = -1
    for i in range(len(A)): # For each stock
        minPrice = A[i][0]
        minDay = 0
        for j in range(1, len(A[i])): # From Day 1 onward
            if A[i][j] < minPrice:
                minPrice = A[i][j]
                minDay = j
                currentProfit = A[i][j] - minPrice
                if currentProfit > bestProfit:
                bestProfit = currentProfit
                bestStock = i
                bestBuyDay = minDay
                bestSellDay = j
                return (bestStock, bestBuyDay, bestSellDay, bestProfit)