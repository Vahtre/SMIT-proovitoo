# VALUUTAVAHETUS Projekt

## Kasutusel:

- **FE:** React 18.2.0 + TypeScript 3.9.10
    - Kasutatud koodi stiliseerimise tööriistu: eslint + prettier
- **BE:** Spring Boot 2.7.1, Java 17
    - Autoriseerimine OAuth 2.0-ga
    - Andmebaas: PostgreSQL Dockeris
    - Testid: JUnit
- **DB:** PostgreSQL Dockeris pordil 5432

## Projekti käivitus:

Eeldusena peaksid olema installitud järgmised tööriistad: npm, Java 17, Docker Desktop(vajab Hyper-v lubamist), Maven.

1. **Esmalt ehitada Dockeriga andmebaas:**
    - Mine `backend-service` kausta ja käivita järgmine käsk: `docker-compose up -d`.
    - See käivitab Dockeris PostgreSQL andmebaasi, mis kuulab pordil 5432.

2. **Käivita Spring Boot BE teenus:**
    - Mine `backend-service` kausta.
    - Käivita järgnevad käsud: `mvn compile` ja `mvn package`.
    - Selle käigus luuakse `/target` kausta `proovitoo-0.0.1-SNAPSHOT.jar` fail.
    - Käivita teenus `/target` kaustas, selle käivitamiseks kasutada käsku: `java -jar proovitoo-0.0.1-SNAPSHOT.jar`.
    - BE teenus käivitub pordil 8080.

3. **Käivita FE teenus:**
    - Liigu kausta `/frontend-service/valuutavahetus`.
    - Esialgsel käivitamisel installeeri kõik paketid käskudega: `npm install`.
    - Käivita teenus käskudega: `npm start`.
    - FE teenus käivitub pordil 3000.

Nüüd peaksid olema valmis kasutama VALUUTAVAHETUS projekti nii frontendis kui ka backendis.

## BE testide käivitus:

1 **Käivitamine**
    - Mine `backend-service` kausta.
    - Käivita käsk: `mvn test`.
    - See käivitab kõik backendi testid ja kuvab tulemused konsoolis.
    - Testid hõlmavad AINULT äriloogilisi protsesse, seetõttu pole kasutatud ka FE teste.

## Kasutusjuhend:
1. **Tavakasutaja**
    - Saab / lehel valida valuuta ja konventeerida selle teise valuutasse või konventeerida valitud valuuta eurodesse
2.  **Admin kasutaja**
    - Saab lisada, muuta ja eemaldada valuutasid, valuutasid saab importida ka "Lae andmed nupuga", sellega laetakse Eesti Panga APIst kõige viimased andmed. Lisaks saab lisada uusi admin kasutajaid