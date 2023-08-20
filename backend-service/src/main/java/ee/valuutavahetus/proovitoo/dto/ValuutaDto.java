package ee.valuutavahetus.proovitoo.dto;

import ee.valuutavahetus.proovitoo.entity.Valuuta;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ValuutaDto {
    private Long id;
    private double kurss;
    private String nimetus;

    public static ValuutaDto from(Valuuta valuuta){
        return ValuutaDto.builder().build();
    }
}
