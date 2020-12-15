# HomeCheck [![Build Status](https://travis-ci.com/Momofil31/HomeCheck.svg?token=v4JAMQm2FEcxyRNfpHAb&branch=master)](https://travis-ci.com/Momofil31/HomeCheck)
Repository contentente il progetto per il corso di Ingegneria del Software 2 @Unitn.

Questo progetto consiste in un API RestFul scritta in linguaggio Javascript con il framework Express e di un applicazione web scritta in Javascript con il framework Vue.

L'app è disponibile al link: http://homecheck-vue.herokuapp.com

## How to demo
Per testare in locale l'applicazione per prima cosa clonare il repository e fare checkout sul branch develop. (Quest'ultima operazione è necessaria in quanto sul branch master è settato il basePath dell'API da utilizzare su heroku)

```git clone https://github.com/Momofil31/HomeCheck/```

In un terminale installare le dipendenze ed eseguire il server Express

```cd server```

```npm install```

```npm run start:dev```

In un altra finestra del terminale installare le dipendenze ed eseguire l'applicazione Vue
  
```cd client/homecheck-vue```

```npm install```

```npm run serve```

L'API è raggiungibile all'indirizzo ```localhost:3000/```

L'applicazione Vue è raggiungibile all'indirizzo ```localhost:8080/```

Per eseguire i test lanciare jest mediante

```cd server```

```npm test```
