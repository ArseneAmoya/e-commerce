''' Note :
 Bien que ici l'algo permet de trouver un minimum en une seule itération, la fonction de voisinage est très complexe et peut être optimisée.
     Je n'ai pas passé assez de temps sur l'exercice pouvant me permetre de trouver une fonction convexe sans minimum local. On ramène juste toutes les permutations comme voisin'''



import random as rm
import itertools
# Commencer avec moins de deux dames sur une ligne et une colone
def initier():
    n = rm.sample(range(1,9),8)
    return n

def conflits(liste):
    cpt = 0 
    for i in range(len(liste)-1):
        for j in range(len(liste)-1):
            if(abs(liste[i]-liste[j])==abs(i-j) and (i!=j)):
                cpt = cpt +1
            if((liste[i] == liste[j]) and (i!=j)):
                cpt = cpt +1
    return cpt                   


def voisinage(liste):
    voisin = []
    taille = len(liste)
    for i in itertools.permutations(range(1,taille+1), 8):
        m = list(i)
        voisin.append(m)
    return voisin



def main():
    print("*********************Résolution de l'algo des 8 reines********************")
    print('Depart :')
    list_deb = initier()
    print("\t{}".format(list_deb))
    c = conflits(list_deb)
    print("\tcout: {}".format(c))

    v = voisinage(list_deb)
    i = 1
    while(True):
        print('Iteration  n° {}'.format(i))
        couts = []
        voisins = v
        for voisin in voisins:
            cout = conflits(voisin)
            print("Voisin {} : \n\tcout : {}".format(voisin, cout))
            couts.append(cout)

        min_des_couts = min(couts)
        index_voisin_min_cout = int(couts.index(min_des_couts))
        mel_pos = list(voisins[index_voisin_min_cout])
        i =i + 1 
        if(conflits(mel_pos)<conflits(list_deb)):
            print("La valeur optimale est",mel_pos, "de cout ",conflits(mel_pos))
            list_deb = mel_pos
        else:
            print("La valeur optimale est",mel_pos, "de cout ",conflits(mel_pos))
            break


if __name__ == "__main__":
    main()
    pass


''' Bien que ici l'algo permet de trouver un minimum en une seule itération, la fonction de voisinage est très complexe et peut être optimisée.
     Je n'ai pas passé assez de temps sur l'exercice pouvant me permetre de trouver une fonction convexe sans minimum local. On ramène juste toutes les permutations'''
