package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.AbonosTestSamples.*;
import static sv.com.lc.controlac.domain.FacturasTestSamples.*;

import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class AbonosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abonos.class);
        Abonos abonos1 = getAbonosSample1();
        Abonos abonos2 = new Abonos();
        assertThat(abonos1).isNotEqualTo(abonos2);

        abonos2.setId(abonos1.getId());
        assertThat(abonos1).isEqualTo(abonos2);

        abonos2 = getAbonosSample2();
        assertThat(abonos1).isNotEqualTo(abonos2);
    }

    @Test
    void facturasTest() {
        Abonos abonos = getAbonosRandomSampleGenerator();
        Facturas facturasBack = getFacturasRandomSampleGenerator();

        abonos.setFacturas(facturasBack);
        assertThat(abonos.getFacturas()).isEqualTo(facturasBack);

        abonos.facturas(null);
        assertThat(abonos.getFacturas()).isNull();
    }
}
