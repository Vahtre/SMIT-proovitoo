package ee.valuutavahetus.proovitoo;

import ee.valuutavahetus.proovitoo.entity.Valuuta;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ValuutaTest {

    private Valuuta valuuta;

    @BeforeEach
    public void setUp() {
        valuuta = new Valuuta("Euro", 1.0);
    }

    @Test
    public void testId() {
        assertNull(valuuta.getId());
    }

    @Test
    public void testNimetus() {
        assertEquals("Euro", valuuta.getNimetus());
    }

    @Test
    public void testKurss() {
        assertEquals(1.0, valuuta.getKurss(), 0.01);
    }

    @Test
    public void testEqualsAndHashCode() {
        Valuuta sameValuuta = new Valuuta("Euro", 1.0);
        Valuuta differentValuuta = new Valuuta("Dollar", 1.2);

        assertTrue(valuuta.equals(sameValuuta));
        assertFalse(valuuta.equals(differentValuuta));
        assertEquals(valuuta.hashCode(), sameValuuta.hashCode());
    }

    @Test
    public void testToString() {
        String expectedToString = "Valuuta(id=null, nimetus=Euro, kurss=1.0)";
        assertEquals(expectedToString, valuuta.toString());
    }
}