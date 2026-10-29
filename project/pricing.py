"""SurvivalBase pricing rule: the lowest x.90 retail price (VAT included) that keeps
net margin >= 30% of net revenue AND >= EUR 3 per unit.

net revenue = price / 1.21 (Belgian VAT)
net margin  = net revenue - supplier price - payment fee (2% + EUR 0.25)
Not included: ads, returns, Shopify plan, non-recoverable import VAT. Keep supplier price
= the variant actually sold (not the cheapest "from" price) and shipping if not free.

Usage: python3 project/pricing.py 258.26 1.14 ...   (supplier prices in EUR)
"""
import math, sys

VAT, FEE_PCT, FEE_FIX = 1.21, 0.02, 0.25
MIN_PCT, MIN_EUR = 0.30, 3.0


def margin(price, cost):
    net = price / VAT
    return net - cost - price * FEE_PCT - FEE_FIX, net


def price_for(cost):
    p = max((cost + FEE_FIX) / ((1 - MIN_PCT) / VAT - FEE_PCT),
            (cost + FEE_FIX + MIN_EUR) / (1 / VAT - FEE_PCT))
    p = math.floor(p) + 0.9
    while (lambda m, n: m < MIN_PCT * n - 1e-9 or m < MIN_EUR - 1e-9)(*margin(p, cost)):
        p += 1
    return round(p, 2)


if __name__ == '__main__':
    assert price_for(1.14) == 5.9 and price_for(258.26) == 462.9  # self-check
    for c in map(float, sys.argv[1:]):
        p = price_for(c); m, n = margin(p, c)
        print(f'supplier {c:.2f} -> price {p:.2f}  margin {m:.2f} ({m / n:.0%})')
