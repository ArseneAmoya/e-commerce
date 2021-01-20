import pandas as pd
from operator import itemgetter

chiffre = "vcfgrwqwfsbhfsntowbsobgfsbhfsnqvsnjcigsghqsoixcifrviwtshseicubsgojsnjcigdogeisjcigoihfsgofhwgobgjeigbsrsjsnqwfqizsfrobgzsgfisgzsgxcifgcijfopzsgeiojsqzsggwubsgrsjchfsdfctsggwcbdofzseiszsghhcbashwsf"

lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
count = []

for lettre in lettres :
    i = 0
    for l in chiffre :
        if(l == lettre) : 
            i = i + 1
    count.append(i/len(chiffre))

data = pd.DataFrame([lettres, data], index=lettres, columns=['lettres', 'freq'])

print(count)
