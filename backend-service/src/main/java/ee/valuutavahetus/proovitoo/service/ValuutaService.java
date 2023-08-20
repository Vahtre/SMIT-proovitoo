package ee.valuutavahetus.proovitoo.service;

import ee.valuutavahetus.proovitoo.dto.ValuutaDto;
import ee.valuutavahetus.proovitoo.entity.Valuuta;
import ee.valuutavahetus.proovitoo.repository.ValuutaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
@Slf4j
public class ValuutaService {

    private final ValuutaRepository valuutaRepository;

    @Autowired
    public ValuutaService(ValuutaRepository valuutaRepository) {
        this.valuutaRepository = valuutaRepository;
    }

    public List<Valuuta> getAllValuutas(){
        List<Valuuta> result = this.valuutaRepository.findAll();
        log.info("Leidsin andmebaasist valuutad: {}" + result);
        return result;
    }

    public List<ValuutaDto> updateValuutas(List<ValuutaDto> input){
        List<ValuutaDto> returnList = new ArrayList<>();

        if (input != null) {
            log.info("Pärin andmeid andmebaasist");
            //All from db
            List<Valuuta> existingValuutas = valuutaRepository.findAll();

            for (ValuutaDto valuutaDto : input) {
                Optional<Valuuta> existingValuuta = existingValuutas.stream()
                        .filter(valuuta -> valuuta.getNimetus().equals(valuutaDto.getNimetus()))
                        .findFirst();

                if (existingValuuta.isPresent()) {
                    log.info("Muudan andmebaasis olemasolevat valuutat");
                    Valuuta dbValuuta = existingValuuta.get();
                    dbValuuta.setKurss(valuutaDto.getKurss());
                    valuutaRepository.save(dbValuuta);
                    returnList.add(ValuutaDto.builder()
                            .id(dbValuuta.getId())
                            .nimetus(dbValuuta.getNimetus())
                            .kurss(dbValuuta.getKurss())
                            .build());
                } else {
                    log.info("Valuutat polnud andmebaasis, lisan uue valuuta");
                    Valuuta newValuuta = new Valuuta();
                    newValuuta.setNimetus(valuutaDto.getNimetus());
                    newValuuta.setKurss(valuutaDto.getKurss());
                    Valuuta savedValuuta = valuutaRepository.save(newValuuta);
                    returnList.add(ValuutaDto.builder()
                            .id(savedValuuta.getId())
                            .nimetus(savedValuuta.getNimetus())
                            .kurss(savedValuuta.getKurss())
                            .build());
                }
            }

            //Delete db records that are not in input
            log.info("Eemaldan andmebaasist kustutatud andmed");
            existingValuutas.forEach(existingValuuta -> {
                boolean existsInInput = input.stream()
                        .anyMatch(valuutaDto -> valuutaDto.getNimetus().equals(existingValuuta.getNimetus()));
                if (!existsInInput) {
                    valuutaRepository.delete(existingValuuta);
                }
            });
            log.info("Tagastan salvestatud andmed");
            return returnList;
        } else {
            log.info("Päringu sisu oli puudulik");
            return null;
        }
    }

    public List<ValuutaDto> getValuutasFromEP(){
        HttpResponse<String> response;
        try {
            log.info("Ehitan päringut Eesti panga API-le");
            URI uri = URI.create("https://www.eestipank.ee/api/get");
            String requestBody = "{\"url\": \"et/rest/currency_rates\"}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            response = java.net.http.HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());
            log.info("Sain Eesti Panga API-lt vastuse: {}" + response);
            List<ValuutaDto> result = convertResponseToValuutaDtoList(response.body());
            log.info("Tagastan Eesti Panga andmete päringu ValuutaDto objektidena: {}" + result);
            return result;

        } catch (Exception e) {
            log.info("Viga päringu tegemisel");
            e.printStackTrace();
        }
        return null;
    }

    private static List<ValuutaDto> convertResponseToValuutaDtoList(String responseBody) {
        log.info("Konventeerin Eesti Panga vastuse ValuutaDto-ks");
        List<ValuutaDto> result = new ArrayList<>();
        Set<String> addedCurrencyCodes = new HashSet<>();

        try (JsonReader jsonReader = Json.createReader(new StringReader(responseBody))) {
            JsonObject jsonObject = jsonReader.readObject();
            JsonObject rates = jsonObject.getJsonObject("rates");

            rates.keySet().forEach(currencyCode -> {
                JsonArray currencyArray = rates.getJsonArray(currencyCode);
                JsonObject lastCurrencyObject = currencyArray.getJsonObject(currencyArray.size() - 1);

                double rate = Double.parseDouble(lastCurrencyObject.getString("rate"));

                if (!addedCurrencyCodes.contains(currencyCode)) {
                    ValuutaDto valuutaDto = ValuutaDto.builder()
                            .nimetus(currencyCode)
                            .kurss(rate)
                            .build();
                    result.add(valuutaDto);
                    addedCurrencyCodes.add(currencyCode);
                }
            });
        } catch (Exception e) {
            log.info("Ei suutnud vastust konventeerida");
            e.printStackTrace();
        }

        return result;
    }
}
