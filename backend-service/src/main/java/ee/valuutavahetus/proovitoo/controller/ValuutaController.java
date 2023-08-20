package ee.valuutavahetus.proovitoo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.valuutavahetus.proovitoo.dto.ValuutaDto;
import ee.valuutavahetus.proovitoo.repository.ValuutaRepository;
import ee.valuutavahetus.proovitoo.service.ValuutaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/valuuta")
public class ValuutaController {
    @Autowired
    ValuutaRepository valuutaRepository;

    private final ObjectMapper objectMapper;

    public ValuutaController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Autowired
    private ValuutaService valuutaService;




    @GetMapping("public/")
    public ResponseEntity getAllValuutasPublic() {
        log.info("Anonüümne kasutaja pärib valuutasid");
        return ResponseEntity.ok(valuutaService.getAllValuutas());
    }

    @GetMapping("/")
    public ResponseEntity getAllValuutasAdmin() {
        log.info("Admin kasutaja pärib valuutasid");
        return ResponseEntity.ok(valuutaService.getAllValuutas());
    }

    @GetMapping("/lae-andmed")
    public ResponseEntity<List<ValuutaDto>> getValuutasFromEP(){
        log.info("Admin kasutaja pärib andmeid Eesti Pangast");
        List<ValuutaDto> result = this.valuutaService.getValuutasFromEP();
        if(result != null){
            return ResponseEntity.ok(result);
        }else{
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/uuenda")
    public ResponseEntity<List<ValuutaDto>> updateValuutas(@RequestBody List<ValuutaDto> input) {
        log.info("Uuendan andmebaasi andmeid");
        List<ValuutaDto> result = this.valuutaService.updateValuutas(input);
        log.info("Tagastan väärtuse: {}" + result);
        if(result == null){
            ResponseEntity.badRequest();
        }
        return ResponseEntity.ok(result);
    }


}