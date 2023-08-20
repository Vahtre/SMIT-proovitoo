package ee.valuutavahetus.proovitoo;

import ee.valuutavahetus.proovitoo.dto.ValuutaDto;
import ee.valuutavahetus.proovitoo.entity.Valuuta;
import ee.valuutavahetus.proovitoo.repository.ValuutaRepository;
import ee.valuutavahetus.proovitoo.service.ValuutaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ValuutaServiceTest {

    @Mock
    private ValuutaRepository valuutaRepository;

    private ValuutaService valuutaService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        valuutaService = new ValuutaService(valuutaRepository);
    }

    @Test
    public void testGetAllValuutas() {
        List<Valuuta> valuutas = new ArrayList<>();
        valuutas.add(new Valuuta("Euro", 1.0));

        when(valuutaRepository.findAll()).thenReturn(valuutas);

        List<Valuuta> result = valuutaService.getAllValuutas();

        assertEquals(valuutas, result);
    }

    @Test
    public void testUpdateValuutas_AddNewValuuta() {
        List<ValuutaDto> input = new ArrayList<>();
        input.add(ValuutaDto.builder().nimetus("Euro").kurss(1.1).build());

        List<Valuuta> existingValuutas = new ArrayList<>();

        when(valuutaRepository.findAll()).thenReturn(existingValuutas);
        when(valuutaRepository.save(any(Valuuta.class))).thenReturn(new Valuuta("Euro", 1.1));

        List<ValuutaDto> result = valuutaService.updateValuutas(input);

        assertEquals(1, result.size());
        assertEquals("Euro", result.get(0).getNimetus());
        assertEquals(1.1, result.get(0).getKurss());
    }

    @Test
    public void testUpdateValuutas_UpdateExistingValuuta() {
        List<ValuutaDto> input = new ArrayList<>();
        input.add(ValuutaDto.builder().nimetus("Euro").kurss(1.1).build());

        List<Valuuta> existingValuutas = new ArrayList<>();
        existingValuutas.add(new Valuuta("Euro", 1.0));

        when(valuutaRepository.findAll()).thenReturn(existingValuutas);
        when(valuutaRepository.save(any(Valuuta.class))).thenReturn(new Valuuta("Euro", 1.1));

        List<ValuutaDto> result = valuutaService.updateValuutas(input);

        assertEquals(1, result.size());
        assertEquals("Euro", result.get(0).getNimetus());
        assertEquals(1.1, result.get(0).getKurss());
    }

}
