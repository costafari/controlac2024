package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.LotesTestSamples.*;
import static sv.com.lc.controlac.domain.ProveedoresTestSamples.*;

import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class ProveedoresTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Proveedores.class);
        Proveedores proveedores1 = getProveedoresSample1();
        Proveedores proveedores2 = new Proveedores();
        assertThat(proveedores1).isNotEqualTo(proveedores2);

        proveedores2.setId(proveedores1.getId());
        assertThat(proveedores1).isEqualTo(proveedores2);

        proveedores2 = getProveedoresSample2();
        assertThat(proveedores1).isNotEqualTo(proveedores2);
    }

    @Test
    void lotesTest() {
        Proveedores proveedores = getProveedoresRandomSampleGenerator();
        Lotes lotesBack = getLotesRandomSampleGenerator();

        proveedores.setLotes(lotesBack);
        assertThat(proveedores.getLotes()).isEqualTo(lotesBack);
        assertThat(lotesBack.getProveedores()).isEqualTo(proveedores);

        proveedores.lotes(null);
        assertThat(proveedores.getLotes()).isNull();
        assertThat(lotesBack.getProveedores()).isNull();
    }
}
