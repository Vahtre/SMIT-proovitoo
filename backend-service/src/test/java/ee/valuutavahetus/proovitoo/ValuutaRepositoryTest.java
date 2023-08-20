package ee.valuutavahetus.proovitoo;

import ee.valuutavahetus.proovitoo.entity.Valuuta;
import ee.valuutavahetus.proovitoo.repository.ValuutaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ValuutaRepositoryTest {

    @Mock
    private ValuutaRepository valuutaRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindByNimetus_ExistingNimetus_ShouldReturnValuuta() {
        Valuuta valuuta = new Valuuta("USD", 1.0);
        when(valuutaRepository.findByNimetus("USD")).thenReturn(Optional.of(valuuta));

        Optional<Valuuta> result = valuutaRepository.findByNimetus("USD");

        assertTrue(result.isPresent());
        assertEquals(valuuta, result.get());
    }

    @Test
    public void testFindByNimetus_NonexistentNimetus_ShouldReturnEmptyOptional() {
        when(valuutaRepository.findByNimetus("Dollar")).thenReturn(Optional.empty());

        Optional<Valuuta> result = valuutaRepository.findByNimetus("Dollar");

        assertFalse(result.isPresent());
    }

    @Test
    public void testFindAll_ShouldReturnListOfValuutas() {
        List<Valuuta> valuutas = new ArrayList<>();
        valuutas.add(new Valuuta("Euro", 1.0));
        valuutas.add(new Valuuta("Dollar", 1.2));

        when(valuutaRepository.findAll()).thenReturn(valuutas);

        List<Valuuta> result = valuutaRepository.findAll();

        assertEquals(valuutas.size(), result.size());
        assertEquals(valuutas, result);
    }

    @Test
    public void testSaveValuuta_ShouldReturnSavedValuuta() {
        Valuuta valuutaToSave = new Valuuta("Euro", 1.0);
        Valuuta savedValuuta = new Valuuta("Euro", 1.0);
        savedValuuta.setId(1L);

        when(valuutaRepository.save(valuutaToSave)).thenReturn(savedValuuta);

        Valuuta result = valuutaRepository.save(valuutaToSave);

        assertNotNull(result.getId());
        assertEquals(savedValuuta.getNimetus(), result.getNimetus());
        assertEquals(savedValuuta.getKurss(), result.getKurss());
    }
}
